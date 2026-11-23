import Link from "next/link";
import { CtaBand, FaqList } from "@/components/sections/shared";
import { Badge, ButtonLink, Heading, Section, usd, PageHero } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { carePlan, foundingOffer, guarantees, notIncluded, offers, onePageSite, packages, paymentTerms, priceFactors } from "@/content/pricing";
import { cta, site } from "@/content/site";
import { JsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Pricing",
  "Starting prices: a one-page site for $700, business websites from $800, custom online stores from $2,800 and MVP sprints from $2,000, plus a $500 audit for apps built with AI tools. Fixed price for an agreed scope.",
  "/pricing",
);

export default function PricingPage() {
  const faqs = faqFor("pricing");
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }}
      />
      <PageHero eyebrow="Pricing" title="Clear starting prices" intro={`Every project gets a fixed price for an agreed scope. Builds start from ${usd(site.minProjectSize)}.`} />

      <Section>
        {foundingOffer.spotsLeft > 0 && (
          <div className="spot mb-10 grid gap-6 rounded-2xl p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center" id="founding">
            <div>
              <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-orange">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-orange" />
                Founding clients · {foundingOffer.spotsLeft} of {foundingOffer.spots} spots left
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl">
                {foundingOffer.discountPercent}% off your project, <em>for the first {foundingOffer.spots} clients</em>
              </h2>
              <p className="mt-3 max-w-2xl text-muted">
                Applies to the {foundingOffer.appliesTo}. In return: {foundingOffer.inReturn.join(", ").toLowerCase()}. Same scope, same guarantees.
              </p>
            </div>
            <ButtonLink href={cta.primary.href} location="pricing_founding">
              Claim a spot
            </ButtonLink>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-2xl border p-7 ${p.highlighted ? "border-orange shadow-lg ring-1 ring-orange" : "border-line"}`}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-7">
                  <Badge tone="orange">Most built</Badge>
                </div>
              )}
              <h2 className="text-3xl">{p.name}</h2>
              <p className="mt-1 min-h-[2lh] text-sm text-muted">{p.suits}</p>
              <p className="mt-5 text-sm text-muted">From</p>
              <p className="font-display text-5xl">{usd(p.fromPrice)}</p>
              <p className="mt-1 font-mono text-xs text-muted">{p.timeline}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.includes.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden="true" className="text-orange">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                {p.example && (
                  <Link href={`/work/${p.example.slug}`} className="mb-4 inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
                    See an example: {p.example.label} →
                  </Link>
                )}
                <ButtonLink href={cta.primary.href} location={`pricing_${p.id}`} variant={p.highlighted ? "primary" : "ghost"}>
                  {cta.primary.label}
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 rounded-2xl border border-line p-7 md:grid-cols-[1.1fr_1.4fr_auto] md:items-center" id="one-page">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Smaller first step</p>
            <h2 className="mt-2 text-3xl">{onePageSite.name}</h2>
            <p className="mt-1 text-sm text-muted">{onePageSite.suits}</p>
            <p className="mt-4 font-display text-5xl">
              {usd(onePageSite.price)} <span className="font-mono text-xs text-muted">· {onePageSite.timeline}</span>
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            {onePageSite.includes.map((i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className="text-orange">✓</span>
                {i}
              </li>
            ))}
          </ul>
          <ButtonLink href={cta.secondary.href} variant="ghost" location="pricing_one_page">
            {cta.secondary.label}
          </ButtonLink>
        </div>
      </Section>

      <Section className="bg-paper" id="fix">
        <Heading eyebrow="Fix an AI-built app" title="Audit and hardening sprint" intro="For apps built with Lovable, Bolt, v0 or Replit that need to be safe for real users and real money." />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {offers.map((o) => (
            <div key={o.id} className="flex flex-col rounded-2xl border border-line bg-surface p-7">
              <h2 className="text-3xl">{o.name}</h2>
              <p className="mt-1 text-sm text-muted">{o.promise}</p>
              <p className="mt-5 font-display text-5xl">{usd(o.price)}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                {o.timeline} · {o.payment}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {o.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden="true" className="text-orange">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              {o.note && <p className="mt-5 text-sm text-ink">{o.note}</p>}
              <div className="mt-auto pt-7">
                <ButtonLink href={o.id === "audit" ? "/audit#check" : "/audit"} variant="ghost" location={`pricing_${o.id}`}>
                  {o.id === "audit" ? "Start with a free 3-risk check" : "Audit details"}
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Heading eyebrow="Guarantees" title="What I promise, every time" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g) => (
            <div key={g.title} className="bg-surface p-7">
              <h3 className="text-2xl text-ink">{g.title}</h3>
              <p className="mt-3 text-muted">{g.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Full details are in the <Link href="/project-terms" className="text-ink underline underline-offset-4">project terms</Link>.
        </p>
      </Section>

      <Section className="bg-paper">
        <div className="grid gap-10 md:grid-cols-3">
          <Col title="What affects the price" items={priceFactors} />
          <Col title="Payment terms" items={paymentTerms} />
          <Col title="Not included" items={notIncluded} />
        </div>
        <p className="mt-10 max-w-2xl spot rounded-2xl p-6 text-muted">
          <strong className="text-ink">Care plan.</strong> {carePlan}
        </p>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Heading eyebrow="FAQ" title="Pricing questions" />
          <FaqList items={faqs} />
        </div>
      </Section>
      <CtaBand location="pricing_band" />
    </>
  );
}

function Col({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-xl">{title}</h2>
      <ul className="mt-4 space-y-3 text-muted">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
