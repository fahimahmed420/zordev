import { CarePlans, OfferLadder, OtherBuildsLine } from "@/components/sections/offer";
import { CtaBand, FaqJsonLd, FaqList } from "@/components/sections/shared";
import { Heading, PageHero, Section } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { auditCredit, foundingRate, guarantees, notIncluded, paymentTerms, sprintScope } from "@/content/pricing";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Pricing",
  "Audit $500, Hardening Sprint $2,500, Production Launch $4,500, and care plans from $149/month. Fixed prices for apps built with Lovable, Bolt, v0 and Replit.",
  "/pricing",
);

export default function PricingPage() {
  const faqs = faqFor("pricing");
  return (
    <>
      <FaqJsonLd items={faqs} />
      <PageHero
        eyebrow="Pricing · from October 2026"
        title={
          <>
            Fixed prices, printed <em>in full</em>
          </>
        }
        intro={auditCredit}
      />

      <Section>
        <OfferLadder location="pricing" />
        <p className="mt-8 max-w-3xl text-sm text-muted">{sprintScope}</p>
        <div className="mt-8 max-w-3xl rounded-2xl border border-orange/50 bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">Founding rate</p>
          <p className="mt-3 text-ink">{foundingRate.text}</p>
        </div>
        <OtherBuildsLine />
      </Section>

      <Section dark>
        <Heading
          eyebrow="After launch"
          title={
            <>
              Care <em>plans</em>
            </>
          }
          intro="Apps need updates. Packages get security fixes, and new features change your database. Pick the level of cover you need."
        />
        <div className="mt-14">
          <CarePlans location="pricing_care" />
        </div>
      </Section>

      <Section>
        <Heading eyebrow="Guarantees" title="What I promise, every time" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g) => (
            <div key={g.title} className="bg-surface p-7">
              <h3 className="text-2xl text-ink">{g.title}</h3>
              <p className="mt-3 text-muted">{g.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <Col title="Payment terms" items={paymentTerms} />
          <Col title="Not included" items={notIncluded} />
        </div>
      </Section>

      <Section dark>
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
      <h2 className="text-3xl">{title}</h2>
      <ul className="mt-5 space-y-3 text-muted">
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
