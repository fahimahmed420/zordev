import Link from "next/link";
import { PageHero, Section } from "@/components/ui";
import { carePlan, guarantees, notIncluded, paymentTerms } from "@/content/pricing";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Project terms",
  "How Zordev builds, audits and fixes are scoped, paid for, delivered and guaranteed, in plain words.",
  "/project-terms",
);

// DRAFT: have a lawyer review this page before relying on it. The signed scope for each project takes priority.
export default function ProjectTermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal · draft"
        title="Project terms"
        intro="Last updated: October 2026. These are the standard terms for every website, store, web app, audit and fix. The written scope you sign for your project takes priority over this page."
      />
      <Section>
        <div className="max-w-3xl space-y-10 text-muted [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink">
          <div>
            <h2>Scope and price</h2>
            <p className="mt-3">
              Every project starts with a written scope and a fixed price. Nothing starts until you approve it, and work starts within 5 business
              days of approval. Changes outside the scope are quoted before I do them. Prices on the{" "}
              <Link href="/pricing" className="text-orange underline underline-offset-4">
                pricing page
              </Link>{" "}
              are starting prices; your quote is fixed once the scope is agreed.
            </p>
          </div>
          <div>
            <h2>Payment</h2>
            <ul className="mt-3 space-y-2">
              {paymentTerms.map((t) => (
                <li key={t}>· {t}</li>
              ))}
            </ul>
            <p className="mt-3">The $500 audit fee is credited in full against a hardening sprint booked within 30 days of the report.</p>
          </div>
          <div>
            <h2>Updates and delivery</h2>
            <p className="mt-3">
              Builds run on a private staging link you can open any time, with a written update every week. You give feedback within the
              agreed review window, and launch happens on your domain once you approve it.
            </p>
          </div>
          <div>
            <h2>Audits and fixes</h2>
            <p className="mt-3">
              Free checks and audits use read-only access that you provide and can revoke at any time. I change nothing in your app until you
              approve a fix and its price. Fixes are made in your repository, retested, and written up.
            </p>
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
              You own the code I write for you once the project is paid in full. The code, domain, hosting and database accounts are set up in
              your name, with full access handed over on final payment. Audit reports are yours to keep, whoever does the fixes.
            </p>
          </div>
          <div>
            <h2>Not included</h2>
            <ul className="mt-3 space-y-2">
              {notIncluded.map((t) => (
                <li key={t}>· {t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Care plans</h2>
            <p className="mt-3">
              {carePlan} Paid monthly in advance. Hosting and third-party fees are billed to you directly, on accounts in your name.
            </p>
          </div>
          <div>
            <h2>Confidentiality</h2>
            <p className="mt-3">
              I keep your code, data and business details confidential and will sign your NDA. Work is only shown in my portfolio with your
              written permission.
            </p>
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
