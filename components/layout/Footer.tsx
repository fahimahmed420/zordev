import Link from "next/link";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { sortedCaseStudies } from "@/content/work";
import { Container } from "@/components/ui";
import { Logo } from "./Logo";

export function Footer() {
  const socials = [
    { label: "LinkedIn", href: site.socials.linkedin },
    { label: "X", href: site.socials.x },
    { label: "GitHub", href: site.socials.github },
    ...(site.socials.instagram ? [{ label: "Instagram", href: site.socials.instagram }] : []),
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-[#0a0a0a] text-muted">
      <Container className="relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo dark />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            A web development studio run by {site.owner.name}. {site.location} ({site.timezoneLabel}).
          </p>
          <a href={`mailto:${site.email}`} className="link-u mt-5 inline-block font-display text-2xl text-ink">
            {site.email}
          </a>
          <p className="mt-5 text-sm">
            <a href={site.owner.portfolio} className="link-u text-ink" data-umami-event="outbound_click" data-umami-event-target="portfolio">
              Meet the developer →
            </a>
          </p>
        </div>
        <FooterCol title="Services" links={services.map((s) => ({ href: `/services#${s.slug}`, label: s.title }))} />
        <FooterCol title="Work" links={sortedCaseStudies.map((c) => ({ href: `/work/${c.slug}`, label: c.client.split(" (")[0] }))} />
        <FooterCol
          title="Studio"
          links={[
            { href: "/about", label: "About" },
            { href: "/process", label: "Process" },
            { href: "/pricing", label: "Pricing" },
            { href: "/contact", label: "Contact" },
          ]}
        />
      </Container>

      <Container className="relative flex flex-col gap-4 border-t border-line py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>© {site.foundingYear} Zordev. All rights reserved.</p>
        <ul className="flex flex-wrap gap-6">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                rel="me noopener"
                target="_blank"
                className="link-u hover:text-ink"
                data-umami-event="outbound_click"
                data-umami-event-target={s.label.toLowerCase()}
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <Link href="/privacy" className="link-u hover:text-ink">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="link-u hover:text-ink">
              Terms
            </Link>
          </li>
        </ul>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-u hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
