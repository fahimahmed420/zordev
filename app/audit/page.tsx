import Link from "next/link";
import { CheckForm } from "@/components/forms/CheckForm";
import { FindingsTable } from "@/components/sections/offer";
import { CtaBand, FaqSection } from "@/components/sections/shared";
import { ButtonLink, Heading, PageHero, Section, usd } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { auditChecks, foundingRate, guarantees, offers } from "@/content/pricing";
import { sampleReport } from "@/content/sample-report";
import { cta } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Production readiness audit for AI-built apps",
  "A $500 audit of your Lovable, Bolt, v0 or Replit app: login, database rules, secrets, payments, backups and speed. Read-only access, a written report in 3 business days, and a fixed price to fix it all.",
  "/audit",
);

const audit = offers.find((o) => o.id === "audit")!;

const deliverables = [
  "A written report with every finding ranked critical, high, medium or low, each with the evidence and the fix",
  "A fixed-price quote to fix everything, so you know the next step and the cost",
  "A 30-minute call to walk through the report",
  "The report is yours to keep, whoever fixes the app",
];

export default function AuditPage() {
  return (
    <>
      <PageHero
        eyebrow="Audit"
        title={
          <>
            Find out what breaks <em>before</em> your users do
          </>
        }
        intro={`${audit.blurb} ${usd(audit.price)}, ${audit.timeline} after access is granted, and credited in full if you book fixes within 30 days.`}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#check" location="audit_hero">
            {cta.check.label}
          </ButtonLink>
          <ButtonLink href={cta.call.href} variant="ghost" location="audit_hero_call">
            Book an audit on a call
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading eyebrow="What I check" n="01" title="Ten areas, read-only" />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {auditChecks.map((c) => (
                <li key={c} className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm">
                  <span aria-hidden="true" className="text-orange">
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Heading eyebrow="What you get" n="02" title="A report you keep" />
            <ul className="mt-10 space-y-4 text-muted">
              {deliverables.map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  {d}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl border border-orange/50 bg-surface p-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">Founding rate</p>
              <p className="mt-3 text-ink">{foundingRate.text}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section dark>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Heading eyebrow="Example" n="03" title="What a finding looks like" intro={sampleReport.label} />
          <Link href="/sample-report" className="link-u text-ink">
            Read the full sample report →
          </Link>
        </div>
        <div className="mt-12">
          <FindingsTable findings={sampleReport.findings} />
        </div>
      </Section>

      <Section>
        <Heading eyebrow="Guarantees" n="04" title="What I promise, every time" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g) => (
            <div key={g.title} className="bg-surface p-7">
              <h3 className="text-2xl text-ink">{g.title}</h3>
              <p className="mt-3 text-muted">{g.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section dark id="check">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Heading
              eyebrow="Free 3-risk check"
              n="05"
              title={
                <>
                  Not ready for an audit? Start <em>free.</em>
                </>
              }
              intro="I look at your app's public signals first, then with read-only access you provide. You get the 3 biggest risks, recorded on video. If your app is fine, I'll tell you."
            />
          </div>
          <CheckForm />
        </div>
      </Section>

      <FaqSection items={faqFor("audit")} title="Audit questions" schema />
      <CtaBand location="audit_band" />
    </>
  );
}
