export type Service = {
  slug: string;
  title: string;
  short: string;
  forWho: string;
  problem: string;
  included: string[];
  deliverables: string[];
  timeline: string;
  fromPrice: number;
  stack: string[];
  relatedCaseStudy: string;
  faqTag: string;
};

export const services: Service[] = [
  {
    slug: "ecommerce",
    title: "Custom online stores",
    short: "Next.js stores with an admin panel, payments and shipping that runs itself.",
    forWho: "Brands, importers and sellers who have outgrown marketplace pages or social-only selling.",
    problem:
      "Off-the-shelf themes slow down as the catalog grows, and every order still needs manual work: copying addresses, booking couriers, sending invoices.",
    included: [
      "Storefront with search, filters, cart and checkout",
      "Admin panel for products, orders, coupons and stock",
      "Payment and courier or shipping integrations",
      "Automatic order emails and invoices",
      "SEO foundations and analytics",
    ],
    deliverables: ["Live store on your domain", "Source code in your GitHub", "Admin guide", "30 days of bug fixes"],
    timeline: "5–8 weeks",
    fromPrice: 4500,
    stack: ["Next.js", "TypeScript", "PostgreSQL or MongoDB", "Your payment and courier APIs"],
    relatedCaseStudy: "family-fashion-hub-china",
    faqTag: "services:ecommerce",
  },
  {
    slug: "websites",
    title: "Business websites",
    short: "Fast marketing sites, landing pages and redesigns that turn visitors into inquiries.",
    forWho: "Small and mid-size businesses that need a site that brings in customers, not just a brochure.",
    problem:
      "Slow, dated sites lose visitors on mobile and make it hard to understand what you do or how to get in touch.",
    included: [
      "Up to 5 pages (Launch) or a multi-page site with a CMS (Growth)",
      "Copy structure and page layout",
      "Contact form or booking",
      "On-page SEO, sitemap and social share images",
      "Performance and accessibility checks",
    ],
    deliverables: ["Live site on your domain", "Source code and accounts in your name", "Short editing guide"],
    timeline: "2–5 weeks",
    fromPrice: 900,
    stack: ["Next.js", "Tailwind CSS", "MDX or a headless CMS"],
    relatedCaseStudy: "ember-and-oak",
    faqTag: "services:websites",
  },
  {
    slug: "web-apps",
    title: "Web apps & MVPs",
    short: "Dashboards, SaaS MVPs and internal tools, built on a fixed scope.",
    forWho: "Founders validating an idea and teams replacing spreadsheets with a proper tool.",
    problem:
      "Large agencies quote months and big budgets; freelancers disappear halfway. You need a working product in front of users quickly.",
    included: [
      "Scope workshop and a written spec",
      "Authentication, roles and a database",
      "Core workflows and an admin view",
      "Third-party integrations (email, payments, AI)",
      "Deployment, monitoring and handover",
    ],
    deliverables: ["Working app on staging and production", "Source code and docs", "Handover call"],
    timeline: "2-week sprints",
    fromPrice: 3000,
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    relatedCaseStudy: "aura-goli",
    faqTag: "services:web-apps",
  },
];
