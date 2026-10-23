"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { submitContact } from "@/app/contact/actions";
import { Select } from "./Select";
import { budgetOptions, needOptions, timelineOptions, type ContactState } from "@/lib/contact-options";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}

const track = (event: string, data?: Record<string, unknown>) => window.umami?.track(event, data);

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const router = useRouter();
  const utmRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const turnstile = useRef<TurnstileInstance>(null);

  useEffect(() => {
    if (state.status === "success") {
      try {
        sessionStorage.setItem("zd_qualified", state.qualified ? "1" : "0");
      } catch {}
      track("contact_form_submit", { qualified: !!state.qualified, need: state.values?.need, budget: state.values?.budget });
      router.push("/thank-you");
    } else if (state.status === "error") {
      turnstile.current?.reset(); // spam-check tokens are single-use
      if (state.fieldErrors) Object.keys(state.fieldErrors).forEach((field) => track("contact_form_error", { field }));
      else track("contact_form_error", { field: "server", message: state.message });
    }
  }, [state, router]);

  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};

  return (
    <form
      action={action}
      noValidate
      onSubmit={() => {
        try {
          if (utmRef.current) utmRef.current.value = sessionStorage.getItem("zd_utm") ?? "";
        } catch {}
      }}
      className="space-y-5"
      onFocus={() => {
        if (!started.current) {
          started.current = true;
          track("contact_form_start");
        }
      }}
    >
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl border border-red-400/40 bg-red-950/40 p-4 text-sm text-red-200">
          {state.message}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={err.name}>
          <input id="name" name="name" autoComplete="name" required defaultValue={v.name} className={input} aria-invalid={!!err.name} aria-describedby={err.name ? "name-error" : undefined} />
        </Field>
        <Field label="Email" name="email" error={err.email}>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} className={input} aria-invalid={!!err.email} aria-describedby={err.email ? "email-error" : undefined} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company" name="company" optional error={err.company}>
          <input id="company" name="company" autoComplete="organization" defaultValue={v.company} className={input} aria-invalid={!!err.company} aria-describedby={err.company ? "company-error" : undefined} />
        </Field>
        <Field label="Link to your app or repo" name="appUrl" optional error={err.appUrl}>
          <input id="appUrl" name="appUrl" inputMode="url" defaultValue={v.appUrl} className={input} aria-invalid={!!err.appUrl} aria-describedby={err.appUrl ? "appUrl-error" : undefined} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="What do you need?" name="need" error={err.need}>
          <Select
            name="need"
            options={needOptions.map((o) => ({ value: o, label: o }))}
            placeholder="Choose one"
            defaultValue={v.need}
            invalid={!!err.need}
            describedBy={err.need ? "need-error" : undefined}
          />
        </Field>
        <Field label="Budget" name="budget" error={err.budget}>
          <Select
            name="budget"
            options={budgetOptions.map((o) => ({ value: o.value, label: o.label }))}
            placeholder="Choose a range"
            defaultValue={v.budget}
            invalid={!!err.budget}
            describedBy={err.budget ? "budget-error" : undefined}
          />
        </Field>
        <Field label="Timeline" name="timeline" error={err.timeline}>
          <Select
            name="timeline"
            options={timelineOptions.map((o) => ({ value: o, label: o }))}
            placeholder="Choose one"
            defaultValue={v.timeline}
            invalid={!!err.timeline}
            describedBy={err.timeline ? "timeline-error" : undefined}
          />
        </Field>
      </div>
      <Field label="Project details" name="details" error={err.details}>
        <textarea
          id="details"
          name="details"
          rows={6}
          required
          defaultValue={v.details}
          placeholder="What are you building, who is it for, and what does success look like?"
          className={input}
          aria-invalid={!!err.details}
          aria-describedby={err.details ? "details-error" : undefined}
        />
      </Field>
      <Field label="How did you hear about Zordev?" name="source" optional error={err.source}>
        <input id="source" name="source" defaultValue={v.source} className={input} aria-invalid={!!err.source} aria-describedby={err.source ? "source-error" : undefined} />
      </Field>

      <input type="hidden" name="utm" ref={utmRef} />
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {siteKey && <Turnstile ref={turnstile} siteKey={siteKey} options={{ theme: "dark", size: "flexible" }} />}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-orange px-7 py-3 font-semibold text-[#0c0c0c] hover:bg-ink disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send brief"}
      </button>
    </form>
  );
}

export const input =
  "mt-1.5 block w-full rounded-xl border border-[#706a62] bg-[#0f0f0f] px-4 py-3 text-ink placeholder:text-[#8a847c] focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30 aria-[invalid=true]:border-red-400";

export function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label id={`${name}-label`} htmlFor={name} className="text-sm font-semibold">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
