import { Avatar } from "@/components/sections/Avatar";
import { CtaBand } from "@/components/sections/shared";
import { Heading, PageHero, Section } from "@/components/ui";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "About",
  "Zordev is Fahim Ahmed's studio in Dhaka, Bangladesh. I make apps built with AI tools safe for real users, with calls during the US working day.",
  "/about",
);

const principles = [
  { title: "Say what's true", text: "No fake logos, no invented numbers. Studio tests and demos are labelled as exactly that. If your app is fine, I'll say so." },
  { title: "Prove it's fixed", text: "Every fix is retested and written up. You get evidence, not a promise." },
  { title: "Leave you in control", text: "Code, hosting and database accounts in your name, with a handover document any developer can follow." },
];

const tools = ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma", "MongoDB", "Firebase Auth", "Vercel", "Claude", "ChatGPT"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            You talk to me, and I write the <em>code</em>
          </>
        }
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <Avatar />
            <p className="mt-5 font-display text-3xl text-ink">{site.owner.name}</p>
            <p className="text-muted">{site.owner.role}</p>
          </div>
          <div className="space-y-5 text-lg text-muted">
            <p>
              I&apos;m {site.owner.name}, a Next.js and TypeScript developer based in {site.locationDetail}. Zordev is my studio. I make apps built
              with AI tools like Lovable, Bolt, v0 and Replit safe for real users and real money.
            </p>
            <p>
              AI builders are brilliant at getting an idea working. They&apos;re less careful about the parts nobody sees in a demo: who can read
              which rows in the database, where the keys live, whether a payment event is real. That&apos;s the work I do: find those gaps, fix
              them in your code, and prove they&apos;re closed.
            </p>
            <p>
              Before this I built, and still run, a live import store that ships across Bangladesh, with courier booking automated for trusted
              repeat customers, PDF invoices and a test suite on the checkout. I&apos;ve also built a full commerce stack with server-side payment
              confirmation and a bilingual AI support assistant. Both taught me what breaks when real customers and real money arrive.
            </p>
            <p>
              I work from Dhaka ({site.timezoneLabel}). {site.overlap}
            </p>
          </div>
        </div>
      </Section>
      <Section className="bg-paper">
        <Heading eyebrow="Principles" title="How I work" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="spot rounded-2xl p-6">
              <h3>{p.title}</h3>
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
