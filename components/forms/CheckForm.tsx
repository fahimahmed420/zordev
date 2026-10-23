"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { requestCheck } from "@/app/contact/actions";
import { builtWithOptions, stageOptions, type CheckState } from "@/lib/contact-options";
import { Field, input } from "./ContactForm";
import { Select } from "./Select";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const track = (event: string, data?: Record<string, unknown>) => window.umami?.track(event, data);

/** The free 3-risk check: short on purpose, so visitors who aren't ready to talk still raise a hand. */
export function CheckForm() {
  const [state, action, pending] = useActionState<CheckState, FormData>(requestCheck, { status: "idle" });
  const utmRef = useRef<HTMLInputElement>(null);
  const turnstile = useRef<TurnstileInstance>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      track("check_form_submit", { stage: state.stage });
      doneRef.current?.focus();
    } else if (state.status === "error") {
      turnstile.current?.reset();
      track("check_form_error", { field: state.fieldErrors ? Object.keys(state.fieldErrors).join(",") : "server" });
    }
  }, [state]);

  if (state.status === "success")
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="rounded-2xl border border-orange/50 bg-surface p-8 focus:outline-none">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">Request received</p>
        <p className="mt-4 font-display text-3xl leading-snug text-ink">Got it.</p>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          I&apos;ll email you within one business day with how to share read-only access. Checks are capped at 3 a week, so if this week is full,
          I&apos;ll give you a date.
        </p>
        {state.stage === "Still building" && (
          <p className="mt-4 text-muted">
            Since you&apos;re still building, I&apos;ll also send the checklist I use, so you can avoid the common problems before launch.
          </p>
        )}
        <Link href="/work" className="link-u mt-6 inline-block text-ink">
          While you wait: see recent work →
        </Link>
      </div>
    );

  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};

  return (
    <form
      action={action}
      noValidate
      className="space-y-5"
      onSubmit={() => {
        try {
          if (utmRef.current) utmRef.current.value = sessionStorage.getItem("zd_utm") ?? "";
        } catch {}
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
      <Field label="App URL" name="appUrl" error={err.appUrl}>
        <input
          id="appUrl"
          name="appUrl"
          inputMode="url"
          required
          placeholder="yourapp.com"
          defaultValue={v.appUrl}
          className={input}
          aria-invalid={!!err.appUrl}
          aria-describedby={err.appUrl ? "appUrl-error" : undefined}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Built with" name="builtWith" error={err.builtWith}>
          <Select
            name="builtWith"
            options={builtWithOptions.map((o) => ({ value: o, label: o }))}
            placeholder="Choose one"
            defaultValue={v.builtWith}
            invalid={!!err.builtWith}
            describedBy={err.builtWith ? "builtWith-error" : undefined}
          />
        </Field>
        <Field label="Real users or a launch date?" name="stage" error={err.stage}>
          <Select
            name="stage"
            options={stageOptions.map((o) => ({ value: o, label: o }))}
            placeholder="Choose one"
            defaultValue={v.stage}
            invalid={!!err.stage}
            describedBy={err.stage ? "stage-error" : undefined}
          />
        </Field>
      </div>
      <Field label="Anything you're worried about?" name="worries" optional error={err.worries}>
        <textarea id="worries" name="worries" rows={3} defaultValue={v.worries} className={input} aria-invalid={!!err.worries} aria-describedby={err.worries ? "worries-error" : undefined} />
      </Field>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={v.consent === "on"}
            aria-invalid={!!err.consent}
            aria-describedby={err.consent ? "consent-error" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#f37842]"
          />
          <span>I give Zordev permission to review my app with read-only access I&apos;ll provide.</span>
        </label>
        {err.consent && (
          <p id="consent-error" className="mt-1.5 text-sm text-red-300">
            {err.consent}
          </p>
        )}
      </div>

      <input type="hidden" name="utm" ref={utmRef} />
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
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange px-7 py-3 font-semibold text-[#0c0c0c] hover:bg-ink disabled:opacity-60"
      >
        {pending ? "Sending…" : "Request my free check"}
      </button>
      <p className="text-sm text-muted">3 free checks a week. Read-only access, nothing in your app changes.</p>
    </form>
  );
}
