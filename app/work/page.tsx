import { CaseStudyCard, CtaBand } from "@/components/sections/shared";
import { Section, PageHero } from "@/components/ui";
import { sortedCaseStudies } from "@/content/work";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Work and case studies",
  "Case studies from Zordev: a client e-commerce store with courier automation, a full commerce stack with a bilingual AI assistant, and a brand site concept.",
  "/work",
);

export default function WorkPage() {
  return (
    <>
      <PageHero eyebrow="Work" title="Case studies" intro="Every project is labelled for what it is: client work, a studio product, or a concept. More client case studies are on the way." />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {sortedCaseStudies.map((c, i) => (
            <div key={c.slug} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }} className={i === 0 ? "md:col-span-2" : ""}>
              <CaseStudyCard c={c} wide={i === 0} />
            </div>
          ))}
        </div>
      </Section>
      <CtaBand location="work_band" />
    </>
  );
}
