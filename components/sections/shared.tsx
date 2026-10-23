import Image from "next/image";
import Link from "next/link";
import type { Text } from "@/lib/placeholder";
import { cta, site } from "@/content/site";
import type { FaqItem } from "@/content/faq";
import { FaqAccordion } from "./FaqAccordion";
import { labelText, type CaseStudy } from "@/content/work";
import { Badge, ButtonLink, Container, Heading, Section } from "@/components/ui";
import { JsonLd } from "@/lib/seo";

/** Editorial closing band: oversized serif line, email, and the two CTAs. */
export function CtaBand({ title = "Have a project in mind?", location }: { title?: string; location: string }) {
  const words = title.split(" ");
  const last = words.pop();
  return (
    <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-orange/[0.08] blur-[120px]" />
      <Container className="relative">
        <div data-reveal>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
            </span>
            Next step
          </p>
          <h2 className="mt-6 max-w-4xl text-6xl leading-[0.98] sm:text-8xl">
            {words.join(" ")} <em>{last}</em>
          </h2>
        </div>
        <div data-reveal style={{ ["--d" as string]: "120ms" }} className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <a href={`mailto:${site.email}`} className="link-u font-display text-3xl text-ink sm:text-4xl">
              {site.email}
            </a>
            <p className="mt-3 max-w-xl text-muted">
              A free 20-minute call or a written brief. I reply {site.commitments.replySla}. {site.overlap}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={cta.primary.href} location={location}>
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink href={cta.secondary.href} variant="ghost" location={`${location}_brief`}>
              {cta.secondary.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }}
    />
  );
}

export function FaqList({ items }: { items: FaqItem[] }) {
  return <FaqAccordion items={items} />;
}

export function FaqSection({
  items,
  title = "Questions, answered honestly",
  n,
  schema = false,
}: {
  items: FaqItem[];
  title?: string;
  n?: string;
  /** Emit FAQPage structured data for this block. Use once per page. */
  schema?: boolean;
}) {
  return (
    <Section>
      {schema && <FaqJsonLd items={items} />}
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Heading eyebrow="FAQ" n={n} title={title} intro="Anything else? Ask on the call or by email." />
        </div>
        <FaqList items={items} />
      </div>
    </Section>
  );
}

export const labelTone = { client: "orange", own: "blue", concept: "gray" } as const;

/** Generated cover art per project (used until real screenshots are added). */
export function CoverArt({ slug }: { slug: string }) {
  if (slug === "family-fashion-hub-china") {
    return (
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#1a120d,#3a2216_55%,#a2522c)] p-6">
        <div className="mx-auto mt-6 h-[80%] max-w-sm rounded-xl border border-line-strong bg-[#0c0c0c]/70 p-3.5">
          <div className="flex justify-between text-[10px] text-[#d9d3cb]">
            <span className="font-semibold text-[#f2eee8]">FFHC admin</span>
            <span>Orders · Couriers</span>
          </div>
          <div className="mt-3 space-y-1.5">
            {["Dhaka · auto-booked", "Chattogram · auto-booked", "Sylhet · review", "Khulna · auto-booked"].map((r, i) => (
              <div key={r} className="flex items-center justify-between rounded-md bg-white/[0.06] px-2.5 py-1.5 text-[10px] text-[#e8e3dc]">
                <span>
                  #{1042 + i} {r.split(" · ")[0]}
                </span>
                <span className={r.includes("review") ? "text-[#ffd27a]" : "text-[#7ee2a8]"}>{r.split(" · ")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (slug === "aura-goli") {
    return (
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#12100e,#22201d_55%,#3b342c)] p-6">
        <div className="mx-auto mt-4 grid h-[82%] max-w-md grid-cols-[1fr_0.85fr] gap-3">
          <div className="rounded-xl border border-line-strong bg-[#0c0c0c]/70 p-3.5">
            <p className="text-[10px] text-[#d9d3cb]">Revenue</p>
            <div className="mt-3 flex h-[72%] items-end gap-1">
              {[40, 55, 35, 70, 60, 85, 75, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-[#c45a2a] to-[#f37842]" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-end gap-1.5 rounded-xl border border-line-strong bg-[#0c0c0c]/70 p-2.5 text-[10px]">
            <span className="self-start rounded-lg rounded-bl-none bg-white/10 px-2 py-1 text-[#f2eee8]">ডেলিভারি কবে?</span>
            <span className="self-end rounded-lg rounded-br-none bg-[#f37842] px-2 py-1 text-[#0c0c0c]">২–৩ দিনের মধ্যে ✓</span>
            <span className="self-start rounded-lg rounded-bl-none bg-white/10 px-2 py-1 text-[#f2eee8]">Return policy?</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_115%,#f37842,#5a2410_40%,#0d0705_75%)]">
      <div className="absolute inset-0 flex items-end justify-center gap-6 pb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-5 w-2.5 animate-float rounded-full bg-gradient-to-t from-orange to-amber-200 blur-[1px]" style={{ animationDelay: `${-i * 1.5}s` }} />
            <div className="mt-1 rounded-t-md bg-[#e9dcc9]" style={{ width: 34, height: [52, 70, 44][i] }} />
          </div>
        ))}
      </div>
      <p className="absolute bottom-5 right-5 font-display text-lg italic text-[#e9dcc9]">Ember &amp; Oak</p>
    </div>
  );
}

/** Project image: a real screenshot via next/image, or generated cover art for "art:<slug>" (and placeholders in dev). */
export function Media({ src, alt, slug, sizes, priority = false }: { src: Text; alt: string; slug: string; sizes: string; priority?: boolean }) {
  if (typeof src !== "string" || src.startsWith("art:"))
    return (
      <div role="img" aria-label={alt} className="absolute inset-0">
        <CoverArt slug={typeof src === "string" ? src.slice(4) : slug} />
      </div>
    );
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />;
}

export function CaseStudyCard({ c, wide = false, index, priority = false }: { c: CaseStudy; wide?: boolean; index?: number; priority?: boolean }) {
  const cover = c.gallery[0];
  const media = (
    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
      <Media src={cover.src} alt={cover.alt} slug={c.slug} priority={priority} sizes={wide ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 45vw, 100vw"} />
    </div>
  );

  return (
    <Link href={`/work/${c.slug}`} className={`group flex h-full flex-col ${wide ? "gap-8 md:grid md:grid-cols-[1.35fr_1fr] md:items-end" : "gap-6"}`}>
      <div className={`relative overflow-hidden rounded-2xl border border-line aspect-[16/10]`}>
        {media}
        <div className="absolute bottom-4 left-4">
          <Badge tone={labelTone[c.label]}>{labelText[c.label]}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-line pb-3 font-mono text-xs text-muted">
          <span>
            {index !== undefined && <span aria-hidden="true" className="mr-3 text-orange">{String(index + 1).padStart(2, "0")}</span>}
            {c.client.split(" (")[0]}
          </span>
          <span>{c.year}</span>
        </div>
        <h3 className={`mt-5 leading-[1.05] text-ink transition-colors group-hover:text-orange ${wide ? "text-4xl sm:text-5xl" : "text-3xl"}`}>{c.title}</h3>
        <p className={`mt-4 leading-relaxed text-muted ${wide ? "text-lg" : ""}`}>{c.summary}</p>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted">{c.stack.slice(0, wide ? 4 : 3).join(" · ")}</p>
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink transition-all duration-300 group-hover:-rotate-45 group-hover:border-orange group-hover:bg-orange group-hover:text-[#0c0c0c]">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
