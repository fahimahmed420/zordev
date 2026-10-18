import { Booking } from "@/components/forms/Booking";
import { ContactForm } from "@/components/forms/ContactForm";
import { ButtonLink, Heading, Section, T, PageHero } from "@/components/ui";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Contact: book a call or send a brief",
  "Book a free 20-minute call, ask for a free 3-risk check, or send a brief. Replies within one business day.",
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let&apos;s make it <span className="text-gradient">safe to launch.</span></>} intro={`Book a call or send a brief. Not ready to talk? Ask for a free 3-risk check instead. Either way, you'll hear back from me ${site.commitments.replySla}.`}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#book" location="contact_hero_book">
            Book a 20-minute call
          </ButtonLink>
          <ButtonLink href="#brief" variant="ghost" location="contact_hero_brief">
            Send a brief
          </ButtonLink>
          <ButtonLink href="/audit#check" variant="ghost" location="contact_hero_check">
            Free 3-risk check
          </ButtonLink>
        </div>
      </PageHero>

      <Section id="book">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Heading eyebrow="Option 1" title="Book a call" intro="Tell me about your app and what's worrying you. I'll be honest about whether you need me, and what it would cost." />
          <Booking url={site.bookingUrl} />
        </div>
      </Section>

      <Section id="brief" className="bg-paper">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Heading eyebrow="Option 2" title="Send a brief" intro="Prefer writing? Share the details and I'll reply with questions or a next step." />
            <dl className="mt-10 space-y-5 text-sm">
              <div>
                <dt className="text-muted">Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="font-semibold text-orange underline underline-offset-4">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Reply time</dt>
                <dd className="font-medium">Within one business day</dd>
              </div>
              <div>
                <dt className="text-muted">Hours</dt>
                <dd className="font-medium">
                  <T v={site.hours} />
                </dd>
              </div>
              <div>
                <dt className="text-muted">Based in</dt>
                <dd className="font-medium">
                  {site.location} ({site.timezoneLabel})
                </dd>
              </div>
              <div>
                <dt className="text-muted">Elsewhere</dt>
                <dd className="flex gap-4 font-medium">
                  <a href={site.socials.linkedin} className="hover:text-orange">LinkedIn</a>
                  <a href={site.socials.x} className="hover:text-orange">X</a>
                  <a href={site.socials.github} className="hover:text-orange">GitHub</a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="relative spot rounded-3xl p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
