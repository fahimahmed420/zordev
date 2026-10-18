import Link from "next/link";
import { Avatar } from "@/components/sections/Avatar";
import { LiveCodeHero } from "@/components/sections/LiveCodeHero";
import { CarePlans, FindingsTable, OfferLadder, OtherBuildsLine } from "@/components/sections/offer";
import { ProcessTabs } from "@/components/sections/ProcessTabs";
import { CaseStudyCard, CtaBand, FaqSection } from "@/components/sections/shared";
import { ButtonLink, Container, Heading, Section } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { auditCredit } from "@/content/pricing";
import { nextSteps } from "@/content/process";
import { sampleReport } from "@/content/sample-report";
import { cta, site } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { sortedCaseStudies } from "@/content/work";
import { pageMeta } from "@/lib/seo";

export const metadata = {
  ...pageMeta("Production fixes for Lovable, Bolt and v0 apps", site.description, "/"),
  title: { absolute: "Zordev | Production fixes for Lovable, Bolt and v0 apps" },
};

const problems = [
  {
    pain: "Any signed-in user can see everyone's data.",
    answer: "Database rules written and tested for every table, so each user only reaches their own records.",
  },
  {
    pain: "Payments work. Until someone fakes one.",
    answer: "Every payment event is verified with the provider's signature, and duplicates are rejected before they touch your orders.",
  },
  {
    pain: "An investor's developer is about to read the code.",
    answer: "A clean repository in your GitHub, secrets moved out of the browser, and a handover document a new developer can follow.",
  },
];

const proof = ["Fixed price before work starts", "Code and accounts in your name", "A working demo every Friday", "Calls during US working hours"];

