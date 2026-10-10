import Link from "next/link";
import { LiveCodeHero } from "@/components/sections/LiveCodeHero";
import { PriceEstimator } from "@/components/sections/PriceEstimator";
import { ProcessTabs } from "@/components/sections/ProcessTabs";
import { CaseStudyCard, CtaBand, FaqSection } from "@/components/sections/shared";
import { ButtonLink, Container, Heading, Section, usd } from "@/components/ui";
import { faqFor } from "@/content/faq";
import { addOns, packages } from "@/content/pricing";
import { services } from "@/content/services";
import { cta, site } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { sortedCaseStudies } from "@/content/work";
import { pageMeta } from "@/lib/seo";

export const metadata = {
  ...pageMeta("Websites, online stores and web apps", site.description, "/"),
  title: { absolute: "Zordev, web development studio | Websites, online stores and web apps" },
};

const problems = [
  { pain: "The freelancer disappeared halfway through.", answer: "Weekly written updates and a staging link. You own the code from day one." },
  { pain: "The site looks fine but brings no inquiries.", answer: "Every page is built around one clear next step, and loads fast on a phone." },
  { pain: "The quote kept growing.", answer: "A fixed price for an agreed scope. Changes are quoted before any work starts." },
];

const stack = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Prisma", "MongoDB", "Firebase", "Vercel", "Resend", "Cloudflare"];

const serviceArt: Record<string, React.ReactNode> = {
  ecommerce: (
    <div className="flex items-end gap-2">
      {[56, 84, 40].map((h, i) => (
        <div key={i} className="w-9 rounded-md bg-gradient-to-t from-orange to-orange/25 transition-all duration-500" style={{ height: h }} />
      ))}
      <div className="ml-2 rounded-lg border border-line-strong bg-surface-2 px-3 py-2 font-mono text-[11px] text-ink">+ order #1043</div>
    </div>
  ),
  websites: (
    <div className="w-44 rounded-lg border border-line-strong bg-surface-2 p-2.5">
      <div className="h-2 w-12 rounded bg-muted" />
      <div className="mt-2 h-4 w-full rounded bg-orange/70" />
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <div className="h-6 rounded bg-line-strong" />
        <div className="h-6 rounded bg-line-strong" />
        <div className="h-6 rounded bg-line-strong" />
      </div>
    </div>
  ),
  "web-apps": (
    <div className="grid w-44 grid-cols-2 gap-1.5">
      <div className="col-span-2 h-8 rounded-md border border-line-strong bg-surface-2 p-1.5">
        <div className="h-full w-2/3 rounded-sm bg-orange/80 transition-all duration-700 group-hover:w-full" />
      </div>
      <div className="h-12 rounded-md border border-line-strong bg-surface-2" />
      <div className="h-12 rounded-md bg-line-strong" />
    </div>
  ),
};

const reasons = [
  { icon: "i.", title: "You talk to the builder", text: "No account managers. The person on the call writes the code." },
  { icon: "ii.", title: "Fixed scope, fixed price", text: "A written scope and price before work starts. No surprise invoices." },
  { icon: "iii.", title: "Real e-commerce experience", text: "Production stores with payments, admin panels and courier automation." },
  { icon: "iv.", title: "You own everything", text: "Code, domain and accounts are in your name, handed over in full." },
];

