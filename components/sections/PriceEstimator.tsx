"use client";

import { ButtonLink } from "@/components/ui";
import { useState } from "react";
import type { Package } from "@/content/pricing";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export function PriceEstimator({ packages, addOn }: { packages: Package[]; addOn: { name: string; from: number } }) {
  const [id, setId] = useState(packages[2]?.id ?? packages[0].id);
  const [withAi, setWithAi] = useState(false);
  const p = packages.find((x) => x.id === id) ?? packages[0];
  const total = p.fromPrice + (withAi ? addOn.from : 0);

  return (
    <div className="spot overflow-hidden rounded-[2rem]">
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        <div className="p-7 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Quick estimate</p>
          <h3 className="mt-3 text-4xl sm:text-5xl">What are you <em>building?</em></h3>
          <div
            role="radiogroup"
            aria-label="Project type"
            className="mt-7 flex flex-wrap gap-2"
            onKeyDown={(ev) => {
              const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
              if (!(ev.key in keys)) return;
              ev.preventDefault();
              const i = packages.findIndex((x) => x.id === id);
              const next = (i + keys[ev.key] + packages.length) % packages.length;
              setId(packages[next].id);
              (ev.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]")[next])?.focus();
            }}
          >
            {packages.map((x) => (
              <button
                key={x.id}
                role="radio"
                aria-checked={id === x.id}
                tabIndex={id === x.id ? 0 : -1}
                onClick={() => setId(x.id)}
                className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                  id === x.id ? "border-transparent bg-ink text-[#0c0c0c]" : "border-line-strong text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {x.name}
              </button>
            ))}
          </div>
          <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm text-muted">
            <span className="relative inline-flex h-6 w-11 shrink-0">
              <input type="checkbox" checked={withAi} onChange={(e) => setWithAi(e.target.checked)} className="peer sr-only" />
              <span className="absolute inset-0 rounded-full bg-line-strong transition-colors peer-checked:bg-orange peer-focus-visible:ring-2 peer-focus-visible:ring-orange" />
              <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
            </span>
            Add an {addOn.name} (+{usd(addOn.from)})
          </label>
          <ul className="mt-7 grid gap-2 text-sm text-muted sm:grid-cols-2">
            {p.includes.map((i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className="text-orange">✦</span>
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex flex-col justify-between gap-8 border-t border-line bg-surface-2 p-7 sm:p-10 lg:border-l lg:border-t-0">
          <div aria-live="polite">
            <p className="text-sm text-muted">Starting from</p>
            <p key={total} className="reveal mt-1 font-display text-7xl sm:text-8xl">
              {usd(total)}
            </p>
            <p className="mt-3 font-mono text-sm text-muted">Typical timeline · {p.timeline}</p>
            <p className="mt-4 text-sm text-muted">{p.suits}. Final price is fixed after a short call, for an agreed scope.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact#book" location="estimator">
              Book a call
            </ButtonLink>
            <ButtonLink href="/pricing" variant="ghost">
              Full pricing
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
