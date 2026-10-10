// Approximation of the existing Zordev mark. Replace with the official SVG files when available.
export function ZMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="zd-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0E77EF" />
          <stop offset="1" stopColor="#F37842" />
        </linearGradient>
      </defs>
      <path d="M6 6h28v6H6z" fill="#10A0FF" />
      <path d="M34 12 14 28H6l20-16z" fill="#0E77EF" opacity="0.7" />
      <path d="M6 28h28v6H6z" fill="url(#zd-grad)" />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <ZMark />
      <span className="text-lg font-extrabold tracking-[0.18em]" aria-hidden="true">
        <span className={dark ? "text-white" : "text-navy"}>ZOR</span>
        <span className="text-orange">DEV</span>
      </span>
      <span className="sr-only">Zordev</span>
    </span>
  );
}
