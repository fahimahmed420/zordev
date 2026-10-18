import { ReportComingSoon, SeverityChip } from "@/components/sections/offer";
import { CtaBand } from "@/components/sections/shared";
import { ButtonLink, Heading, PageHero, Section, T } from "@/components/ui";
import { reportReady, sampleReport as r } from "@/content/sample-report";
import { cta } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Sample audit report",
  "A real production readiness audit of a test app built in Lovable by Zordev: every finding, what it means, the evidence and the fix. No email required.",
  "/sample-report",
);

export default function SampleReportPage() {
  if (!reportReady)
    return (
      <>
        <PageHero eyebrow={r.label} title={<>A sample audit, <em>coming soon</em></>} intro="I built a small app in Lovable with login, a database and a test checkout, and I'm auditing it the same way I audit client apps. The full, unedited report goes here once the fixes are retested." />
        <Section>
          <ReportComingSoon />
          <div className="mt-8">
            <ButtonLink href={cta.check.href} location="report_soon_check">
              {cta.check.label}
            </ButtonLink>
          </div>
        </Section>
        <CtaBand location="report_band" />
      </>
    );
  return (
    <>
      <PageHero
        eyebrow={r.label}
        title={
          <>
            A sample audit, <em>unedited</em>
          </>
        }
        intro={r.intro}
      >
        <dl className="grid grid-cols-2 gap-4 font-mono text-xs">
          <Fact k="App" v={r.appName} />
          <Fact k="Built with" v={r.builtWith} />
          <Fact k="Stack" v={r.stack} />
          <Fact k="Build time" v={r.buildTime} />
          <Fact k="Findings" v={r.summary} />
          <Fact k="Fixed in" v={r.fixedIn} />
        </dl>
      </PageHero>

      <Section>
        <Heading eyebrow="What I found" n="01" title="Findings, ranked by damage" intro="This is a test app built by Zordev, not a client. Every finding was fixed and retested before publishing." />
        <ol className="mt-12 space-y-4">
          {r.findings.map((f, i) => (
            <li key={i} className="rounded-2xl border border-line bg-surface p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-orange">#{i + 1}</span>
                <SeverityChip s={f.severity} />
              </div>
              <h2 className="mt-4 text-3xl text-ink">
                <T v={f.title} />
              </h2>
              <dl className="mt-6 grid gap-6 md:grid-cols-3">
                <Detail k="What it means" v={f.meaning} />
                <Detail k="Evidence" v={f.evidence} />
                <Detail k="The fix" v={f.fix} />
              </dl>
            </li>
          ))}
        </ol>
      </Section>

      <Section dark>
        <Heading eyebrow="What changed" n="02" title="After the fixes" />
        <ul className="mt-10 space-y-3 text-lg text-muted">
          {r.changed.map((c, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              <T v={c} />
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href={cta.check.href} location="report_check">
            Built yours the same way? Get a free 3-risk check
          </ButtonLink>
          {r.pdfUrl && (
            <ButtonLink href={r.pdfUrl} variant="ghost" location="report_pdf">
              Download the PDF
            </ButtonLink>
          )}
        </div>
      </Section>
      <CtaBand location="report_band" />
    </>
  );
}

function Fact({ k, v }: { k: string; v: Parameters<typeof T>[0]["v"] }) {
  return (
    <div>
      <dt className="uppercase tracking-[0.14em] text-muted">{k}</dt>
      <dd className="mt-1 text-sm text-ink">
        <T v={v} />
      </dd>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: Parameters<typeof T>[0]["v"] }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-orange">{k}</dt>
      <dd className="mt-2 text-muted">
        <T v={v} />
      </dd>
    </div>
  );
}
