import { CtaBand } from "@/components/sections/shared";
import { Avatar } from "@/components/sections/Avatar";
import { Heading, Section, PageHero } from "@/components/ui";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "About",
  "Zordev is a small web development studio run by Fahim Ahmed in Dhaka, Bangladesh, building websites, online stores and web apps for clients worldwide, and fixing apps built with AI tools.",
  "/about",
);

const principles = [
  { title: "Say what's true", text: "No fake logos, no invented numbers. If something isn't ready yet, I say so." },
  { title: "Small scope, shipped", text: "A clear scope delivered on time beats a big plan that never launches." },
  { title: "Leave it better than I found it", text: "Clean code, documentation and a proper handover, so you're never locked in." },
];

const tools = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Prisma", "PostgreSQL", "MongoDB", "Firebase", "Vercel", "Claude", "ChatGPT"];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="A small studio, on purpose" />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <Avatar />
            <p className="mt-5 font-display text-3xl text-ink">{site.owner.name}</p>
            <p className="text-muted">{site.owner.role}</p>
          </div>
          <div className="space-y-5 text-lg text-muted">
            <p>
              I'm {site.owner.name}, a full-stack developer based in {site.locationDetail}. Zordev is how I take on client projects:
              websites, online stores and web apps for founders and small businesses. I also fix apps built with AI tools like Lovable, Bolt
              and v0, so they&apos;re safe for real users and real payments.
            </p>
            <p>
              I started Zordev because hiring a developer is often a gamble. Freelancers vanish, agencies send account managers instead of
              answers, and quotes keep growing. I wanted a studio where you talk to the person writing the code, agree a clear scope, and get
              weekly updates you never have to chase.
            </p>
            <p>
              I've built a production online store that ships across Bangladesh with courier booking automated, a full commerce stack with a
              bilingual AI assistant, and interactive brand sites. When a project needs specialist design or copywriting, I'll recommend
              people and tell you upfront.
            </p>
            <p>
              I use Claude, Claude Code and ChatGPT to move faster on routine code, and I read, test and understand every line before it
              reaches your project. Your code and data never go into a tool that trains on them.
            </p>
            <p>
              I work from Dhaka ({site.timezoneLabel}). {site.overlap}
            </p>
            <p>
              <a href={site.owner.portfolio} className="font-semibold text-orange underline underline-offset-4" data-umami-event="outbound_click" data-umami-event-target="portfolio">
                See my personal portfolio →
              </a>
            </p>
          </div>
        </div>
      </Section>
      <Section className="bg-paper">
        <Heading eyebrow="Principles" title="How I work" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="spot rounded-2xl p-6">
              <h3 className="">{p.title}</h3>
              <p className="mt-2 text-muted">{p.text}</p>
            </div>
          ))}
        </div>
        <h3 className="mt-14 font-mono text-xs uppercase tracking-[0.2em] text-orange">Tools I use</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {tools.map((t) => (
            <li key={t} className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm">
              {t}
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand location="about_band" />
    </>
  );
}
