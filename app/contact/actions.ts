"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/content/site";
import { budgetLabel, checkSchema, contactSchema, isQualified, type ContactState } from "@/lib/contact";
import type { CheckState } from "@/lib/contact-options";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { icsFor, isBookable } from "@/lib/schedule";
import { verifyTurnstile } from "@/lib/turnstile";

const FAIL = `Something went wrong sending this. Please email ${site.email} directly and I'll reply ${site.commitments.replySla}.`;

/** Sends one email; returns false (and logs) instead of silently "succeeding" when Resend reports an error. */
async function sendMail(resend: Resend, msg: Parameters<Resend["emails"]["send"]>[0], tag: string) {
  try {
    const { error } = await resend.emails.send(msg);
    if (error) {
      console.error(`[${tag}] Resend rejected the email:`, error);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[${tag}] Resend request failed:`, e);
    return false;
  }
}

async function pushWebhook(payload: object, tag: string) {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) return;
  try {
    const res = await fetch(webhook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) console.error(`[${tag}] CRM webhook returned ${res.status}`);
  } catch (e) {
    console.error(`[${tag}] CRM webhook failed`, e);
  }
}

function mailer() {
  const apiKey = process.env.RESEND_API_KEY;
  return {
    resend: apiKey ? new Resend(apiKey) : null,
    to: process.env.CONTACT_TO_EMAIL ?? site.email,
    from: process.env.CONTACT_FROM_EMAIL ?? `${site.owner.name} at Zordev <${site.email}>`,
  };
}

function firstName(name: string) {
  return name.split(/\s+/)[0].replace(/[^\p{L}\p{M}'-]/gu, "").slice(0, 40) || "there";
}

/* ── Project brief ─────────────────────────────────────────────────────── */

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(
    ["name", "email", "company", "appUrl", "need", "budget", "timeline", "details", "source", "utm"].map((k) => [k, String(formData.get(k) ?? "")]),
  );
  raw.utm = raw.utm.slice(0, 500); // hidden field: never block a lead on it

  // Honeypot: bots fill hidden fields. Pretend success so they learn nothing.
  if (String(formData.get("website") ?? "") !== "") return { status: "success", qualified: false };

  // Validate first, so a typo doesn't use up the one-time spam-check token.
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["fieldErrors"]>;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values: raw };
  }

  const ip = clientIp(await headers());
  if (!(await rateLimit(`brief:${ip}`, 5, 10))) {
    return { status: "error", message: `Too many submissions. Please try again in a few minutes, or email ${site.email}.`, values: raw };
  }
  if (!(await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), ip))) {
    return { status: "error", message: "The spam check failed. Please try again.", values: raw };
  }

  const d = parsed.data;
  const qualified = isQualified(d.budget) || d.need === "Fix an AI-built app"; // the $500 audit fits small budgets
  const lead = { date: new Date().toISOString(), type: "brief", ...d, budget: budgetLabel(d.budget), qualified, status: "New" };
  const { resend, to, from } = mailer();

  if (!resend) {
    await pushWebhook(lead, "contact");
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] RESEND_API_KEY is not set; lead:", lead);
      return { status: "error", message: FAIL, values: raw };
    }
    console.info("[contact] Email not configured. Lead:", lead);
    return { status: "success", qualified, values: { need: d.need, budget: d.budget } };
  }

  // Owner notification first: if it fails, the visitor is told (and the lead still reaches the CRM).
  const summary = Object.entries(lead)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const ownerOk = await sendMail(resend, { from, to, replyTo: d.email, subject: `New inquiry: ${d.need} · ${lead.budget} · ${d.name}`, text: summary }, "contact");
  await pushWebhook({ ...lead, emailed: ownerOk }, "contact");
  if (!ownerOk) return { status: "error", message: FAIL, values: raw };

  // Auto-reply is best effort, limited per recipient so the form can't be used to mail someone repeatedly.
  if (await rateLimit(`reply:${d.email.toLowerCase()}`, 2, 24 * 60)) {
    await sendMail(resend, { from, to: d.email, replyTo: to, subject: "Thanks, I've got your project brief", text: autoReply(d.name, qualified) }, "contact");
  }

  return { status: "success", qualified, values: { need: d.need, budget: d.budget } };
}

function autoReply(name: string, qualified: boolean) {
  return [
    `Hi ${firstName(name)},`,
    "",
    `Thanks for sending your brief to Zordev. I read every inquiry myself and will reply ${site.commitments.replySla} (I'm in Dhaka, ${site.timezoneLabel}).`,
    "",
    qualified
      ? `If you'd like to talk sooner, you can pick a time for a free 20-minute call here: ${site.url}/contact#book`
      : "I'll reply with a few questions or some honest suggestions on the best way forward.",
    "",
    `In the meantime, you can see recent work at ${site.url}/work`,
    "",
    site.owner.name,
    "Zordev, web development studio",
    site.email,
  ].join("\n");
}

/* ── Free 3-risk check ─────────────────────────────────────────────────── */

export async function requestCheck(_prev: CheckState, formData: FormData): Promise<CheckState> {
  const raw = Object.fromEntries(
    ["name", "email", "appUrl", "builtWith", "stage", "worries", "consent", "utm"].map((k) => [k, String(formData.get(k) ?? "")]),
  );
  raw.utm = raw.utm.slice(0, 500);
  if (String(formData.get("website") ?? "") !== "") return { status: "success" };

  const parsed = checkSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: CheckState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<CheckState["fieldErrors"]>;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values: raw };
  }

  const ip = clientIp(await headers());
  if (!(await rateLimit(`check:${ip}`, 3, 60))) {
    return { status: "error", message: `Too many requests. Please try again later, or email ${site.email}.`, values: raw };
  }
  if (!(await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), ip))) {
    return { status: "error", message: "The spam check failed. Please try again.", values: raw };
  }

  const d = parsed.data;
  const lead = { date: new Date().toISOString(), type: "3-risk check", ...d, consent: "read-only review permitted", status: "New" };
  const { resend, to, from } = mailer();

  if (!resend) {
    await pushWebhook(lead, "check");
    if (process.env.NODE_ENV === "production") {
      console.error("[check] RESEND_API_KEY is not set; lead:", lead);
      return { status: "error", message: FAIL, values: raw };
    }
    console.info("[check] Email not configured. Lead:", lead);
    return { status: "success", stage: d.stage };
  }

  const summary = Object.entries(lead)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const ownerOk = await sendMail(resend, { from, to, replyTo: d.email, subject: `Free check: ${d.appUrl} · ${d.builtWith} · ${d.stage}`, text: summary }, "check");
  await pushWebhook({ ...lead, emailed: ownerOk }, "check");
  if (!ownerOk) return { status: "error", message: FAIL, values: raw };

  // Fixed wording only (no visitor-written text), at most 2 per address per day.
  if (await rateLimit(`reply:${d.email.toLowerCase()}`, 2, 24 * 60)) {
    await sendMail(
      resend,
      {
        from,
        to: d.email,
        replyTo: to,
        subject: "Your free 3-risk check",
        text: [
          `Hi ${firstName(d.name)},`,
          "",
          `Thanks for asking for a free 3-risk check. I'll email you ${site.commitments.replySla} with how to share read-only access.`,
          "Checks are capped at 3 a week, so if this week is full, I'll give you a date.",
          "",
          `While you wait, you can see recent work at ${site.url}/work`,
          "",
          site.owner.name,
          "Zordev, web development studio",
          site.email,
        ].join("\n"),
      },
      "check",
    );
  }
  return { status: "success", stage: d.stage };
}

