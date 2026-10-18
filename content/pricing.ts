// Prices from "Zordev starter price list" (Oct 2026). Raise only on the rules in that document.

export type Offer = {
  id: "audit" | "sprint" | "launch";
  name: string;
  price: number;
  timeline: string;
  promise: string;
  blurb: string;
  bullets: string[];
  note?: string;
  cta: { label: string; href: string };
  payment: string;
  highlighted?: boolean;
};

export const offers: Offer[] = [
  {
    id: "audit",
    name: "Audit",
    price: 500,
    timeline: "3 business days",
    promise: "Find out exactly what's wrong before you spend more.",
    blurb: "I go through your app with read-only access and write up every risk I find, ranked by how much damage it could do.",
    bullets: ["Login, roles and database rules", "Secrets, API routes and payment webhooks", "Backups, error logging and page speed", "A fixed price to fix all of it"],
    cta: { label: "Book an audit", href: "/audit" },
    payment: "100% upfront",
  },
  {
    id: "sprint",
    name: "Hardening Sprint",
    price: 2500,
    timeline: "2 weeks",
    promise: "Fix what the audit found, and prove it's fixed.",
    blurb: "I close every critical and high-risk finding in your codebase, then retest each one and give you the results in writing.",
    bullets: [
      "Database rules written and tested",
      "Login and permissions corrected",
      "Keys moved out of the browser and rotated",
      "Payment events verified",
      "Error alerts and daily backups switched on",
    ],
    note: "30 days of free fixes on my work.",
    cta: { label: "Start with an audit", href: "/audit" },
    payment: "50% to start, 50% on delivery",
    highlighted: true,
  },
  {
    id: "launch",
    name: "Production Launch",
    price: 4500,
    timeline: "3–4 weeks",
    promise: "For apps about to launch, raise money or take serious payments.",
    blurb: "Everything in the sprint, plus the work that makes the app maintainable by any developer, not just the one who fixed it.",
    bullets: [
      "Code moved to your own GitHub, Vercel and database accounts",
      "Tests on sign-up, login and checkout",
      "Speed work on your 5 key pages",
      "A staging site to test changes safely",
      "2 weeks of launch support",
    ],
    cta: { label: "Talk about your launch", href: "/contact#book" },
    payment: "40% / 30% / 30% by milestone",
  },
];

export const auditCredit = "Every job starts with the audit. Its $500 comes off the sprint or launch price if you book within 30 days.";

export const auditChecks = [
  "Sign-up, login and user roles",
  "Database access rules (Supabase row-level security or equivalent)",
  "Secrets and API keys",
  "Server and API routes",
  "Payment webhooks",
  "Input validation",
  "Known vulnerable packages",
  "Error handling and logging",
  "Backups",
  "A quick speed check on the main pages",
];

export const sprintScope =
  "Fixed price for one app up to about 25 screens, about 20 database tables, one login system and one payment provider. Larger apps get a written quote after the audit.";

export const foundingRate = {
  price: 300,
  slots: 3,
  text: "The first 3 audits are $300 instead of $500, in return for permission to publish the findings anonymously once they're fixed.",
};

export type CarePlan = { id: string; name: string; price: number; includes: string[]; response: string; highlighted?: boolean };

export const carePlans: CarePlan[] = [
  {
    id: "essentials",
    name: "Essentials",
    price: 149,
    includes: ["Monthly security and package updates", "Uptime and error monitoring", "A monthly backup restore test", "1 hour of fixes"],
    response: "Replies within 2 business days",
  },
  {
    id: "app-care",
    name: "App Care",
    price: 299,
    includes: [
      "Everything in Essentials",
      "4 hours of development",
      "A security re-check whenever your database or login changes",
      "A monthly one-page health report",
    ],
    response: "Replies within 1 business day; urgent issues the same day in US hours",
    highlighted: true,
  },
  {
    id: "partner",
    name: "Product Partner",
    price: 1500,
    includes: ["40 hours a month (about 10 a week)", "Weekly security and package updates", "A weekly planning call", "A Friday demo"],
    response: "Same-day replies in US hours",
  },
];

export const careSmallPrint =
  "3-month minimum on Essentials and App Care, then month to month with 30 days' notice. Unused hours don't roll over. Hosting is billed to you directly, in your name.";

export const guarantees = [
  { title: "No serious findings, no fee", text: "If the audit finds no critical or high-risk issues, you don't pay for it." },
  { title: "Scope delivered or refunded", text: "If I don't deliver the scope we signed, you get a refund." },
  { title: "30 days of free fixes", text: "If something I fixed or built breaks within 30 days of handover, I fix it free." },
  { title: "Your code stays private", text: "Your code and data never go into an AI tool that trains on them." },
];

export const paymentTerms = [
  "Audit: 100% upfront.",
  "Hardening Sprint: 50% to start, 50% on delivery.",
  "Production Launch: 40% / 30% / 30% by milestone.",
  "Invoiced in USD through Payoneer: bank transfer (ACH in the US, preferred), card, or international wire.",
  "Code, accounts and documentation are handed over in full on final payment.",
];

export const notIncluded = [
  "Hosting, database and third-party subscriptions (billed to you, in your name)",
  "New features beyond the agreed scope (quoted separately before work starts)",
  "Design, copywriting and marketing",
  "Fixes to code written by someone else after handover",
];

/* ── Other builds ───────────────────────────────────────────────────────── */

export type Build = { id: string; name: string; price: string; timeline: string; suits: string; includes: string[] };

export const builds: Build[] = [
  {
    id: "site",
    name: "Business website",
    price: "from $1,500",
    timeline: "2–5 weeks",
    suits: "Businesses that need a fast site that brings in inquiries",
    includes: ["Up to 5 pages, or more with a CMS", "Contact form or booking", "On-page SEO and social share images", "Mobile-first, fast and accessible"],
  },
  {
    id: "store",
    name: "Custom online store",
    price: "from $5,000",
    timeline: "5–8 weeks",
    suits: "Brands and importers selling online",
    includes: ["Storefront, cart and checkout", "Admin panel for products, orders and stock", "Payment and courier or shipping integrations", "Automatic order emails and invoices"],
  },
  {
    id: "mvp",
    name: "MVP build",
    price: "$3,000 per 2-week sprint",
    timeline: "A typical MVP takes 3–5 sprints",
    suits: "Founders starting a new product properly",
    includes: ["Written scope before each sprint", "Login, database and core workflows", "A working demo every Friday", "Security built in from day one"],
  },
];

export const aiAddOn = {
  name: "AI chat assistant",
  price: "from $1,800",
  detail: "Answers product, delivery and returns questions on Messenger or WhatsApp in your customers' language, with a one-tap handover to you. Plus running costs at actual price.",
};

export const siteCarePlan = "Marketing sites and stores can add a $99/month care plan: updates, small fixes and uptime checks. Apps with logins and payments need App Care or above.";

/* ── Agencies ───────────────────────────────────────────────────────────── */

export const agency = {
  rate: 40,
  blockHours: 20,
  terms: [
    "$40 an hour, sold in 20-hour blocks ($800)",
    "Or a fixed quote per job, at agency rates",
    "Your brand, your client relationship: I sign your NDA and stay invisible",
    "Calls during US working hours, written updates in between",
  ],
};
