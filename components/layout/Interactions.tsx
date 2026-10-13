"use client";

import { useEffect } from "react";

/**
 * One tiny, delegated script powers every interaction on the site:
 * spotlight borders (.spot), 3D tilt (.tilt), magnetic buttons (.magnetic) and scroll reveals ([data-reveal]).
 * No animation library; everything else is CSS.
 */
export function Interactions() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    let frame = 0;
    let last: PointerEvent | null = null;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    const run = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target as Element | null;

      const spot = target?.closest<HTMLElement>(".spot");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--x", `${e.clientX - r.left}px`);
        spot.style.setProperty("--y", `${e.clientY - r.top}px`);
      }

      const t = target?.closest<HTMLElement>(".tilt") ?? null;
      if (tilt && tilt !== t) {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
      }
      tilt = t;
      if (t) {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        t.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
        t.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
      }

      const m = target?.closest<HTMLElement>(".magnetic") ?? null;
      if (magnet && magnet !== m) {
        magnet.style.setProperty("--mx", "0px");
        magnet.style.setProperty("--my", "0px");
      }
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.setProperty("--mx", `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px`);
        m.style.setProperty("--my", `${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(run);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Reveal on scroll. A MutationObserver picks up content that streams in or arrives on navigation.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("js");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
    // Track observed elements in memory, never in DOM attributes: changing attributes before
    // React has hydrated a streamed segment causes hydration mismatches.
    const seen = new WeakSet<Element>();
    const scan = () =>
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });

    // Batch to one scan per frame (the hero types into the DOM continuously).
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (!queued) queued = requestAnimationFrame(() => ((queued = 0), scan()));
    });

    // Start only once the page has loaded and React has finished hydrating (the "in" class is a DOM change too).
    let safety = 0;
    const start = () => {
      // Anything already on screen counts as revealed, so it never flashes out and back in.
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("in");
          seen.add(el);
        }
      });
      document.documentElement.classList.add("js");
      scan();
      mo.observe(document.body, { childList: true, subtree: true });
      // Safety net: if something is on screen but was never revealed, show everything.
      safety = window.setTimeout(() => {
        const stuck = [...document.querySelectorAll("[data-reveal]:not(.in)")].some((el) => {
          const r = el.getBoundingClientRect();
          return r.top < window.innerHeight && r.bottom > 0;
        });
        if (stuck) document.documentElement.classList.remove("js");
      }, 2000);
    };
    let idleId = 0;
    const onLoad = () => {
      idleId = typeof requestIdleCallback === "function" ? requestIdleCallback(start, { timeout: 500 }) : setTimeout(start, 150) as unknown as number;
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      window.removeEventListener("load", onLoad);
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idleId);
      clearTimeout(idleId);
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(queued);
      clearTimeout(safety);
    };
  }, []);

  return null;
}
