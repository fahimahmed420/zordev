"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/content/faq";

/** FAQ accordion with smooth height animation (grid-rows 0fr → 1fr). */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const base = useId();

  return (
    <div className="border-t border-line">
      {items.map((f, i) => {
        const isOpen = open === f.id;
        const btnId = `${base}-q-${i}`;
        const panelId = `${base}-a-${i}`;
        return (
          // data-reveal sits on a wrapper whose className never changes, so React re-renders can't strip the reveal class.
          <div key={f.id} data-reveal style={{ ["--d" as string]: `${i * 40}ms` }} className="border-b border-line">
            <h3 className="font-sans text-lg">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : f.id)}
                className={`group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-300 ${isOpen ? "text-orange" : "text-ink hover:text-orange"}`}
              >
                <span className="flex gap-5">
                  <span className="pt-1.5 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {f.q}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                    isOpen ? "rotate-45 border-orange bg-orange text-[#0c0c0c]" : "border-line-strong text-ink group-hover:border-orange"
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p
                  className={`max-w-2xl pb-7 pl-10 leading-relaxed text-muted transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                    isOpen ? "translate-y-0" : "-translate-y-2"
                  }`}
                >
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
