"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const readQualified = () => {
  try {
    return sessionStorage.getItem("zd_qualified") !== "0";
  } catch {
    return true;
  }
};
const noop = () => () => {};

/** Qualified leads see the booking link; smaller budgets get helpful resources instead. */
export function ThankYouNext({ bookingUrl }: { bookingUrl: string }) {
  const qualified = useSyncExternalStore(noop, readQualified, () => null);

  if (qualified === null) return <div />;

  if (qualified) {
    return (
      <div className="rounded-2xl bg-paper p-7">
        <h2 className="text-2xl font-bold">Want to talk sooner?</h2>
        <p className="mt-3 text-muted">Book a free 20-minute call at a time that suits you.</p>
        {bookingUrl ? (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener"
            data-umami-event="booking_open"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-orange px-6 py-3 font-semibold text-navy"
          >
            Book a call
          </a>
        ) : (
          <Link href="/contact#book" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-orange px-6 py-3 font-semibold text-navy">
            Book a call
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-paper p-7">
      <h2 className="text-2xl font-bold">A note on budget</h2>
      <p className="mt-3 text-muted">
        Most Zordev projects start from $1,500, so I may not be the best fit for this one. I'll still reply with honest suggestions,
        and the pricing page shows what each package includes.
      </p>
      <Link href="/pricing" className="mt-6 inline-flex font-semibold text-orange underline underline-offset-4">
        See pricing →
      </Link>
    </div>
  );
}