export default function Home() {
  const work = sortedCaseStudies.filter((c) => c.featured);
  const homeFaq = faqFor("home");
  return (
    <>
      {/* 2. Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -top-48 left-1/4 h-[36rem] w-[36rem] rounded-full bg-orange/[0.08] blur-[140px]" />
        <Container className="relative pb-16 pt-14 text-center sm:pb-24 sm:pt-20">
          <p className="reveal inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
            </span>
            For founders who built with Lovable, Bolt, v0 or Replit
          </p>
          <h1 className="reveal mx-auto mt-6 max-w-5xl text-5xl leading-[0.98] sm:text-7xl lg:text-[5.5rem]" style={{ ["--d" as string]: "80ms" }}>
            Your app works in the demo. <span className="text-gradient">I make it safe for real users.</span>
          </h1>
          <p className="reveal mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted" style={{ ["--d" as string]: "160ms" }}>
            I&apos;m Fahim, a Next.js developer. I find and fix what AI builders leave behind: open database rules, weak login, exposed keys and
            payments nobody checks. Audit in 3 days, fixes in 2 weeks, at a fixed price, in code you own.
          </p>
          <div className="reveal mt-9 flex flex-wrap items-center justify-center gap-3" style={{ ["--d" as string]: "240ms" }}>
            <ButtonLink href={cta.check.href} location="hero">
              {cta.check.label}
            </ButtonLink>
            <Link href={cta.report.href} className="link-u px-4 py-3 text-sm text-ink" data-umami-event="cta_click" data-umami-event-location="hero_report">
              {cta.report.label} →
            </Link>
          </div>
          <p className="reveal mt-4 text-sm text-muted" style={{ ["--d" as string]: "280ms" }}>
            3 free checks a week. Read-only access, nothing in your app changes.
          </p>
          <div className="reveal mx-auto mt-20 max-w-5xl text-left" style={{ ["--d" as string]: "320ms" }}>
            <LiveCodeHero />
          </div>
        </Container>

        {/* 3. Proof strip: plain text, no counters until there are real numbers */}
        <div className="border-y border-line py-6">
          <Container>
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-center font-display text-xl italic text-ink sm:text-2xl">
              {proof.map((p, i) => (
                <li key={p} className="flex items-center gap-8">
                  {i > 0 && (
                    <span aria-hidden="true" className="hidden text-sm not-italic text-orange sm:inline">
                      ✦
                    </span>
                  )}
                  {p}
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </section>

      {/* 4. Founder strip */}
      <section className="border-b border-line bg-paper py-10">
        <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <Avatar size="sm" />
            <div>
              <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">Hi, I&apos;m Fahim. You talk to me, and I write the code.</p>
              <p className="mt-2 max-w-2xl text-muted">
                I build in Next.js and TypeScript from Dhaka, and I&apos;m on calls during the US working day. Before this I built, and still run, a
                live e-commerce store that books its own couriers across Bangladesh.
              </p>
            </div>
          </div>
          <Link href="/about" className="link-u shrink-0 text-ink">
            About me →
          </Link>
        </Container>
      </section>

      {/* 5. Sound familiar? */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Heading
            eyebrow="Sound familiar?"
            n="01"
            title={
              <>
                AI got you to a working app. These are the parts it usually <em>skips.</em>
              </>
            }
          />
          <ol className="border-t border-line">
            {problems.map((p, i) => (
              <li key={p.pain} data-reveal style={{ ["--d" as string]: `${i * 90}ms` }} className="group grid gap-3 border-b border-line py-8 sm:grid-cols-[3rem_1fr_1fr] sm:gap-6">
                <span className="font-mono text-xs text-orange">0{i + 1}</span>
                <p className="font-display text-2xl leading-snug text-ink">“{p.pain}”</p>
                <p className="leading-relaxed text-muted transition-colors group-hover:text-ink">
                  <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-orange">The fix</span>
                  {p.answer}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-12">
          <ButtonLink href={cta.check.href} location="after_problems">
            {cta.check.label}
          </ButtonLink>
        </div>
      </Section>

      {/* 6. Offer ladder */}
      <Section dark id="services">
        <Heading
          eyebrow="What I do"
          n="02"
          title={
            <>
              Three ways to get your app <em>production-ready</em>
            </>
          }
          intro={auditCredit}
        />
        <div className="mt-16">
          <OfferLadder location="home_offer" />
        </div>
        <OtherBuildsLine />
      </Section>

      {/* 7. Sample report */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Heading
            eyebrow="See what an audit finds"
            n="03"
            title={
              <>
                See what an audit <em>actually</em> finds
              </>
            }
            intro={sampleReport.intro}
          />
          <p className="rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs text-muted">{sampleReport.label}</p>
        </div>
        <div className="mt-12" data-reveal>
          <FindingsTable findings={sampleReport.findings} />
        </div>
        <div className="mt-8">
          <ButtonLink href={cta.report.href} location="home_report">
            Read the full sample report
          </ButtonLink>
        </div>
      </Section>

      {/* 8. Work */}
      <Section dark>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Heading
            eyebrow="Selected work"
            n="04"
            title={
              <>
                Real projects, <em>honestly</em> labelled
              </>
            }
            intro="Client work, studio tests and demos, each marked for what it is."
          />
          <Link href="/work" className="link-u inline-flex items-center gap-2 text-ink">
            All work →
          </Link>
        </div>
        <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {work.map((c, i) => (
            <div key={c.slug} data-reveal style={{ ["--d" as string]: `${i * 90}ms` }} className={i === 0 ? "md:col-span-2" : ""}>
              <CaseStudyCard c={c} wide={i === 0} index={i} />
              {c.liveUrl && (
                <a
                  href={c.liveUrl}
                  target="_blank"
                  rel="noopener"
                  className="link-u mt-4 inline-block font-mono text-xs text-muted hover:text-ink"
                  data-umami-event="outbound_click"
                  data-umami-event-target={c.slug}
                >
                  {c.label === "client" ? "Live store" : "Live demo"}: {c.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* 9. Process */}
      <Section id="process">
        <Heading
          eyebrow="How a job runs"
          n="05"
          title={
            <>
              You see progress every Friday, not just at the <em>end</em>
            </>
          }
        />
        <div className="mt-16" data-reveal>
          <ProcessTabs />
        </div>
      </Section>

      {/* 10. How I use AI */}
      <Section dark>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Heading
            eyebrow="How I use AI"
            n="06"
            title={
              <>
                Yes, I use AI tools. I still read <em>every line.</em>
              </>
            }
          />
          <div className="space-y-5 text-lg leading-relaxed text-muted" data-reveal>
            <p>
              I use Claude, Claude Code and ChatGPT to move faster on routine code. That&apos;s part of how the prices stay fixed and the timelines
              short.
            </p>
            <p>
              Every change that reaches your app has been read, tested and understood by me. AI wrote some of the problems I fix. It doesn&apos;t
              get the final say on the fixes.
            </p>
            <p className="text-ink">Your code and data never go into any tool that trains on them.</p>
          </div>
        </div>
      </Section>

      {/* 11. Care plans */}
      <Section>
        <Heading
          eyebrow="After launch"
          n="07"
          title={
            <>
              Keep it safe after <em>launch</em>
            </>
          }
          intro="Apps need updates. Packages get security fixes, and new features change your database. Pick the level of cover you need."
        />
        <div className="mt-16">
          <CarePlans location="home_care" />
        </div>
      </Section>

      {/* 12. What happens after you click */}
      <Section dark>
        <Heading
          eyebrow="What happens next"
          n="08"
          title={
            <>
              What happens after you <em>click</em>
            </>
          }
        />
        <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {nextSteps.map((s, i) => (
            <li key={s.title} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }} className="bg-surface p-8">
              <span className="font-display text-5xl italic text-orange">{i + 1}</span>
              <p className="mt-6 text-xl leading-snug text-ink">{s.title}</p>
              <p className="mt-3 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 13. Testimonials: hidden until there's a real, named quote */}
      {testimonials.length > 0 && (
        <Section>
          <Heading eyebrow="Clients" title="What clients say." />
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.name} data-reveal className="border-t border-line pt-8">
                <blockquote className="font-display text-3xl leading-snug text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-5 text-sm text-muted">
                  {t.name}, {t.role}, {t.company}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* 14. FAQ (with FAQPage schema) */}
      <FaqSection items={homeFaq} n="09" schema />

      {/* 15. Final CTA */}
      <CtaBand location="final_band" />

      {/* Mobile sticky CTA */}
      <div id="mobile-cta" className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-[#0c0c0c]/95 p-3 backdrop-blur md:hidden">
        <Link
          href={cta.check.href}
          className="flex min-h-12 items-center justify-center rounded-full bg-orange text-sm font-medium text-[#0c0c0c]"
          data-umami-event="cta_click"
          data-umami-event-location="mobile_sticky"
        >
          Free 3-risk check →
        </Link>
      </div>
    </>
  );
}
