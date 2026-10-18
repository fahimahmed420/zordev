import Link from "next/link";
import { Badge, ButtonLink, T, usd } from "@/components/ui";
import { carePlans, careSmallPrint, offers, type Offer } from "@/content/pricing";
import { cta } from "@/content/site";
import { reportReady, severityTone, type Finding } from "@/content/sample-report";

/** Audit → Sprint → Launch cards. */
export function OfferLadder({ location }: { location: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {offers.map((o, i) => (
        <OfferCard key={o.id} o={o} i={i} location={location} />
      ))}
    </div>
  );
}

function OfferCard({ o, i, location }: { o: Offer; i: number; location: string }) {
  return (
    <div
      data-reveal
      style={{ ["--d" as string]: `${i * 90}ms` }}
      id={o.id}
      className={`relative flex scroll-mt-28 flex-col rounded-2xl border bg-surface p-8 ${o.highlighted ? "border-orange ring-1 ring-orange" : "border-line"}`}
    >
      {o.highlighted && (
        <div className="absolute -top-3 left-8">
          <Badge tone="orange">Most chosen</Badge>
        </div>
      )}
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">{o.name}</p>
      <p className="mt-5 font-display text-6xl leading-none text-ink">{usd(o.price)}</p>
      <p className="mt-2 font-mono text-xs text-muted">{o.timeline}</p>
      <h3 className="mt-6 text-2xl leading-snug text-ink">{o.promise}</h3>
      <p className="mt-3 leading-relaxed text-muted">{o.blurb}</p>
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
      <div className="mt-auto pt-8">
        <ButtonLink href={o.cta.href} variant={o.highlighted ? "primary" : "ghost"} location={`${location}_${o.id}`}>
          {o.cta.label}
        </ButtonLink>
      </div>
    </div>
  );
}

export function CarePlans({ location }: { location: string }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {carePlans.map((c, i) => (
          <div
            key={c.id}
            data-reveal
            style={{ ["--d" as string]: `${i * 90}ms` }}
            className={`relative flex flex-col rounded-2xl border bg-surface p-7 ${c.highlighted ? "border-orange ring-1 ring-orange" : "border-line"}`}
          >
            {c.highlighted && (
              <div className="absolute -top-3 left-7">
                <Badge tone="orange">Most chosen</Badge>
              </div>
            )}
            <h3 className="text-3xl text-ink">{c.name}</h3>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="font-display text-5xl leading-none text-ink">
                {usd(c.price)}
                <span className="font-sans text-base text-muted">/mo</span>
              </p>
              <ButtonLink href={cta.call.href} variant={c.highlighted ? "primary" : "ghost"} location={`${location}_${c.id}`}>
                Add to my project
              </ButtonLink>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm">
              {c.includes.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <span aria-hidden="true" className="text-orange">
                    ✓
                  </span>
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-auto border-t border-line pt-5 font-mono text-xs leading-relaxed text-muted">{c.response}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-sm text-muted">{careSmallPrint}</p>
    </>
  );
}

export function SeverityChip({ s }: { s: Finding["severity"] }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 font-mono text-[11px] ring-1 ${severityTone[s]}`}>{s}</span>;
}

/** Severity · finding · what it means. */
export function FindingsTable({ findings }: { findings: Finding[] }) {
  if (!reportReady) return <ReportComingSoon />;
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="border-b border-line font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <tr>
            <th scope="col" className="px-5 py-3 font-normal">
              Severity
            </th>
            <th scope="col" className="px-5 py-3 font-normal">
              Finding
            </th>
            <th scope="col" className="px-5 py-3 font-normal">
              What it means
            </th>
          </tr>
        </thead>
        <tbody>
          {findings.map((f, i) => (
            <tr key={i} className="border-b border-line last:border-0 align-top">
              <td className="px-5 py-4">
                <SeverityChip s={f.severity} />
              </td>
              <td className="px-5 py-4 text-ink">
                <T v={f.title} />
              </td>
              <td className="px-5 py-4 text-muted">
                <T v={f.meaning} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OtherBuildsLine() {
  return (
    <p className="mt-8 text-muted">
      Building something new instead? I also build Next.js stores and web apps.{" "}
      <Link href="/builds" className="link-u text-ink">
        Other builds →
      </Link>
    </p>
  );
}

/** Shown until the sample audit is filled in with real findings. */
export function ReportComingSoon() {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">Being written up</p>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        The sample report is being written up from a real audit of my test app. Until it&apos;s published, a free 3-risk check shows you the
        same kind of findings on your own app.
      </p>
    </div>
  );
}
