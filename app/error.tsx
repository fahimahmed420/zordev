"use client";

import Link from "next/link";
import { site } from "@/content/site";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 py-28 sm:px-6">
        <p className="font-mono text-sm text-orange">Something went wrong</p>
        <h1 className="mt-4 text-5xl leading-tight sm:text-6xl">That didn&apos;t load properly.</h1>
        <p className="mt-5 max-w-lg text-lg text-muted">
          Please try again. If you were sending a message, email{" "}
          <a href={`mailto:${site.email}`} className="text-orange underline underline-offset-4">
            {site.email}
          </a>{" "}
          and I&apos;ll reply {site.commitments.replySla}.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center rounded-full bg-orange px-6 font-medium text-[#0c0c0c] hover:bg-ink">
            Try again
          </button>
          <Link href="/" className="inline-flex min-h-12 items-center rounded-full border border-line-strong px-6 font-medium text-ink hover:border-ink">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
