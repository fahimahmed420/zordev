import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, labelTone, Media } from "@/components/sections/shared";
import { Badge, Container, Section, T } from "@/components/ui";
import { caseStudies, getCaseStudy, labelText, sortedCaseStudies } from "@/content/work";
import { isPh } from "@/lib/placeholder";
import { breadcrumbLd, JsonLd, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  return pageMeta(`${c.title} (${c.client.split(" (")[0]})`, c.summary, `/work/${c.slug}`);
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();

  const idx = sortedCaseStudies.findIndex((x) => x.slug === c.slug);
  const next = sortedCaseStudies[(idx + 1) % sortedCaseStudies.length];
  const showTestimonial = c.testimonial && (process.env.NODE_ENV !== "production" || !isPh(c.testimonial.quote));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: c.title, path: `/work/${c.slug}` },
        ])}
      />
      <section className="relative overflow-hidden border-b border-line">
        
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-orange/[0.07] blur-[120px]" />
        <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Link href="/work" className="reveal text-sm text-muted hover:text-ink">← All work</Link>
            <div className="reveal mt-6"><Badge tone={labelTone[c.label]}>{labelText[c.label]}</Badge></div>
            <h1 className="reveal mt-5 text-5xl leading-[1.02] sm:text-6xl" style={{ ["--d" as string]: "80ms" }}>{c.title}</h1>
            <p className="reveal mt-5 max-w-xl text-lg text-muted" style={{ ["--d" as string]: "160ms" }}>{c.summary}</p>
          </div>
          <div className="reveal tilt relative aspect-[16/10] overflow-hidden rounded-3xl border border-line shadow-2xl shadow-black/50" style={{ ["--d" as string]: "200ms" }}>
            <Media src={c.gallery[0].src} alt={c.gallery[0].alt} slug={c.slug} sizes="(min-width: 1024px) 45vw, 100vw" priority />
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <aside>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Snapshot</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <Row k="Client" v={c.client} />
              <Row k="Industry" v={c.industry} />
              <Row k="Services" v={c.services.join(", ")} />
              <Row k="Year" v={c.year} />
              <div>
                <dt className="text-muted">Timeline</dt>
                <dd className="mt-0.5 font-medium">
                  <T v={c.duration} />
                </dd>
              </div>
              <Row k="Stack" v={c.stack.join(" · ")} />
              {c.liveUrl && (
                <div>
                  <dt className="text-muted">Live site</dt>
                  <dd className="mt-0.5">
                    <a href={c.liveUrl} target="_blank" rel="noopener" className="font-medium text-orange underline underline-offset-4" data-umami-event="outbound_click" data-umami-event-target="live_site">
                      {c.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </aside>

          <div className="space-y-12">
            <Block title="The problem">
              <p>{c.problem}</p>
            </Block>
            <Block title="What I did">
              <ul className="space-y-3">
                {c.approach.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    {a}
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Key decisions">
              <div className="space-y-5">
                {c.decisions.map((d) => (
                  <div key={d.decision} className="spot rounded-2xl p-5">
                    <p className="font-semibold text-ink">{d.decision}</p>
                    <p className="mt-2">{d.why}</p>
                  </div>
                ))}
              </div>
            </Block>
            {c.label === "client" ? (
              <Block title="Results">
                <dl className="grid gap-4 sm:grid-cols-2">
                  {c.results.map((r) => (
                    <div key={r.label} className="rounded-2xl bg-paper p-5">
                      <dt className="text-sm">{r.label}</dt>
                      <dd className="mt-1 text-2xl font-bold text-ink">
                        <T v={r.value} />
                      </dd>
                      <dd className="mt-1 font-mono text-xs">Source: {r.source}</dd>
                    </div>
                  ))}
                </dl>
              </Block>
            ) : (
              <Block title="What it demonstrates">
                <ul className="space-y-2">
                  {c.demonstrates.map((d) => (
                    <li key={d}>✓ {d}</li>
                  ))}
                </ul>
              </Block>
            )}
            <Block title="Screens">
              <div className={`grid items-start gap-4 ${c.gallery.some((g) => g.device === "mobile") ? "sm:grid-cols-[2.6fr_1fr]" : "sm:grid-cols-2"}`}>
                {c.gallery.map((g) => (
                  <figure
                    key={g.alt}
                    className={`relative overflow-hidden rounded-2xl border border-line bg-surface-2 ${g.device === "desktop" ? "aspect-[16/10]" : "aspect-[390/844]"}`}
                  >
                    <Media src={g.src} alt={g.alt} slug={c.slug} sizes={g.device === "desktop" ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 640px) 18vw, 100vw"} />
                  </figure>
                ))}
              </div>
            </Block>
            {showTestimonial && c.testimonial && (
              <figure className="rounded-2xl border-l-4 border-orange bg-paper p-7">
                <blockquote className="text-lg text-ink">
                  “<T v={c.testimonial.quote} />”
                </blockquote>
                <figcaption className="mt-3 text-sm text-muted">
                  <T v={c.testimonial.name} />, <T v={c.testimonial.role} />
                </figcaption>
              </figure>
            )}
            <Link href={`/work/${next.slug}`} className="block spot rounded-2xl p-6 hover:border-ink">
              <p className="text-sm text-muted">Next case study</p>
              <p className="mt-1 text-lg font-bold">{next.title} →</p>
            </Link>
          </div>
        </div>
      </Section>
      <CtaBand title="Want something like this?" location={`case_study_${c.slug}`} />
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-muted">{k}</dt>
      <dd className="mt-0.5 font-medium">{v}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl">{title}</h2>
      <div className="mt-4 text-muted">{children}</div>
    </div>
  );
}
