"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cta, nav } from "@/content/site";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-line bg-[#0c0c0c]/85 backdrop-blur-xl" : "border-transparent bg-[#0c0c0c]"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-ink focus:p-2 focus:text-[#0c0c0c]">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Zordev home">
          <Logo dark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`link-u flex items-center gap-2 py-1 text-sm transition-colors duration-200 ${active ? "text-ink" : "text-muted hover:text-ink"}`}
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
            className="magnetic hidden rounded-full bg-orange px-5 py-2.5 text-sm font-medium text-[#0c0c0c] hover:bg-ink sm:inline-flex"
          >
            {cta.primary.label}
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
          className="border-t border-line px-4 pb-6 pt-2 md:hidden"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <ul>
            {nav.map((item, i) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-baseline gap-4 py-4 font-display text-4xl ${active ? "text-ink" : "text-muted hover:text-ink"}`}
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
            className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-orange font-medium text-[#0c0c0c]"
          >
            {cta.primary.label}
          </Link>
        </nav>
      )}
    </header>
  );
}
