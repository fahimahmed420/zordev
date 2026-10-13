import { ButtonLink, PageHero } from "@/components/ui";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <PageHero eyebrow="404" title="This page doesn't exist." intro="The link may be old or mistyped. Here are a few places to go instead.">
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/work" variant="ghost">
          See the work
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          Contact
        </ButtonLink>
      </div>
    </PageHero>
  );
}
