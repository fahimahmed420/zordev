import type { Text } from "@/lib/placeholder";

export const site = {
  name: "Zordev",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zordev.com",
  promise: "I make apps built with AI tools safe for real users.",
  description:
    "I audit and fix apps built with Lovable, Bolt, v0 and Replit, covering database security, login, secrets and payments. Fixed price, code in your name, US-hours calls.",
  owner: {
    name: "Fahim Ahmed",
    role: "Founder and developer",
    // Personal portfolio stays unlinked until it matches the studio.
    portfolio: "https://fahim-cloud.vercel.app/?mode=pro",
  },
  email: "fahim@zordev.com",
  location: "Dhaka, Bangladesh",
  locationDetail: "Savar, Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  timezoneLabel: "GMT+6",
  hours: "Monday to Friday, 10 PM–4 AM GMT+6" as Text,
  // Call slots for the built-in scheduler (Dhaka time, GMT+6, no daylight saving).
  // endHour past 24 means the window runs past midnight (22:00 → 04:00 next day).
  schedule: { days: [1, 2, 3, 4, 5], startHour: 22, endHour: 28, slotMinutes: 30, callMinutes: 20, noticeHours: 12, daysAhead: 14 },
  overlap:
    "Live calls 10 PM–4 AM Dhaka time: the working day across the US, and evenings in the UK and EU. Written updates in between.",
  socials: {
    linkedin: "https://www.linkedin.com/company/zordev/",
    x: "https://x.com/zordevdotcom",
    github: "https://github.com/fahimahmed420",
    // Instagram stays out of the footer until it has posts.
    instagram: null as string | null,
  },
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  currency: "USD",
  minProjectSize: 1500,
  commitments: {
    replySla: "within one business day",
    supportDays: 30,
    updateCadence: "a written update and a staging link every week",
    capacity: "one project at a time" as Text,
  },
  foundingYear: "2026",
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/audit", label: "Audit" },
  { href: "/pricing", label: "Pricing" },
  { href: "/agencies", label: "Agencies" },
  { href: "/about", label: "About" },
] as const;

export const cta = {
  primary: { label: "Book a call", href: "/contact#book" },
  check: { label: "Get a free 3-risk check", href: "/audit#check" },
  call: { label: "Book a 20-minute call", href: "/contact#book" },
  report: { label: "See a sample report", href: "/sample-report" },
} as const;