export default function Home() {
  const [featured, ...rest] = sortedCaseStudies.filter((c) => c.featured);
  return (
    <>
      {/* 1. Hero: live code that becomes a website (layout unchanged; owner will edit later) */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-48 left-1/4 h-[36rem] w-[36rem] rounded-full bg-orange/[0.08] blur-[140px]" />
        <Container className="relative pb-16 pt-14 text-center sm:pb-24 sm:pt-20">
          <p className="reveal inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
            </span>
            <span className="hidden sm:inline">Web development studio · </span>Dhaka → worldwide
          </p>
          <h1 className="reveal mx-auto mt-6 max-w-5xl text-6xl leading-[0.95] sm:text-8xl lg:text-[6.5rem]" style={{ ["--d" as string]: "80ms" }}>
            Websites, online stores and web apps, <span className="text-gradient">built properly.</span>
          </h1>
          <p className="reveal mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted" style={{ ["--d" as string]: "160ms" }}>
            Zordev is a small studio run by {site.owner.name}. Shipped on a fixed scope, and you work directly with the developer who builds it.
          </p>
          <div className="reveal mt-9 flex flex-wrap justify-center gap-3" style={{ ["--d" as string]: "240ms" }}>
            <ButtonLink href={cta.primary.href} location="hero">
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink href="/work" variant="ghost">
              See the work
            </ButtonLink>
          </div>
          <div className="reveal mx-auto mt-16 max-w-5xl text-left" style={{ ["--d" as string]: "320ms" }}>
            <LiveCodeHero />
          </div>
          <p className="mx-auto mt-16 max-w-2xl text-sm text-muted">
            <span className="text-ink">Live work:</span> an import e-commerce store shipping across Bangladesh, a bilingual AI support assistant, and a scroll-driven brand site.
          </p>
        </Container>

        {/* Stack marquee */}
        <div className="group relative border-y border-line py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-10 group-hover:[animation-play-state:paused]">
            {[...stack, ...stack].map((s, i) => (
              <span key={i} className="flex items-center gap-10 font-display text-2xl italic text-muted transition-colors hover:text-ink">
                {s}
                <span aria-hidden="true" className="text-sm not-italic text-orange">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Problem */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Heading
            eyebrow="Sound familiar?"
            n="01"
            title={
              <>
                Hiring a developer shouldn&apos;t feel like a <em>gamble.</em>
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
      </Section>

      {/* 3. Services */}
      <Section dark>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Heading
            eyebrow="Services"
            n="02"
            title={
              <>
                Three things, done <em>really</em> well.
              </>
            }
            intro="Pick what you need, or send a brief and I'll suggest the right fit."
          />
          <ButtonLink href={cta.primary.href} location="after_services">
            {cta.primary.label}
          </ButtonLink>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services#${s.slug}`}
              data-reveal
              style={{ ["--d" as string]: `${i * 90}ms` }}
              className="group relative flex min-h-[26rem] flex-col bg-surface p-8 transition-colors duration-300 hover:bg-surface-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-orange">0{i + 1}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink transition-all duration-300 group-hover:-rotate-45 group-hover:border-orange group-hover:bg-orange group-hover:text-[#0c0c0c]">
                  →
                </span>
              </div>
              <div className="mt-10 flex h-28 items-end transition-transform duration-500 group-hover:-translate-y-1">{serviceArt[s.slug]}</div>
              <h3 className="mt-10 text-4xl leading-none text-ink">{s.title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{s.short}</p>
              <p className="mt-auto flex items-center justify-between border-t border-line pt-5 font-mono text-xs text-muted">
                <span>
                  from <span className="text-ink">{usd(s.fromPrice)}</span>
                </span>
                <span>{s.timeline}</span>
              </p>
            </Link>
          ))}
        </div>
        <div data-reveal className="mt-4 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">Add-on</p>
            <h3 className="mt-3 text-3xl text-ink">AI chat assistant for your store</h3>
            <p className="mt-3 leading-relaxed text-muted">
              Answers product, delivery and returns questions on Messenger or WhatsApp in your customers&apos; language, with a one-tap handover to you.
            </p>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-2 text-sm md:w-auto">
            <span className="self-start rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2 text-ink">Is this in stock in medium?</span>
            <span className="self-end rounded-2xl rounded-br-sm bg-orange px-3.5 py-2 text-[#0c0c0c]">Yes, 4 left. Want me to reserve one?</span>
            <span className="mt-2 self-end font-mono text-xs text-muted">from {usd(addOns[0].from)}</span>
          </div>
        </div>
      </Section>

      {/* 4. Work */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Heading
            eyebrow="Selected work"
            n="03"
            title={
              <>
                Real projects, <em>honestly</em> labelled.
              </>
            }
            intro="Client work, studio products and concepts, each marked for what it is."
          />
          <Link href="/work" className="link-u inline-flex items-center gap-2 text-ink">
            All work →
          </Link>
        </div>
        <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
          <div data-reveal className="md:col-span-2">
            <CaseStudyCard c={featured} wide index={0} />
          </div>
          {rest.map((c, i) => (
            <div key={c.slug} data-reveal style={{ ["--d" as string]: `${(i + 1) * 90}ms` }}>
              <CaseStudyCard c={c} index={i + 1} />
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Process */}
      <Section dark>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Heading
            eyebrow="Process"
            n="04"
            title={
              <>
                How Zordev <em>works.</em>
              </>
            }
            intro="Five steps, with a clear handover at each one. Hover or tap a step."
          />
          <Link href="/process" className="link-u inline-flex items-center gap-2 text-ink">
            The full process →
          </Link>
        </div>
        <div className="mt-16" data-reveal>
          <ProcessTabs />
        </div>
      </Section>

      {/* 6. Why Zordev */}
      <Section>
        <Heading
          eyebrow="Why Zordev"
          n="05"
          title={
            <>
              What you can <em>count on.</em>
            </>
          }
        />
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <div key={r.title} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }} className="group bg-surface p-8 transition-colors hover:bg-surface-2">
              <span className="block font-display text-5xl italic text-orange transition-transform duration-500 group-hover:translate-x-1">{r.icon}</span>
              <h3 className="mt-8 text-2xl text-ink">{r.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {testimonials.length > 0 && (
        <Section dark>
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

      {/* 7. Pricing estimator + FAQ */}
      <Section dark>
        <Heading
          eyebrow="Transparent pricing"
          n="06"
          title={
            <>
              Know the number <em>before</em> the call.
            </>
          }
        />
        <div className="mt-16" data-reveal>
          <PriceEstimator packages={packages} addOn={addOns[0]} />
        </div>
      </Section>
      <FaqSection items={faqFor("home")} n="07" />

      {/* 8. Final CTA */}
      <CtaBand location="final_band" />
    </>
  );
}
