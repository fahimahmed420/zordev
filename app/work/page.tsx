import { CaseStudyCard, CtaBand } from "@/components/sections/shared";
import { Section, PageHero } from "@/components/ui";
import { sortedCaseStudies } from "@/content/work";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Work and case studies",
  "Case studies from Zordev: a bilingual learning platform for a language school, a full commerce stack with a bilingual AI assistant, and concept sites for a SaaS company, a local contractor and a candle brand.",
  "/work",
);

export default function WorkPage() {
  return (
    <>
      <PageHero eyebrow="Work" title="Case studies" intro="Every project is labelled for what it is: client work, a studio product, or a concept. More client case studies are on the way." />
      <Section>
        <h2 className="sr-only">All case studies</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {sortedCaseStudies.map((c, i) => (
            <div key={c.slug} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }} className={i === 0 ? "md:col-span-2" : ""}>
              <CaseStudyCard c={c} wide={i === 0} index={i} priority={i === 0} />
            </div>
          ))}
        </div>
      </Section>
      <CtaBand location="work_band" />
    </>
  );
}
