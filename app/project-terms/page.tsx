import { PageHero, Section } from "@/components/ui";
import { careSmallPrint, guarantees, paymentTerms } from "@/content/pricing";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Project terms",
  "How Zordev audits, sprints and launches are scoped, paid for, delivered and guaranteed, in plain words.",
  "/project-terms",
);

// DRAFT: have a lawyer review this page before relying on it. The signed scope for each job takes priority.
export default function ProjectTermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal · draft"
        title="Project terms"
        intro="Last updated: October 2026. These are the standard terms for every audit, sprint and launch. The written scope you sign for your job takes priority over this page."
      />
      <Section>
        <div className="max-w-3xl space-y-10 text-muted [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink">
          <div>
            <h2>Scope and price</h2>
            <p className="mt-3">
              Every job starts with a written scope and a fixed price. Nothing starts until you approve it, and work starts within 5 business
              days of approval. Anything outside the scope is quoted separately before I do it.
            </p>
          </div>
          <div>
            <h2>Access</h2>
            <p className="mt-3">
              Free checks and audits use read-only access that you provide and can revoke at any time. I change nothing in your app until you
              approve a fix and its price. During fixes I work in your repository, on a branch you can review.
            </p>
          </div>
          <div>
            <h2>Payment</h2>
            <ul className="mt-3 space-y-2">
              {paymentTerms.map((t) => (
                <li key={t}>· {t}</li>
              ))}
            </ul>
            <p className="mt-3">The $500 audit fee is credited in full against a sprint or launch booked within 30 days of the report.</p>
          </div>
          <div>
            <h2>Guarantees</h2>
            <ul className="mt-3 space-y-2">
              {guarantees.map((g) => (
                <li key={g.title}>
                  <strong className="text-ink">{g.title}.</strong> {g.text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Ownership</h2>
            <p className="mt-3">
              You own the code I write for you once the job is paid in full. Code, hosting and database accounts are set up in your name, and
              the audit report is yours to keep, whoever does the fixes.
            </p>
          </div>
          <div>
            <h2>Confidentiality</h2>
            <p className="mt-3">
              I keep your code, data and business details confidential and will sign your NDA. Findings are only published with your written
              approval, after the retest confirms they're fixed, and with names, URLs and keys removed.
            </p>
          </div>
          <div>
            <h2>Care plans</h2>
            <p className="mt-3">Paid monthly in advance. {careSmallPrint}</p>
          </div>
          <div>
            <h2>Questions</h2>
            <p className="mt-3">
              Email{" "}
              <a href={`mailto:${site.email}`} className="text-orange underline underline-offset-4">
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
