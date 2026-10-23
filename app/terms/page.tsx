import { Section, PageHero } from "@/components/ui";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Terms of use", "Terms for using the zordev.com website.", "/terms");

// Draft for professional review before relying on it.
export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of use" intro="Last updated: October 2026" />
      <Section>
        <div className="max-w-3xl space-y-8 text-muted [&_h2]:text-xl [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink">
          <p>These terms cover your use of zordev.com. By using the site you agree to them.</p>
          <div>
            <h2>The website</h2>
            <p className="mt-2">
              Content on this site is for general information. Prices shown are starting prices; every project is quoted individually.
              Nothing on the site is a binding offer.
            </p>
          </div>
          <div>
            <h2>Client projects</h2>
            <p className="mt-2">
              Project work is governed by a separate written proposal or agreement, which takes priority over anything on this site. The standard terms for projects are on the project terms page (/project-terms).
            </p>
          </div>
          <div>
            <h2>Intellectual property</h2>
            <p className="mt-2">
              The Zordev name, logo and site content belong to Zordev. Case study screenshots are shown with permission or are of Zordev's
              own and concept projects, as labelled. Please don't reuse them without asking.
            </p>
          </div>
          <div>
            <h2>Links</h2>
            <p className="mt-2">Links to other websites are provided for convenience. I'm not responsible for their content.</p>
          </div>
          <div>
            <h2>Liability</h2>
            <p className="mt-2">
              The site is provided as is. To the extent the law allows, Zordev is not liable for losses arising from the use of this website.
            </p>
          </div>
          <div>
            <h2>Contact</h2>
            <p className="mt-2">
              Questions about these terms:{" "}
              <a className="text-orange underline" href={`mailto:${site.email}`}>
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
