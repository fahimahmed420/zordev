"use client";

import { getCalApi } from "@calcom/embed-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Cal = dynamic(() => import("@calcom/embed-react"), { ssr: false });

/** Cal.com embed, loaded only after the visitor asks for it so it doesn't slow the page down. */
export function Booking({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const calLink = url.replace(/^https?:\/\/(app\.)?cal\.com\//, "");

  useEffect(() => {
    if (!open) return;
    window.umami?.track("booking_open");
    (async () => {
      const cal = await getCalApi();
      cal("on", { action: "bookingSuccessfulV2", callback: () => window.umami?.track("call_booked") });
    })();
  }, [open]);

  if (!url) {
    return (
      <p className="rounded-2xl border border-dashed border-line p-6 text-muted">
        <span className="ph">[PLACEHOLDER: Cal.com booking link in NEXT_PUBLIC_BOOKING_URL]</span>
      </p>
    );
  }

  if (!open) {
    return (
      <div className="spot rounded-2xl p-8 text-center">
        <p className="text-lg font-semibold">20-minute discovery call</p>
        <p className="mt-2 text-muted">Free, no obligation. Times show in your own time zone.</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-orange px-7 py-3 font-semibold text-navy hover:bg-[#f68d5f]"
        >
          Pick a time
        </button>
        <p className="mt-4 text-sm">
          <a href={url} target="_blank" rel="noopener" className="text-orange underline underline-offset-4">
            Or open the calendar in a new tab
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[640px] overflow-hidden rounded-2xl border border-line">
      <Cal calLink={calLink} style={{ width: "100%", height: "100%", minHeight: 640 }} config={{ layout: "month_view" }} />
    </div>
  );
}
