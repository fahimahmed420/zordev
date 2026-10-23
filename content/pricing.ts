export type Package = {
  id: string;
  name: string;
  fromPrice: number;
  timeline: string;
  suits: string;
  includes: string[];
  highlighted?: boolean;
};

// Starter prices for a newer developer (Oct 2026). Raise them once case studies and reviews exist.
export const packages: Package[] = [
  {
    id: "launch",
    name: "Launch site",
    fromPrice: 1200,
    timeline: "2–3 weeks",
    suits: "New businesses, landing pages and redesigns",
    includes: ["1–5 pages", "Contact form or booking", "On-page SEO and social share images", "Mobile-first, fast and accessible"],
  },
  {
    id: "growth",
    name: "Growth site",
    fromPrice: 2200,
    timeline: "3–5 weeks",
    suits: "Established businesses that publish regularly",
    includes: ["Multi-page site", "CMS so you can edit content", "SEO foundations and analytics", "Case study or product pages"],
  },
  {
    id: "store",
    name: "Custom store",
    fromPrice: 4000,
    timeline: "5–8 weeks",
    suits: "Brands and importers selling online",
    includes: [
      "Storefront, cart and checkout",
      "Admin panel",
      "Payment and courier or shipping integrations",
      "Automatic order emails and invoices",
    ],
    highlighted: true,
  },
  {
    id: "mvp",
    name: "MVP sprint",
    fromPrice: 2500,
    timeline: "2-week sprints",
    suits: "Founders and internal tools",
    includes: ["Written scope before work starts", "Auth, database and core workflows", "Staging link every week", "A typical MVP takes 3–5 sprints"],
  },
];

export const addOns = [
  { name: "AI chat assistant", detail: "Messenger or WhatsApp, multilingual, with human takeover.", from: 1500, note: "plus running costs at actual price" },
  { name: "Paid scope sprint", detail: "A written spec, sitemap and fixed quote. Credited against the build if you go ahead.", from: 300, note: "" },
];

export const priceFactors = [
  "Number of pages, templates and custom features",
  "Integrations: payments, couriers, CRMs, AI services",
  "Whether copy, product data and images are ready",
  "Deadline: rush work costs more",
];

export const notIncluded = [
  "Copywriting and photography (I can recommend people)",
  "Paid themes, plugins, licences and third-party subscriptions",
  "Entering large amounts of product or page content",
  "Ongoing ads and marketing",
];

export const paymentTerms = [
  "Audits: 100% upfront.",
  "Under $3,000: 50% to start, 50% on delivery.",
  "$3,000 and up: 40% / 30% / 30% by milestone.",
  "Invoiced in USD through Payoneer: bank transfer (ACH in the US, preferred), card, or international wire.",
  "Code, domain and accounts are handed over in full on final payment.",
];

export const carePlan =
  "After launch, an optional monthly care plan: Site Care from $99/month for websites and stores (updates, small fixes and uptime checks), or App Care from $249/month for apps with logins and payments (security updates, error monitoring, backup tests and small fixes).";

/* ── Fixing AI-built apps (secondary service) ──────────────────────────── */

export type Offer = { id: "audit" | "sprint"; name: string; price: number; timeline: string; promise: string; bullets: string[]; note?: string; payment: string };

export const offers: Offer[] = [
  {
    id: "audit",
    name: "Audit",
    price: 500,
    timeline: "3 business days",
    promise: "Find out exactly what's wrong before you spend more.",
    bullets: ["Login, roles and database rules", "Secrets, API routes and payment webhooks", "Backups, error logging and page speed", "A written report and a fixed price to fix all of it"],
    payment: "100% upfront",
  },
  {
    id: "sprint",
    name: "Hardening Sprint",
    price: 2500,
    timeline: "2 weeks",
    promise: "Fix what the audit found, and prove it's fixed.",
    bullets: [
      "Database rules written and tested",
      "Login and permissions corrected",
      "Keys moved out of the browser and rotated",
      "Payment events verified",
      "Error alerts and daily backups switched on",
    ],
    note: "The $500 audit comes off the sprint price if you book within 30 days.",
    payment: "50% to start, 50% on delivery",
  },
];

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

export const guarantees = [
  { title: "Scope delivered or refunded", text: "If I don't deliver the scope we signed, you get a refund." },
  { title: "30 days of free fixes", text: "If something I built or fixed breaks within 30 days of handover, I fix it free." },
  { title: "No serious findings, no audit fee", text: "If an audit finds no critical or high-risk issues, you don't pay for it." },
  { title: "Your code stays private", text: "Your code and data never go into an AI tool that trains on them." },
];
