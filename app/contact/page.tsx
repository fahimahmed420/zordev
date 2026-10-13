import { Booking } from "@/components/forms/Booking";
import { ContactForm } from "@/components/forms/ContactForm";
import { Heading, Section, T, PageHero } from "@/components/ui";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Contact: book a call or send a brief",
  "Book a free 20-minute discovery call or send a project brief. Replies within one business day.",
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let&apos;s build <span className="text-gradient">something good.</span></>} intro={`Two ways to start. Either way, you will hear back from me ${site.commitments.replySla}.`}>
        <div className="flex flex-wrap gap-3">
          <a href="#book" data-umami-event="cta_click" data-umami-event-location="contact_hero_book" className="magnetic rounded-full bg-orange px-5 py-3 text-sm font-semibold text-[#0c0c0c]">Book a 20-minute call</a>
          <a href="#brief" data-umami-event="cta_click" data-umami-event-location="contact_hero_brief" className="rounded-full border border-line-strong px-5 py-3 text-sm font-semibold hover:border-ink">Send a project brief</a>
        </div>
      </PageHero>

      <Section id="book">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Heading eyebrow="Option 1" title="Book a call" intro="Tell me what you're planning and I'll be honest about whether I'm the right fit, plus a rough budget and timeline." />
          <Booking url={site.bookingUrl} />
        </div>
      </Section>

      <Section id="brief" className="bg-paper">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Heading eyebrow="Option 2" title="Send a project brief" intro="Prefer writing? Share the details and I'll reply with questions or a next step." />
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
