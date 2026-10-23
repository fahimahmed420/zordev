import { CheckForm } from "@/components/forms/CheckForm";
import { CtaBand, FaqSection } from "@/components/sections/shared";
import { ButtonLink, Heading, PageHero, Section, usd } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { auditChecks, guarantees, offers } from "@/content/pricing";
import { cta } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Fix an AI-built app: audit and hardening",
  "A $500 audit of your Lovable, Bolt, v0 or Replit app: login, database rules, secrets, payments, backups and speed. Read-only access, a written report in 3 business days, and a $2,500 sprint to fix it.",
  "/audit",
);

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
        eyebrow="Fix an AI-built app"
        title={
          <>
            Your app works in the demo. Let&apos;s make it <em>safe for real users.</em>
          </>
        }
        intro="Built it with Lovable, Bolt, v0 or Replit? I find and fix what AI builders leave behind: open database rules, weak login, exposed keys and payments nobody checks."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#check" location="audit_hero">
            {cta.check.label}
          </ButtonLink>
          <ButtonLink href={cta.call.href} variant="ghost" location="audit_hero_call">
            {cta.call.label}
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {offers.map((o) => (
            <div key={o.id} className="flex flex-col rounded-2xl border border-line bg-surface p-8">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">{o.name}</p>
              <p className="mt-5 font-display text-6xl leading-none text-ink">{usd(o.price)}</p>
              <p className="mt-2 font-mono text-xs text-muted">
                {o.timeline} · {o.payment}
              </p>
              <h2 className="mt-6 text-2xl leading-snug text-ink">{o.promise}</h2>
              <ul className="mt-6 space-y-2.5 text-sm">
                {o.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-orange">
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              {o.note && <p className="mt-5 text-sm text-ink">{o.note}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-paper">
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
          </div>
        </div>
      </Section>

      <Section>
        <Heading eyebrow="Guarantees" n="03" title="What I promise, every time" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g) => (
            <div key={g.title} className="bg-surface p-7">
              <h3 className="text-2xl text-ink">{g.title}</h3>
              <p className="mt-3 text-muted">{g.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-paper" id="check">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Heading
            eyebrow="Free 3-risk check"
            n="04"
            title={
              <>
                Not ready for an audit? Start <em>free.</em>
              </>
            }
            intro="I look at your app's public signals first, then with read-only access you provide. You get the 3 biggest risks, recorded on video. If your app is fine, I'll tell you."
          />
          <CheckForm />
        </div>
      </Section>

      <FaqSection items={faqFor("services:fix-ai-apps")} title="Questions about fixing" schema />
      <CtaBand location="audit_band" />
    </>
  );
}
