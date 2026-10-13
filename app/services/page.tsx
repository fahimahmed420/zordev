import Link from "next/link";
import { CtaBand, FaqList } from "@/components/sections/shared";
import { ButtonLink, Heading, Section, usd, PageHero } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { services } from "@/content/services";
import { cta } from "@/content/site";
import { getCaseStudy } from "@/content/work";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Services: custom online stores, business websites, web apps",
  "Custom Next.js online stores, fast business websites, and web apps or MVPs built on a fixed scope. Starting prices and timelines included.",
  "/services",
);

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="What Zordev builds" intro="Three services, each with a clear scope, a starting price and a typical timeline.">
        <nav aria-label="Services on this page" className="flex flex-wrap gap-3">
          {services.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="rounded-full border border-line-strong  px-4 py-2 text-sm hover:border-ink">
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>

      {services.map((s, i) => {
        const related = getCaseStudy(s.relatedCaseStudy);
        return (
          <Section key={s.slug} id={s.slug} className={i % 2 ? "bg-paper" : ""}>
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <Heading eyebrow={`0${i + 1}`} title={s.title} intro={s.short} />
                <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold">Who it's for</dt>
                    <dd className="mt-1 text-muted">{s.forWho}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">The problem it solves</dt>
                    <dd className="mt-1 text-muted">{s.problem}</dd>
                  </div>
                </dl>
                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <List title="What's included" items={s.included} />
                  <List title="You receive" items={s.deliverables} />
                </div>
                <p className="mt-8 font-mono text-sm text-muted">Built with: {s.stack.join(" · ")}</p>
              </div>
              <aside className="space-y-6">
                <div className="spot rounded-2xl p-7">
                  <p className="text-sm text-muted">Starting from</p>
                  <p className="mt-1 text-4xl font-bold">{usd(s.fromPrice)}</p>
                  <p className="mt-2 text-muted">Typical timeline: {s.timeline}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ButtonLink href={cta.primary.href} location={`service_${s.slug}`}>
                      {cta.primary.label}
                    </ButtonLink>
                    <ButtonLink href="/pricing" variant="ghost">
                      Pricing details
                    </ButtonLink>
                  </div>
                </div>
                {related && (
                  <Link href={`/work/${related.slug}`} className="spot tilt block rounded-2xl bg-gradient-to-br from-orange/10 to-transparent p-7">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Related work</p>
                    <p className="mt-3 text-lg font-bold">{related.title}</p>
                    <p className="mt-2 text-sm text-muted">{related.summary}</p>
                  </Link>
                )}
                <FaqList items={faqFor(s.faqTag).slice(0, 3)} />
              </aside>
            </div>
          </Section>
        );
      })}

      <CtaBand title="Not sure what you need?" location="services_band" />
    </>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-muted">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
