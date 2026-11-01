"use client";

import { useState } from "react";
import { processSteps } from "@/content/process";

type Step = (typeof processSteps)[number];

export function ProcessTabs() {
  const [active, setActive] = useState(0);
  const s = processSteps[active];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div
        role="tablist"
        aria-label="Process steps"
        aria-orientation="vertical"
        className="relative flex flex-col gap-2"
        onKeyDown={(e) => {
          const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
          let next = active;
          if (e.key in keys) next = (active + keys[e.key] + processSteps.length) % processSteps.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = processSteps.length - 1;
          else return;
          e.preventDefault();
          setActive(next);
          (e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[next])?.focus();
        }}
      >
        <span aria-hidden="true" className="absolute bottom-8 left-[27px] top-8 w-px bg-line">
          <span
            className="absolute inset-x-0 top-0 hidden bg-gradient-to-b from-orange to-orange transition-[height] duration-500 lg:block"
            style={{ height: `${(active / (processSteps.length - 1)) * 100}%` }}
          />
        </span>
        {processSteps.map((step, i) => (
          <div key={step.n}>
            <button
              role="tab"
              id={`step-tab-${i}`}
              aria-selected={active === i}
              aria-controls="step-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onMouseEnter={() => matchMedia("(hover: hover)").matches && setActive(i)}
              className={`relative flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left transition-colors ${active === i ? "bg-surface-2" : "hover:bg-surface-2"}`}
            >
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-all ${
                  i <= active ? "border-transparent bg-orange text-[#0c0c0c]" : "border-line-strong bg-surface text-muted"
                }`}
              >
                {step.n}
              </span>
              <span className="flex-1">
                <span className={`block font-display text-2xl ${active === i ? "text-ink" : "text-muted"}`}>{step.name}</span>
                <span className="block font-mono text-xs text-muted">{step.duration}</span>
              </span>
              <span aria-hidden="true" className={`text-muted transition-transform lg:hidden ${active === i ? "rotate-45 text-orange" : ""}`}>
                +
              </span>
            </button>
            {/* Phones: details open right under the tapped step instead of below the whole list. */}
            {active === i && (
              <div className="reveal relative z-10 mb-2 ml-12 mt-2 rounded-2xl border border-line bg-surface p-4 lg:hidden">
                <Details s={step} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div id="step-panel" role="tabpanel" aria-labelledby={`step-tab-${active}`} key={active} className="spot reveal hidden rounded-3xl p-9 lg:block">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Step 0{s.n}</p>
        <h3 className="mt-3 text-5xl">{s.name}</h3>
        <div className="mt-4">
          <Details s={s} />
        </div>
      </div>
    </div>
  );
}

function Details({ s }: { s: Step }) {
  return (
    <>
      <p className="text-muted lg:text-lg">{s.what}</p>
      <dl className="mt-4 grid gap-3 lg:mt-8 lg:grid-cols-2 lg:gap-4">
        <div className="rounded-xl bg-surface-2 p-4 lg:rounded-2xl lg:p-5">
          <dt className="text-sm font-semibold text-ink">What I need from you</dt>
          <dd className="mt-1.5 text-sm text-muted">{s.fromClient}</dd>
        </div>
        <div className="rounded-xl bg-surface-2 p-4 lg:rounded-2xl lg:p-5">
          <dt className="text-sm font-semibold text-ink">What you get</dt>
          <dd className="mt-1.5 text-sm text-muted">{s.clientGets}</dd>
        </div>
      </dl>
    </>
  );
}
