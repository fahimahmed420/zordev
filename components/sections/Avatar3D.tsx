"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * 3D character for the About page. It tilts towards the pointer and floats.
 * Artwork: "Man technologist" (medium-dark), Microsoft Fluent Emoji 3D, MIT License,
 * https://github.com/microsoft/fluentui-emoji
 */
export function Avatar3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
        setLook({ x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-[radial-gradient(circle_at_50%_40%,#2a1a12,#141414_60%,#0f0f0f)]" aria-hidden="true">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/25 blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: `translate(calc(-50% + ${look.x * 18}px), calc(-50% + ${look.y * 14}px))` }}
      />
      {/* Ground shadow */}
      <div className="absolute bottom-[13%] left-1/2 h-5 w-40 -translate-x-1/2 rounded-[50%] bg-black/70 blur-md" />

      <div className="absolute inset-0 flex items-center justify-center [perspective:900px]">
        <div className="animate-float">
          <div
            className="transition-transform duration-300 ease-out"
            style={{ transform: `rotateY(${look.x * 14}deg) rotateX(${-look.y * 10}deg) translateZ(0)` }}
          >
            <Image
              src="/avatar-3d.png"
              alt=""
              width={256}
              height={256}
              priority
              className="h-auto w-[220px] select-none drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)] sm:w-[256px]"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 rounded-full border border-line-strong bg-[#0c0c0c]/90 px-3 py-1.5 font-mono text-[11px] text-ink backdrop-blur">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-orange align-middle" />
        building something
      </div>
    </div>
  );
}