/* ── Call requests from the built-in scheduler ─────────────────────────── */

export type CallState = {
  status: "idle" | "error" | "success";
  message?: string;
  slot?: number;
  values?: { name?: string; email?: string; note?: string };
};

const callSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
  slot: z.coerce.number().int(),
  tz: z.string().max(80),
});

export async function requestCall(_prev: CallState, formData: FormData): Promise<CallState> {
  if (String(formData.get("website") ?? "") !== "") return { status: "success", slot: Number(formData.get("slot")) || undefined };

  const values = { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? ""), note: String(formData.get("note") ?? "") };
  const parsed = callSchema.safeParse({ ...values, slot: formData.get("slot"), tz: formData.get("tz") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form.", values };
  const d = parsed.data;
  if (!isBookable(d.slot, Date.now())) return { status: "error", message: "That time is no longer available. Please pick another slot.", values };

  const ip = clientIp(await headers());
  if (!(await rateLimit(`call:${ip}`, 3, 60))) return { status: "error", message: `Too many requests. Please try again later or email ${site.email}.`, values };
  if (!(await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), ip))) {
    return { status: "error", message: "The spam check failed. Please try again.", values };
  }

  const fmt = (tz: string) =>
    new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: tz, timeZoneName: "short" }).format(d.slot);
  let visitorTime = fmt("UTC");
  try {
    visitorTime = fmt(d.tz);
  } catch {}
  const ownerTime = fmt("Asia/Dhaka");
  const ics = Buffer.from(icsFor(d.slot, d.email, Date.now())).toString("base64");
  const request = { date: new Date().toISOString(), type: "call", name: d.name, email: d.email, note: d.note, slot: ownerTime, visitorTime, status: "New" };
  const { resend, to, from } = mailer();

  if (!resend) {
    await pushWebhook(request, "call");
    if (process.env.NODE_ENV === "production") {
      console.error("[call] RESEND_API_KEY is not set; request:", request);
      return { status: "error", message: FAIL, values };
    }
    console.info("[call] Email not configured. Request:", request);
    return { status: "success", slot: d.slot };
  }

  const ownerOk = await sendMail(
    resend,
    {
      from,
      to,
      replyTo: d.email,
      subject: `Call request: ${d.name} · ${ownerTime}`,
      text: [
        `${d.name} <${d.email}> requested a 20-minute call.`,
        "",
        `Your time: ${ownerTime}`,
        `Their time: ${visitorTime} (${d.tz})`,
        "",
        d.note ? `Note: ${d.note}` : "No note.",
        "",
        "Reply to confirm and send a meeting link.",
      ].join("\n"),
      attachments: [{ filename: "zordev-call.ics", content: ics }],
    },
    "call",
  );
  await pushWebhook({ ...request, emailed: ownerOk }, "call");
  if (!ownerOk) return { status: "error", message: FAIL, values };

  // Visitor confirmation: fixed wording (no visitor-written text), at most 2 per address per day.
  if (await rateLimit(`reply:${d.email.toLowerCase()}`, 2, 24 * 60)) {
    await sendMail(
      resend,
      {
        from,
        to: d.email,
        replyTo: to,
        subject: "Your Zordev call request",
        text: [
          `Hi ${firstName(d.name)},`,
          "",
          `Thanks for requesting a call for ${visitorTime}. It's pencilled in, not confirmed yet: I'll confirm ${site.commitments.replySla} and send a meeting link.`,
          "If that time stops working for you, just reply to this email.",
          "",
          site.owner.name,
          "Zordev, web development studio",
          site.email,
        ].join("\n"),
        attachments: [{ filename: "zordev-call.ics", content: ics }],
      },
      "call",
    );
  }
  return { status: "success", slot: d.slot };
}
