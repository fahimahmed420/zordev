import Link from "next/link";
import type { ReactNode } from "react";
import { isPh, type Text } from "@/lib/placeholder";

export function T({ v }: { v: Text }) {
  if (isPh(v)) return <span className="ph">[PLACEHOLDER: {v.note}]</span>;
  return <>{v}</>;
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = "",
  dark = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={`relative border-t border-line py-20 sm:py-28 ${dark ? "bg-paper" : ""} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Editorial section label: "(01) — Services". */
export function Eyebrow({ children, n }: { children: ReactNode; n?: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
      {n && <span className="text-orange">({n})</span>}
      <span className="h-px w-8 bg-line-strong" />
      {children}
    </p>
  );
}

export function Heading({
  eyebrow,
  n,
  title,
  intro,
  as: As = "h2",
}: {
  eyebrow?: string;
  n?: string;
  title: ReactNode;
  intro?: string;
  dark?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-3xl" data-reveal={As === "h2" ? "" : undefined}>
      {eyebrow && <Eyebrow n={n}>{eyebrow}</Eyebrow>}
      <As className={`mt-5 leading-[1.02] ${As === "h1" ? "text-6xl sm:text-8xl" : "text-5xl sm:text-6xl"}`}>{title}</As>
      {intro && <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

/** Inner-page header: oversized serif title with intro set in a side column. */
export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="grid-bg absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[10%] h-[26rem] w-[26rem] rounded-full bg-orange/[0.07] blur-[120px]" />
      <Container className="relative pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="reveal">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 className="reveal mt-6 max-w-5xl text-6xl leading-[0.98] sm:text-8xl" style={{ ["--d" as string]: "80ms" }}>
          {title}
        </h1>
        {(intro || children) && (
          <div className="reveal mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_1.2fr]" style={{ ["--d" as string]: "160ms" }}>
            {intro && <p className="max-w-md text-lg leading-relaxed text-muted md:col-start-2">{intro}</p>}
            {children && <div className="md:col-start-2">{children}</div>}
          </div>
        )}
      </Container>
    </section>
  );
}

const btnBase = "magnetic group/btn inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  location,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "ghostDark";
  location?: string;
}) {
  const styles = {
    primary: "bg-orange text-[#0c0c0c] hover:bg-ink",
    ghost: "border border-line-strong text-ink hover:border-ink",
    ghostDark: "border border-line-strong text-ink hover:border-ink",
  }[variant];
  return (
    <Link
      href={href}
      className={`${btnBase} ${styles}`}
      data-umami-event={location ? "cta_click" : undefined}
      data-umami-event-location={location}
      data-umami-event-label={location ? String(children) : undefined}
    >
      {children}
      <span aria-hidden="true" className="transition-transform group-hover/btn:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

export function Badge({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "orange" | "gray" }) {
  // Solid dark chips so they stay legible on top of images and cover art.
  const dot = { blue: "bg-blue-ink", orange: "bg-orange", gray: "bg-muted" }[tone];
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-[#0c0c0c]/90 px-3 py-1 font-mono text-[11px] text-ink backdrop-blur">
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
}

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
