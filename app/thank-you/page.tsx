import Link from "next/link";
import { ThankYouNext } from "@/components/forms/ThankYouNext";
import { Container, Section } from "@/components/ui";
import { site } from "@/content/site";

export const metadata = { title: "Thanks for your brief", robots: { index: false, follow: false } };

export default function ThankYouPage() {
  return (
    <>
      <section className="relative overflow-hidden"><div aria-hidden="true" className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-orange/[0.07] blur-[120px]" />
        <Container className="relative py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Brief received</p>
          <h1 className="mt-5 text-6xl leading-[0.98] sm:text-8xl">Thanks, I've got it.</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            A confirmation is on its way to your inbox. I'll read your brief myself and reply {site.commitments.replySla}.
          </p>
        </Container>
      </section>
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
