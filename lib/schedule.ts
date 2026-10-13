import { site } from "@/content/site";

const OFFSET_H = 6; // Dhaka is UTC+6 all year

export type Day = { key: string; slots: number[] }; // slots are UTC timestamps (ms)

/** Bookable call slots for the next N days, based on the owner's Dhaka working hours. Shared by client and server. */
export function availableDays(now: number): Day[] {
  const { days, startHour, endHour, slotMinutes, callMinutes, noticeHours, daysAhead } = site.schedule;
  const earliest = now + noticeHours * 3600_000;
  const dhakaNow = new Date(now + OFFSET_H * 3600_000);
  const out: Day[] = [];
  for (let d = 0; d <= daysAhead; d++) {
    const y = dhakaNow.getUTCFullYear();
    const m = dhakaNow.getUTCMonth();
    const date = dhakaNow.getUTCDate() + d;
    const dow = new Date(Date.UTC(y, m, date)).getUTCDay();
    if (!(days as readonly number[]).includes(dow)) continue;
    const slots: number[] = [];
    for (let min = startHour * 60; min + callMinutes <= endHour * 60; min += slotMinutes) {
      const t = Date.UTC(y, m, date, 0, min) - OFFSET_H * 3600_000;
      if (t >= earliest) slots.push(t);
    }
    if (slots.length) out.push({ key: new Date(Date.UTC(y, m, date)).toISOString().slice(0, 10), slots });
  }
  return out;
}

export const isBookable = (t: number, now: number) => availableDays(now).some((d) => d.slots.includes(t));

/** Minimal iCalendar file for a *requested* call: published as tentative until the owner confirms. */
export function icsFor(start: number, attendee: string, now: number) {
  const end = start + site.schedule.callMinutes * 60_000;
  const f = (t: number) => new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Zordev//Discovery call//EN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${start}-${attendee.replace(/[^a-z0-9]/gi, "")}@zordev.com`,
    `DTSTAMP:${f(now)}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    "STATUS:TENTATIVE",
    "SUMMARY:Zordev discovery call (requested, awaiting confirmation)",
    `DESCRIPTION:20-minute call with ${site.owner.name}. A meeting link is sent with the confirmation.`,
    `ORGANIZER;CN=${site.owner.name}:mailto:${site.email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
