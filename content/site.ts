import type { Text } from "@/lib/placeholder";

export const site = {
  name: "Zordev",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zordev.com",
  promise: "Websites, online stores and web apps, built properly and shipped on a fixed scope. Plus fixes for apps built with AI tools.",
  description:
    "Zordev is a web development studio run by Fahim Ahmed. Custom online stores, business websites and web apps for founders and small businesses, plus audits and fixes for apps built with AI tools.",
  owner: {
    name: "Fahim Ahmed",
    role: "Founder and developer",
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
  minProjectSize: 1200,
  commitments: {
    replySla: "within one business day",
    supportDays: 30,
    updateCadence: "a written update and a staging link every week",
    capacity: "one project at a time" as Text,
  },
  foundingYear: "2026",
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export const cta = {
  primary: { label: "Book a call", href: "/contact#book" },
  secondary: { label: "Send a brief", href: "/contact#brief" },
  check: { label: "Get a free 3-risk check", href: "/audit#check" },
  call: { label: "Book a 20-minute call", href: "/contact#book" },
} as const;
