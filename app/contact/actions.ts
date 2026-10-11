"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { site } from "@/content/site";
import { budgetLabel, contactSchema, isQualified, type ContactState } from "@/lib/contact";
import { rateLimit } from "@/lib/ratelimit";
import { icsFor, isBookable } from "@/lib/schedule";
import { z } from "zod";

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production"; // allowed in dev only
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(
    ["name", "email", "company", "need", "budget", "timeline", "details", "source", "utm"].map((k) => [k, String(formData.get(k) ?? "")]),
  );

  // Honeypot: bots fill hidden fields. Pretend success so they learn nothing.
  if (String(formData.get("website") ?? "") !== "") return { status: "success", qualified: false };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";

  if (!(await rateLimit(ip))) {
    return { status: "error", message: "Too many submissions. Please try again in a few minutes, or email me directly.", values: raw };
  }

  if (!(await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), ip))) {
    return { status: "error", message: "The spam check failed. Please try again.", values: raw };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["fieldErrors"]>;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values: raw };
  }

  const d = parsed.data;
  const qualified = isQualified(d.budget);
  const lead = { date: new Date().toISOString(), ...d, budget: budgetLabel(d.budget), qualified, status: "New" };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Fahim at Zordev <fahim@zordev.com>";

  try {
    if (apiKey) {
      const resend = new Resend(apiKey);
      const summary = Object.entries(lead)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      await resend.emails.send({
        from,
        to,
        replyTo: d.email,
        subject: `New inquiry: ${d.need} · ${lead.budget} · ${d.name}`,
        text: summary,
      });
      await resend.emails.send({
        from,
        to: d.email,
        replyTo: to,
        subject: "Thanks, I've got your project brief",
        text: autoReply(d.name, qualified),
      });
    } else if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    } else {
      console.info("[contact] Email not configured. Lead:", lead);
    }

    const webhook = process.env.LEAD_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(lead) }).catch((e) =>
        console.error("[contact] CRM webhook failed", e),
      );
    }
  } catch (e) {
    console.error("[contact] send failed", e);
    return {
      status: "error",
      message: `Something went wrong sending your brief. Please email ${site.email} directly.`,
      values: raw,
    };
  }

  return { status: "success", qualified };
}

function autoReply(name: string, qualified: boolean) {
  const first = name.split(" ")[0];
  return [
    `Hi ${first},`,
    "",
    `Thanks for sending your project brief to Zordev. I read every inquiry myself and will reply ${site.commitments.replySla} (I'm in Dhaka, ${site.timezoneLabel}).`,
    "",
    qualified
      ? `If you'd like to talk sooner, you can pick a time for a free 20-minute call here: ${site.url}/contact#book`
      : "I'll reply with a few questions or some honest suggestions on the best way forward.",
    "",
    "In the meantime, you can see recent work at https://zordev.com/work",
    "",
    `${site.owner.name}`,
    "Zordev, web development studio",
    site.email,
  ].join("\n");
}

/* ── Call requests from the built-in scheduler ─────────────────────────── */

export type CallState = { status: "idle" | "error" | "success"; message?: string; slot?: number };

const callSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
  slot: z.coerce.number().int(),
  tz: z.string().max(80),
});

export async function requestCall(_prev: CallState, formData: FormData): Promise<CallState> {
  if (String(formData.get("website") ?? "") !== "") return { status: "success" };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  if (!(await rateLimit(ip))) return { status: "error", message: "Too many requests. Please try again in a few minutes." };

  const parsed = callSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  const d = parsed.data;
  if (!isBookable(d.slot, Date.now())) return { status: "error", message: "That time is no longer available. Please pick another slot." };

  const fmt = (tz: string) =>
    new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: tz, timeZoneName: "short" }).format(d.slot);
  let visitorTime = fmt("UTC");
  try {
    visitorTime = fmt(d.tz);
  } catch {}
  const ownerTime = fmt("Asia/Dhaka");
  const ics = Buffer.from(icsFor(d.slot, d.email)).toString("base64");
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? `${site.owner.name} at Zordev <${site.email}>`;

  try {
    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: d.email,
        subject: `Call request: ${d.name} · ${ownerTime}`,
        text: [`${d.name} <${d.email}> requested a 20-minute call.`, "", `Your time: ${ownerTime}`, `Their time: ${visitorTime} (${d.tz})`, "", d.note ? `Note: ${d.note}` : "No note.", "", "Reply to confirm and send a meeting link."].join("\n"),
        attachments: [{ filename: "zordev-call.ics", content: ics }],
      });
      await resend.emails.send({
        from,
        to: d.email,
        replyTo: to,
        subject: "Your Zordev call request",
        text: [
          `Hi ${d.name.split(" ")[0]},`,
          "",
          `Thanks for requesting a call for ${visitorTime}. I'll confirm ${site.commitments.replySla} and send a meeting link.`,
          "If that time stops working for you, just reply to this email.",
          "",
          site.owner.name,
          "Zordev, web development studio",
          site.email,
        ].join("\n"),
        attachments: [{ filename: "zordev-call.ics", content: ics }],
      });
    } else if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    } else {
      console.info("[call] Email not configured. Request:", { ...d, ownerTime, visitorTime });
    }
    const webhook = process.env.LEAD_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString(), type: "call", name: d.name, email: d.email, note: d.note, slot: ownerTime, status: "New" }),
      }).catch((e) => console.error("[call] CRM webhook failed", e));
    }
  } catch (e) {
    console.error("[call] send failed", e);
    return { status: "error", message: `Something went wrong. Please email ${site.email} directly.` };
  }
  return { status: "success", slot: d.slot };
}
