import Link from "next/link";
import { ThankYouNext } from "@/components/forms/ThankYouNext";
import { PageHero, Section } from "@/components/ui";
import { site } from "@/content/site";

export const metadata = { title: "Thanks for your brief", robots: { index: false, follow: false } };

export default function ThankYouPage() {
  return (
    <>
      <PageHero
        eyebrow="Brief received"
        title={
          <>
            Thanks, I&apos;ve <em className="text-orange">got it.</em>
          </>
        }
        intro={`A confirmation is on its way to your inbox. I'll read your brief myself and reply ${site.commitments.replySla}.`}
      />
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl">What happens next</h2>
            <ol className="mt-5 space-y-4 text-muted">
              <li>
                <strong className="text-ink">1.</strong> I review your brief and check it against my current schedule.
              </li>
              <li>
                <strong className="text-ink">2.</strong> I reply with questions, a suggested approach, or an honest recommendation if someone else would suit you better.
              </li>
              <li>
                <strong className="text-ink">3.</strong> If it's a fit, we agree a scope and a fixed price before any work starts.
              </li>
            </ol>
          </div>
          <ThankYouNext bookingUrl={site.bookingUrl} />
        </div>
        <p className="mt-12">
          <Link href="/work" className="font-semibold text-orange underline underline-offset-4">
            Meanwhile, see recent work →
          </Link>
        </p>
      </Section>
    </>
  );
}
