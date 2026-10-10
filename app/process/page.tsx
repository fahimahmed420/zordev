import { CtaBand } from "@/components/sections/shared";
import { Heading, Section, PageHero } from "@/components/ui";
import { processName, processSteps, workingStyle } from "@/content/process";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Process: how Zordev works",
  "Five clear steps from first call to launch: discover, scope, design, build, launch and support. What happens, what I need from you, and what you get.",
  "/process",
);

export default function ProcessPage() {
  return (
    <>
      <PageHero eyebrow="Process" title={processName} intro="Five steps. At each one you know what happens, what I need from you, what you get, and how long it takes." />
      <Section>
        <ol className="space-y-6">
          {processSteps.map((s) => (
            <li key={s.n} className="grid gap-6 spot rounded-2xl p-6 sm:p-8 lg:grid-cols-[14rem_1fr]">
              <div>
                <span className="font-mono text-sm text-orange">Step 0{s.n}</span>
                <h2 className="mt-1 text-2xl font-bold">{s.name}</h2>
                <p className="mt-2 font-mono text-xs text-muted">{s.duration}</p>
              </div>
              <dl className="grid gap-5 sm:grid-cols-3">
                <div>
                  <dt className="font-semibold">What happens</dt>
                  <dd className="mt-1 text-muted">{s.what}</dd>
                </div>
                <div>
                  <dt className="font-semibold">What I need from you</dt>
                  <dd className="mt-1 text-muted">{s.fromClient}</dd>
                </div>
                <div>
                  <dt className="font-semibold">What you get</dt>
                  <dd className="mt-1 text-muted">{s.clientGets}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </Section>
      <Section className="bg-paper">
        <Heading eyebrow="Working style" title="How we'll work together" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {workingStyle.map((w) => (
            <div key={w.title} className="spot rounded-2xl p-6">
              <h3 className="font-bold">{w.title}</h3>
              <p className="mt-2 text-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand location="process_band" />
    </>
  );
}
