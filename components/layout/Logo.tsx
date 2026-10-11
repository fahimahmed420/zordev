// Approximation of the existing Zordev mark. Replace with the official SVG files when available.
// Hover (on the parent .group/logo): the bars slide apart, the diagonal flips to orange, the letters spread.
export function ZMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="zd-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0E77EF" />
          <stop offset="1" stopColor="#F37842" />
        </linearGradient>
      </defs>
      <path
        d="M6 6h28v6H6z"
        fill="#10A0FF"
        className="transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/logo:translate-x-[5px]"
      />
      <path
        d="M34 12 14 28H6l20-16z"
        className="fill-[#0E77EF] opacity-70 transition-[fill,opacity] duration-500 group-hover/logo:fill-[#F37842] group-hover/logo:opacity-100"
      />
      <path
        d="M6 28h28v6H6z"
        fill="url(#zd-grad)"
        className="transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/logo:-translate-x-[5px]"
      />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="group/logo flex items-center gap-2.5">
      <span className="transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/logo:-rotate-6 group-hover/logo:scale-110">
        <ZMark />
      </span>
      <span
        className="text-lg font-extrabold tracking-[0.18em] transition-[letter-spacing] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/logo:tracking-[0.3em]"
        aria-hidden="true"
      >
        <span className={`transition-colors duration-300 group-hover/logo:text-orange ${dark ? "text-white" : "text-navy"}`}>ZOR</span>
        <span className="text-orange transition-colors duration-300 group-hover/logo:text-white">DEV</span>
      </span>
      <span className="sr-only">Zordev</span>
    </span>
  );
}
