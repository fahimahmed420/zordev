import Link from "next/link";
import { CtaBand, FaqJsonLd, FaqList } from "@/components/sections/shared";
import { ButtonLink, Heading, PageHero, Section } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { aiAddOn, builds, siteCarePlan } from "@/content/pricing";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Other builds: websites, stores and MVPs",
  "Next.js business websites from $1,500, custom online stores from $5,000, and MVPs at $3,000 per 2-week sprint. Fixed scope, code in your name.",
  "/builds",
);

export default function BuildsPage() {
  const faqs = faqFor("builds");
  return (
    <>
      <FaqJsonLd items={faqs} />
      <PageHero
        eyebrow="Other builds"
        title={
          <>
            Starting from scratch? I build that <em>too</em>
          </>
        }
        intro="Most of my work is making AI-built apps safe for real users. I also build Next.js websites, stores and MVPs, with security built in from day one, a fixed scope and code in your name."
      />

      <Section>
        <div className="grid gap-4 lg:grid-cols-3">
          {builds.map((b) => (
            <div key={b.id} className="flex flex-col rounded-2xl border border-line bg-surface p-8">
              <h2 className="text-3xl text-ink">{b.name}</h2>
              <p className="mt-2 text-sm text-muted">{b.suits}</p>
              <p className="mt-6 font-display text-4xl text-ink">{b.price}</p>
              <p className="mt-1 font-mono text-xs text-muted">{b.timeline}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {b.includes.map((i) => (
                  <li key={i} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-orange">
                      ✓
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <ButtonLink href="/contact#brief" variant="ghost" location={`builds_${b.id}`}>
                  Send a brief
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">Add-on · {aiAddOn.price}</p>
            <h2 className="mt-3 text-3xl text-ink">{aiAddOn.name}</h2>
            <p className="mt-3 leading-relaxed text-muted">{aiAddOn.detail}</p>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-2 text-sm md:w-auto" aria-hidden="true">
            <span className="self-start rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2 text-ink">Is this in stock in medium?</span>
            <span className="self-end rounded-2xl rounded-br-sm bg-orange px-3.5 py-2 text-[#0c0c0c]">Yes, 4 left. Want me to reserve one?</span>
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-sm text-muted">{siteCarePlan}</p>
        <p className="mt-4 text-muted">
          See these builds in practice on the{" "}
          <Link href="/work" className="link-u text-ink">
            work page →
          </Link>
        </p>
      </Section>

      <Section dark>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Heading eyebrow="FAQ" title="Build questions" />
          <FaqList items={faqs} />
        </div>
      </Section>
      <CtaBand title="Have a project in mind?" location="builds_band" />
    </>
  );
}
