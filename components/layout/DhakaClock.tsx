"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServer = () => 0;

/** Live Dhaka time plus whether calls are open right now (from the scheduler hours). */
export function DhakaClock() {
  const minute = useSyncExternalStore(subscribe, getMinute, getServer);
  if (!minute) return <div className="h-[68px]" />;

  const now = minute * 60_000;
  const { days, startHour, endHour } = site.schedule;
  const dhaka = new Date(now + 6 * 3600_000); // GMT+6, no DST
  const h = dhaka.getUTCHours() + dhaka.getUTCMinutes() / 60;
  const dow = dhaka.getUTCDay();
  const prevDow = (dow + 6) % 7;
  const list = days as readonly number[];
  // Window starts on a working day at startHour and may run past midnight (endHour > 24).
  const open = (list.includes(dow) && h >= startHour && h < Math.min(endHour, 24)) || (endHour > 24 && list.includes(prevDow) && h < endHour - 24);

  let opensIn = "";
  if (!open) {
    for (let d = 0; d < 8; d++) {
      const day = (dow + d) % 7;
      if (!list.includes(day)) continue;
      const hours = d * 24 + startHour - h;
      if (hours > 0) {
        const label = new Intl.DateTimeFormat("en", { weekday: "short", hour: "numeric", timeZone: "Asia/Dhaka" }).format(now + hours * 3600_000);
        opensIn = hours < 1 ? `in ${Math.max(1, Math.round(hours * 60))}m` : hours < 24 ? `in ${Math.round(hours)}h` : label;
        break;
      }
    }
  }

  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka" }).format(now);

  return (
    <div className="flex items-center gap-4">
      <span className="font-display text-5xl leading-none text-ink tabular-nums">{time}</span>
      <span className="text-sm leading-snug">
        <span className="block text-ink">Dhaka · GMT+6</span>
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${open ? "bg-emerald-400" : "bg-orange"}`} />
          </span>
          {open ? "Taking calls now" : `Calls open ${opensIn}`}
        </span>
      </span>
    </div>
  );
}
