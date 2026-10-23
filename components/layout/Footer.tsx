import Link from "next/link";
import { services } from "@/content/services";
import { cta, site } from "@/content/site";
import { sortedCaseStudies } from "@/content/work";
import { ButtonLink, Container } from "@/components/ui";
import { Marquee } from "@/components/ui/Marquee";
import { DhakaClock } from "./DhakaClock";
import { Logo } from "./Logo";

const marquee = ["Online stores", "Business websites", "Web apps & MVPs", "AI-built app fixes", "Built properly", "Shipped on scope"];

export function Footer() {
  const socials = [
    { label: "LinkedIn", href: site.socials.linkedin },
    { label: "X", href: site.socials.x },
    { label: "GitHub", href: site.socials.github },
    ...(site.socials.instagram ? [{ label: "Instagram", href: site.socials.instagram }] : []),
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-[#0a0a0a] text-muted">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-orange/[0.06] blur-[120px]" />

      {/* Marquee */}
      <Marquee label="services ticker" className="border-b border-line py-7">
        {marquee.map((m) => (
          <span key={m} className="flex items-center gap-10 pr-10 font-display text-5xl italic text-ink transition-colors hover:text-orange sm:text-6xl">
            {m}
            <span aria-hidden="true" className="text-2xl not-italic text-orange">✦</span>
          </span>
        ))}
      </Marquee>

      <Container className="relative grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        {/* Brand + live status */}
        <div>
          <Link href="/" aria-label="Zordev home" className="inline-block">
            <Logo dark />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">A web development studio run by {site.owner.name}. Websites, online stores and web apps, built properly.</p>
          <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
            <DhakaClock />
            <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
              <ButtonLink href={cta.primary.href} location="footer">
                {cta.primary.label}
              </ButtonLink>
              <a href={`mailto:${site.email}`} className="inline-flex min-h-12 items-center rounded-full border border-line-strong px-5 text-sm text-ink transition-colors hover:border-orange hover:text-orange">
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <FooterCol title="Services" links={services.map((s) => ({ href: `/services#${s.slug}`, label: s.title }))} />
        <FooterCol title="Work" links={sortedCaseStudies.map((c) => ({ href: `/work/${c.slug}`, label: c.client.split(" (")[0] }))} />
        <div>
          <FooterCol
            title="Studio"
            links={[
              { href: "/about", label: "About" },
              { href: "/process", label: "Process" },
              { href: "/pricing", label: "Pricing" },
              { href: "/contact", label: "Contact" },
            ]}
          />
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-orange">Elsewhere</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  rel="me noopener"
                  target="_blank"
                  data-umami-event="outbound_click"
                  data-umami-event-target={s.label.toLowerCase()}
                  className="group/s inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-ink transition-all duration-300 hover:border-orange hover:bg-orange hover:text-[#0c0c0c]"
                >
                  {s.label}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover/s:-translate-y-0.5 group-hover/s:translate-x-0.5">
                    ↗
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.owner.portfolio}
                data-umami-event="outbound_click"
                data-umami-event-target="portfolio"
                className="group/s inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-ink transition-all duration-300 hover:border-orange hover:bg-orange hover:text-[#0c0c0c]"
              >
                Meet the developer
                <span aria-hidden="true" className="transition-transform duration-300 group-hover/s:-translate-y-0.5 group-hover/s:translate-x-0.5">
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </div>
      </Container>

      {/* Giant interactive wordmark */}
      <Container className="relative">
        <p aria-hidden="true" className="flex select-none justify-between font-display text-[34vw] leading-[0.8] lg:text-[25rem]">
          {"zordev".split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block bg-gradient-to-b from-[#3d3a36] to-[#0a0a0a] bg-clip-text text-transparent transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-4 hover:from-orange hover:to-[#7a3416]"
            >
              {ch}
            </span>
          ))}
        </p>
      </Container>

      <Container className="relative flex flex-col gap-4 border-t border-line py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {site.foundingYear} Zordev · {site.location}
        </p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="link-u hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="link-u hover:text-ink">
            Terms
          </Link>
          <Link href="/project-terms" className="link-u hover:text-ink">
            Project terms
          </Link>
          <a
            href="#main"
            className="group/top inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-ink transition-colors hover:border-orange hover:text-orange"
          >
            Back to top
            <span aria-hidden="true" className="transition-transform duration-300 group-hover/top:-translate-y-0.5">
              ↑
            </span>
          </a>
        </div>
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
            <Link href={l.href} className="group/l inline-flex items-center gap-2 transition-colors hover:text-ink">
              <span aria-hidden="true" className="-ml-4 w-2 text-orange opacity-0 transition-all duration-300 group-hover/l:ml-0 group-hover/l:opacity-100">
                →
              </span>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
