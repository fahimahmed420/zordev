import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden"><div aria-hidden="true" className="grid-bg absolute inset-0" /><div aria-hidden="true" className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-orange/[0.07] blur-[120px]" />
      <Container className="relative py-28">
        <p className="font-mono text-sm text-orange">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">This page doesn't exist.</h1>
        <p className="mt-5 max-w-lg text-lg text-muted">The link may be old or mistyped. Here are a few places to go instead.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/work" variant="ghostDark">
            See the work
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghostDark">
            Contact
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
