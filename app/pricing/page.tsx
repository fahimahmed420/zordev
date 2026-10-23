import Link from "next/link";
import { CtaBand, FaqList } from "@/components/sections/shared";
import { Badge, ButtonLink, Heading, Section, usd, PageHero } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { addOns, carePlan, guarantees, notIncluded, offers, packages, paymentTerms, priceFactors } from "@/content/pricing";
import { cta, site } from "@/content/site";
import { JsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Pricing",
  "Starting prices for business websites from $1,200, custom online stores from $4,000 and MVP sprints from $2,500, plus a $500 audit for apps built with AI tools. Fixed price for an agreed scope.",
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
                <ButtonLink href={cta.primary.href} location={`pricing_${p.id}`} variant={p.highlighted ? "primary" : "ghost"}>
                  {cta.primary.label}
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {addOns.map((a) => (
            <div key={a.name} className="rounded-2xl bg-paper p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Add-on</p>
              <h3 className="mt-2 text-lg">
                {a.name}: from {usd(a.from)}
              </h3>
              <p className="mt-1 text-muted">
                {a.detail} {a.note && <span className="text-sm">({a.note})</span>}
              </p>
            </div>
          ))}
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
