"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cta, nav } from "@/content/site";
import { Logo } from "./Logo";

/** Floating glass navbar: a rounded pill inset from the top that tightens on scroll. */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <a
        href="#main"
        className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-ink focus:p-2 focus:text-[#0c0c0c]"
      >
        Skip to content
      </a>
      <div
        className={`pointer-events-auto mx-auto flex items-center justify-between rounded-full border pl-5 pr-2 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          scrolled || open
            ? "h-14 max-w-4xl border-line-strong bg-[#121212]/85"
            : "h-16 max-w-6xl border-line bg-[#141414]/60"
        }`}
      >
        <Link href="/" aria-label="Zordev home" className="shrink-0">
          <Logo dark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                  active ? "bg-white/[0.07] text-ink" : "text-muted hover:bg-white/[0.04] hover:text-ink"
                }`}
              >
                {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-orange" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={cta.primary.href}
            data-umami-event="cta_click"
            data-umami-event-location="header"
            className="magnetic group/cta hidden items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-medium text-[#0c0c0c] hover:bg-ink sm:inline-flex"
          >
            {cta.primary.label}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-0.5">
              →
            </span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 9h16M4 15h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="reveal pointer-events-auto mx-auto mt-2 max-w-4xl rounded-3xl border border-line-strong bg-[#121212]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl md:hidden"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <ul>
            {nav.map((item, i) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href} className="border-b border-line last:border-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-baseline gap-4 px-2 py-3.5 font-display text-3xl ${active ? "text-ink" : "text-muted hover:text-ink"}`}
                  >
                    <span className="font-mono text-xs text-orange">0{i + 1}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={cta.primary.href}
            data-umami-event="cta_click"
            data-umami-event-location="mobile_menu"
            className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-orange font-medium text-[#0c0c0c]"
          >
            {cta.primary.label}
          </Link>
        </nav>
      )}
    </header>
  );
}
