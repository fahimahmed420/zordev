import { Section, PageHero } from "@/components/ui";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Privacy policy", "How Zordev collects, uses and protects information sent through zordev.com.", "/privacy");

// Draft for professional review before relying on it.
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" intro="Last updated: October 2026" />
      <Section>
        <div className="max-w-3xl space-y-8 text-muted [&_h2]:text-xl [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink">
          <p>
            This policy explains what information Zordev ("I", "me"), run by {site.owner.name} in {site.location}, collects through
            zordev.com and how it is used.
          </p>
          <div>
            <h2>What I collect</h2>
            <p className="mt-2">
              When you send a project brief: your name, email, company (optional), project type, budget range, timeline, project details,
              how you heard about Zordev, and the page or campaign that brought you here. When you book a call: the details you enter in
              the booking tool.
            </p>
          </div>
          <div>
            <h2>Why I collect it</h2>
            <p className="mt-2">
              Only to reply to your inquiry, prepare a proposal, and work with you if we go ahead. The legal basis is your request for a
              reply (steps before a contract) and my legitimate interest in running the studio. I never sell your data or add you to a
              mailing list without asking.
            </p>
          </div>
          <div>
            <h2>Analytics and cookies</h2>
            <p className="mt-2">
              The site uses Umami, a privacy-friendly analytics tool that does not use cookies or collect personal data. It records
              anonymous page views and button clicks so I can improve the site. The spam check (Cloudflare Turnstile) may set a strictly
              necessary cookie when you send a form. Cloudflare, which protects and serves the site, may also collect anonymous
              performance data. Call bookings are handled on this site and sent to me by email.
            </p>
          </div>
          <div>
            <h2>Who processes data for me</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Hosting provider (serves the website)</li>
              <li>Resend (sends form emails)</li>
              <li>Cloudflare (DNS, security, Turnstile spam protection)</li>
              <li>Umami (cookieless analytics)</li>
              <li>Google Workspace (email and lead records)</li>
            </ul>
          </div>
          <div>
            <h2>How long I keep it</h2>
            <p className="mt-2">
              Inquiries that don't become projects are deleted within 12 months. Client project records are kept as long as needed for
              the work, invoicing and legal obligations.
            </p>
          </div>
          <div>
            <h2>Your rights</h2>
            <p className="mt-2">
              You can ask to see, correct or delete your information at any time by emailing{" "}
              <a className="text-orange underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              . If you are in the UK or EU, you also have the right to complain to your local data protection authority.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
