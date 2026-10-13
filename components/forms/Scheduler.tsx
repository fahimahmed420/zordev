"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useActionState, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { requestCall, type CallState } from "@/app/contact/actions";
import { site } from "@/content/site";
import { availableDays } from "@/lib/schedule";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const track = (event: string, data?: Record<string, unknown>) => window.umami?.track(event, data);
const noop = () => () => {};
const clientNow = () => Math.floor(Date.now() / 60_000) * 60_000; // stable within a minute
const serverNow = () => 0;

/** Built-in scheduler: slots come from the owner's Dhaka hours and are shown in the visitor's time zone. */
export function Scheduler() {
  const now = useSyncExternalStore(noop, clientNow, serverNow);
  const tz = useSyncExternalStore(noop, () => Intl.DateTimeFormat().resolvedOptions().timeZone, () => "UTC");
  // Slots come from Dhaka windows (which can cross midnight); group them by the visitor's own calendar day.
  const days = useMemo(() => {
    if (!now) return [];
    const keyOf = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: tz });
    const map = new Map<string, number[]>();
    for (const t of availableDays(now).flatMap((d) => d.slots)) {
      const k = keyOf.format(t);
      map.set(k, [...(map.get(k) ?? []), t]);
    }
    return [...map].map(([key, slots]) => ({ key, slots }));
  }, [now, tz]);
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<number | null>(null);
  const [state, action, pending] = useActionState<CallState, FormData>(requestCall, { status: "idle" });
  const turnstile = useRef<TurnstileInstance>(null);

  useEffect(() => {
    if (state.status === "success") track("call_requested");
    if (state.status === "error") {
      track("call_request_error", { message: state.message });
      turnstile.current?.reset(); // tokens are single-use
    }
  }, [state]);

  const fmtDay = (key: string) => {
    const d = new Date(`${key}T12:00:00Z`);
    return {
      dow: new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "UTC" }).format(d),
      date: new Intl.DateTimeFormat("en", { day: "numeric", timeZone: "UTC" }).format(d),
      month: new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(d),
    };
  };
  const fmtTime = (t: number) => new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(t);
  const fmtFull = (t: number) =>
    new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit", timeZone: tz }).format(t);

  if (state.status === "success" && state.slot) {
    return (
      <div className="spot reveal rounded-2xl p-8" role="status">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">Request sent</p>
        <p className="mt-4 font-display text-4xl leading-tight text-ink">{fmtFull(state.slot)}</p>
        <p className="mt-3 text-muted">
          It&apos;s pencilled in, not confirmed yet. I&apos;ll confirm by email {site.commitments.replySla} with a meeting link, and a tentative calendar entry is attached to your confirmation email.
        </p>
      </div>
    );
  }

  if (!now) return <div className="spot h-[420px] rounded-2xl" />;

  const day = days[dayIdx];

  return (
    <form action={action} className="spot overflow-hidden rounded-2xl" onSubmit={() => track("call_request_submit")}>
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <p className="font-medium text-ink">20-minute discovery call</p>
        <p className="font-mono text-xs text-muted">Times in {tz.replace(/_/g, " ")}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-line px-6 py-4 [scrollbar-width:thin]">
        {days.map((d, i) => {
          const f = fmtDay(d.key);
          const on = i === dayIdx;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => {
                setDayIdx(i);
                setSlot(null);
                track("booking_day_select");
              }}
              aria-pressed={on}
              className={`flex min-w-[4.25rem] shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 transition-colors ${
                on ? "border-orange bg-orange text-[#0c0c0c]" : "border-line-strong text-muted hover:border-orange hover:text-ink"
              }`}
            >
              <span className="text-[11px] uppercase tracking-wide">{f.dow}</span>
              <span className="font-display text-2xl leading-none">{f.date}</span>
              <span className="text-[11px]">{f.month}</span>
            </button>
          );
        })}
      </div>

      <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto px-6 py-5 sm:grid-cols-4">
        {day?.slots.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setSlot(t);
              track("booking_slot_select");
            }}
            aria-pressed={slot === t}
            className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
              slot === t ? "border-orange bg-orange text-[#0c0c0c]" : "border-line-strong text-ink hover:border-orange hover:text-orange"
            }`}
          >
            {fmtTime(t)}
          </button>
        ))}
      </div>

      <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${slot ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden" inert={!slot}>
          <div className="space-y-4 border-t border-line px-6 py-5">
            {slot && <p className="text-sm text-ink">{fmtFull(slot)}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-ink">
                Your name
                <input key={`n-${state.values?.name}`} name="name" required autoComplete="name" defaultValue={state.values?.name} className={input} />
              </label>
              <label className="text-sm font-medium text-ink">
                Email
                <input key={`e-${state.values?.email}`} name="email" type="email" required autoComplete="email" defaultValue={state.values?.email} className={input} />
              </label>
            </div>
            <label className="block text-sm font-medium text-ink">
              What would you like to talk about? <span className="font-normal text-muted">(optional)</span>
              <input key={`m-${state.values?.note}`} name="note" defaultValue={state.values?.note} className={input} />
            </label>
            <input type="hidden" name="slot" value={slot ?? ""} />
            <input type="hidden" name="tz" value={tz} />
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {siteKey && <Turnstile ref={turnstile} siteKey={siteKey} options={{ theme: "dark", size: "flexible" }} />}
            {state.status === "error" && (
              <p role="alert" className="text-sm text-red-300">
                {state.message}
              </p>
            )}
            <button
              type="submit"
              disabled={pending || !slot}
              className="inline-flex min-h-12 items-center rounded-full bg-orange px-6 font-medium text-[#0c0c0c] transition-colors hover:bg-ink disabled:opacity-60"
            >
              {pending ? "Sending…" : "Request this time →"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

const input =
  "mt-1.5 block w-full rounded-xl border border-[#706a62] bg-[#0f0f0f] px-4 py-3 font-normal text-ink placeholder:text-[#8a847c] focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30";
