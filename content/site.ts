import { ph, type Text } from "@/lib/placeholder";

export const site = {
  name: "Zordev",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zordev.com",
  promise: "Websites, online stores and web apps, built properly and shipped on a fixed scope.",
  description:
    "Zordev is a web development studio run by Fahim Ahmed. Custom online stores, business websites and web apps for founders and small businesses.",
  owner: {
    name: "Fahim Ahmed",
    role: "Founder and developer",
    photo: ph("owner photo, square, at public/fahim.jpg") as Text,
    portfolio: "https://fahim-cloud.vercel.app/?mode=pro",
  },
  email: "hello@zordev.com",
  location: "Dhaka, Bangladesh",
  locationDetail: "Savar, Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  timezoneLabel: "GMT+6",
  hours: "Sunday to Thursday, 10:00–19:00 GMT+6" as Text,
  overlap:
    "Live calls in your morning for the UK, EU and Gulf, and early-morning slots for the US East Coast. Written updates in between.",
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
    capacity: ph("number of projects taken on at a time, e.g. 2") as Text,
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
} as const;
