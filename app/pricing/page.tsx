import { CtaBand, FaqList } from "@/components/sections/shared";
import { Badge, ButtonLink, Heading, Section, usd, PageHero } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { addOns, carePlan, notIncluded, packages, paymentTerms, priceFactors } from "@/content/pricing";
import { cta, site } from "@/content/site";
import { JsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Pricing",
  "Transparent starting prices for business websites, custom online stores and MVP sprints. Fixed price for an agreed scope, with clear payment terms.",
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
      <PageHero eyebrow="Pricing" title="Clear starting prices" intro={`Every project gets a fixed price for an agreed scope. The minimum project size is ${usd(site.minProjectSize)}, except the Launch site package.`} />

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col rounded-2xl border p-7 ${p.highlighted ? "border-orange shadow-lg ring-1 ring-orange" : "border-line"}`}
            >
              {p.highlighted && (
                <div className="mb-3">
                  <Badge tone="orange">Most experience</Badge>
                </div>
              )}
              <h2 className="text-xl font-bold">{p.name}</h2>
              <p className="mt-1 text-sm text-muted">{p.suits}</p>
              <p className="mt-5 text-sm text-muted">From</p>
              <p className="text-4xl font-bold">{usd(p.fromPrice)}</p>
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
              <h3 className="mt-2 text-lg font-bold">
                {a.name}: from {usd(a.from)}
              </h3>
              <p className="mt-1 text-muted">
                {a.detail} {a.note && <span className="text-sm">({a.note})</span>}
              </p>
            </div>
          ))}
        </div>
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
      <h2 className="text-xl font-bold">{title}</h2>
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
