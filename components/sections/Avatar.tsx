/**
 * Fahim's illustrated avatar.
 * Artwork: "Avataaars" by Pablo Stanley (https://avataaars.com/), generated with DiceBear. Free for personal and commercial use.
 */
export function Avatar({ size = "lg" }: { size?: "sm" | "lg" }) {
  if (size === "sm")
    return (
      // eslint-disable-next-line @next/next/no-img-element -- tiny static SVG, no optimisation needed
      <img src="/avatar.svg" alt="Illustration of Fahim Ahmed" width={72} height={72} className="h-[72px] w-[72px] shrink-0 rounded-full border border-line-strong bg-[#2a1a12]" />
    );
  return (
    <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-[radial-gradient(circle_at_50%_40%,#2a1a12,#141414_60%,#0f0f0f)]">
      <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-60" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/20 blur-3xl" />
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
      <img src="/avatar.svg" alt="Illustration of Fahim Ahmed" width={280} height={280} className="absolute inset-x-0 bottom-0 mx-auto h-auto w-[82%] select-none" />
      <div className="absolute bottom-4 left-4 rounded-full border border-line-strong bg-[#0c0c0c]/90 px-3 py-1.5 font-mono text-[11px] text-ink backdrop-blur">
        <span aria-hidden="true" className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-orange align-middle" />
        you talk to me, I write the code
      </div>
    </div>
  );
}
