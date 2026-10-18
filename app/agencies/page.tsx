import { CtaBand, FaqJsonLd, FaqList } from "@/components/sections/shared";
import { ButtonLink, Heading, PageHero, Section, usd } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { agency } from "@/content/pricing";
import { cta, site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "White-label Next.js development for agencies",
  "Next.js development and AI-app hardening under your brand and NDA. $40 an hour in 20-hour blocks, or a fixed quote per job. Calls during US working hours.",
  "/agencies",
);

const work = [
  { title: "AI-built client apps", text: "A client arrives with a Lovable or Bolt app. I audit it, fix it, and hand it back ready for your team." },
  { title: "Security review before launch", text: "A second pair of eyes on login, database rules, secrets and payments before your client goes live." },
  { title: "Next.js builds and overflow", text: "Stores, web apps and marketing sites when your own developers are full." },
];

export default function AgenciesPage() {
  const faqs = faqFor("agencies");
  return (
    <>
      <FaqJsonLd items={faqs} />
      <PageHero
        eyebrow="For agencies"
        title={
          <>
            Your brand. My code. <em>Your NDA.</em>
          </>
        }
        intro={`I work as a white-label Next.js developer for agencies: fixed quotes or ${usd(agency.rate)} an hour, and your client never hears my name unless you want them to.`}
      >
        <ButtonLink href={cta.call.href} location="agencies_hero">
          {cta.call.label}
        </ButtonLink>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading eyebrow="Terms" n="01" title="Simple, written down" />
            <ul className="mt-10 space-y-4 text-lg text-muted">
              {agency.terms.map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">One block</p>
            <p className="mt-4 font-display text-6xl leading-none text-ink">{usd(agency.rate * agency.blockHours)}</p>
            <p className="mt-2 font-mono text-xs text-muted">
              {agency.blockHours} hours at {usd(agency.rate)}/hr
            </p>
            <p className="mt-6 text-muted">
              Use the hours across any of your jobs. {site.overlap}
            </p>
          </div>
        </div>
      </Section>

      <Section dark>
        <Heading eyebrow="What agencies send me" n="02" title="Where I fit" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {work.map((w) => (
            <div key={w.title} className="bg-surface p-8">
              <h3 className="text-2xl text-ink">{w.title}</h3>
              <p className="mt-3 text-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Heading eyebrow="FAQ" title="Agency questions" />
          <FaqList items={faqs} />
        </div>
      </Section>
      <CtaBand title="Got a job that needs a developer?" location="agencies_band" />
    </>
  );
}
