export type Package = {
  id: string;
  name: string;
  fromPrice: number;
  timeline: string;
  suits: string;
  includes: string[];
  highlighted?: boolean;
};

// Recommended prices from the plan. The owner confirms the final numbers.
export const packages: Package[] = [
  {
    id: "launch",
    name: "Launch site",
    fromPrice: 900,
    timeline: "2–3 weeks",
    suits: "New businesses, landing pages and redesigns",
    includes: ["1–5 pages", "Contact form or booking", "On-page SEO and social share images", "Mobile-first, fast and accessible"],
  },
  {
    id: "growth",
    name: "Growth site",
    fromPrice: 2000,
    timeline: "3–5 weeks",
    suits: "Established businesses that publish regularly",
    includes: ["Multi-page site", "CMS so you can edit content", "SEO foundations and analytics", "Case study or product pages"],
  },
  {
    id: "store",
    name: "Custom store",
    fromPrice: 4500,
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
    fromPrice: 3000,
    timeline: "2-week sprints",
    suits: "Founders and internal tools",
    includes: ["Written scope before work starts", "Auth, database and core workflows", "Staging link every week", "Full MVPs usually from $6,000"],
  },
];

export const addOns = [
  { name: "AI chat assistant", detail: "Messenger or WhatsApp, multilingual, with human takeover.", from: 1200, note: "plus running costs at actual price" },
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
  "Under $3,000: 50% to start, 50% before launch.",
  "$3,000 and up: 40% / 30% / 30% by milestone.",
  "Invoiced in USD. Pay by card or bank transfer through Payoneer, or by international wire.",
  "Code, domain and accounts are handed over in full on final payment.",
];

export const carePlan =
  "After launch, an optional monthly care plan covers updates, small fixes, uptime checks and performance. From $99/month.";
