"use client";

import { useState, type ReactNode } from "react";

/**
 * Infinite marquee with a visible pause control (WCAG 2.2.2). Also pauses on hover.
 * Content is rendered twice for a seamless loop; the copy is hidden from screen readers.
 */
export function Marquee({ children, label, className = "", trackClassName = "" }: { children: ReactNode; label: string; className?: string; trackClassName?: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className={`group relative ${className}`}>
      <div className="[mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] overflow-hidden">
        <div className={`flex w-max animate-marquee items-center group-hover:[animation-play-state:paused] ${paused ? "[animation-play-state:paused]" : ""} ${trackClassName}`}>
          <div className="flex items-center">{children}</div>
          <div className="flex items-center" aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={`${paused ? "Play" : "Pause"} ${label}`}
        className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-[#0c0c0c]/90 text-[10px] text-ink transition-colors hover:border-orange hover:text-orange"
      >
        <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
      </button>
    </div>
  );
}
