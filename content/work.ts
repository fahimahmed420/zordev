import type { Text } from "@/lib/placeholder";

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  label: "client" | "own" | "concept";
  clientPermission: "named" | "anonymised" | "pending" | "n/a";
  client: string;
  industry: string;
  services: string[];
  year: string;
  duration: Text;
  liveUrl?: string;
  stack: string[];
  problem: string;
  approach: string[];
  decisions: { decision: string; why: string }[];
  results: { label: string; value: Text; source: string }[];
  demonstrates: string[];
  gallery: { src: Text; alt: string; device: "desktop" | "mobile" }[];
  testimonial?: { quote: Text; name: Text; role: Text };
  featured: boolean;
  order: number;
};

export const labelText: Record<CaseStudy["label"], string> = {
  client: "Client project",
  own: "Studio product · demo store",
  concept: "Concept · fictional brand",
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "family-fashion-hub-china",
    title: "A store that books its own couriers",
    summary:
      "An import e-commerce store that ships across Bangladesh, with courier booking automated for trusted repeat customers.",
    label: "client",
    clientPermission: "named",
    client: "Family Fashion Hub China",
    industry: "Import retail and wholesale",
    services: ["Custom online store", "Ongoing care"],
    year: "2026",
    duration: "About 4 months",
    // liveUrl is added once the public stats band on ffhchina.com is fixed (plan §3a).
    stack: ["Next.js 16", "React 19", "MongoDB", "Firebase Auth", "Steadfast courier API"],
    problem:
      "Orders arrived from all over the country, mostly cash on delivery. Every order meant copying an address into the courier dashboard and sending an invoice by hand.",
    approach: [
      "Built a storefront with retail and bulk-buy options and a checkout that captures the full Bangladeshi address hierarchy.",
      "Connected the Steadfast courier API so trusted repeat customers are booked automatically; everyone else gets one-click manual booking.",
      "Emailed a PDF invoice automatically with every order and priced shipping by district.",
      "Added a separate admin session, weekly database backups and an automated test suite covering the checkout money path.",
    ],
    decisions: [
      {
        decision: "Automate courier booking only for proven customers",
        why: "Cash-on-delivery fraud is the main risk. Customers with three or more delivered and no cancelled orders are booked automatically; new customers are checked by a person first.",
      },
      {
        decision: "Render the storefront on the server",
        why: "Product pages load and get indexed without waiting for login code, which matters on slower mobile connections.",
      },
    ],
    results: [
      { label: "Products live", value: "74", source: "ffhchina.com, Oct 2026" },
      { label: "Automated test files", value: "14", source: "project repository" },
    ],
    demonstrates: [],
    gallery: [
      { src: "/work/family-fashion-hub-china/desktop.png", alt: "Family Fashion Hub China storefront on desktop", device: "desktop" },
      { src: "/work/family-fashion-hub-china/mobile.png", alt: "Family Fashion Hub China storefront on mobile", device: "mobile" },
    ],
    featured: true,
    order: 1,
  },
  {
    slug: "aura-goli",
    title: "A complete commerce stack, with a bilingual chat assistant",
    summary:
      "A demo fashion store with a full admin console, local payments, and a Bangla/English Messenger and WhatsApp assistant with human takeover.",
    label: "own",
    clientPermission: "n/a",
    client: "Aura Goli (demo store, not a real brand)",
    industry: "Fashion e-commerce",
    services: ["Web app", "Online store", "AI chat assistant"],
    year: "2026",
    duration: "About 7 weeks",
    stack: ["Next.js 16", "TypeScript", "Prisma 7", "PostgreSQL", "Tailwind 4", "Groq · Llama 3.3 70B", "Meta webhooks"],
    problem:
      "Small fashion brands need more than a storefront: an admin they can run alone, local payment methods, and a way to answer customer messages at any hour.",
    approach: [
      "Storefront with filters, live search, coupons, checkout and order tracking without login.",
      "Customer accounts with Google sign-in, wishlist and loyalty points.",
      "Admin console with revenue charts, product variants, an order pipeline, flash sales, review moderation and an audit log.",
      "A chat assistant that answers product, delivery and returns questions in the customer's language, with a one-tap switch to hand the chat to a human.",
    ],
    decisions: [
      {
        decision: "Server-side payment confirmation",
        why: "An order is only marked paid after the payment gateway confirms it on the server, never from the browser redirect alone.",
      },
      {
        decision: "Human takeover built into the bot",
        why: "Automated replies handle common questions, but the owner can take over any conversation instantly.",
      },
    ],
    results: [],
    demonstrates: [
      "A full store and admin console built and deployed by one developer",
      "Local payment methods with server-side confirmation",
      "Bilingual AI customer support with human handover",
    ],
    gallery: [
      { src: "/work/aura-goli/desktop.png", alt: "Aura Goli shop page with category, size, colour and price filters and a product grid", device: "desktop" },
      { src: "/work/aura-goli/mobile.png", alt: "Aura Goli shop page on a phone with category chips and the bottom navigation", device: "mobile" },
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "ember-and-oak",
    title: "A brand story you can play with",
    summary: "A scroll-driven site for a fictional candle brand: interactive, light and accessible.",
    label: "concept",
    clientPermission: "n/a",
    client: "Ember & Oak (fictional brand)",
    industry: "Home goods",
    services: ["Business website"],
    year: "2026",
    duration: "Self-initiated",
    liveUrl: "https://ember-oak-mocha.vercel.app/",
    stack: ["Vite", "JavaScript", "GSAP", "Lenis"],
    problem:
      "Brand sites often look like every other template. This concept explores telling a product story through interaction without making the page heavy.",
    approach: [
      "A flame cursor that lights candles as you move, with tap-to-light on touch screens.",
      "Pinned scroll sections and a smoke trail that follows the page.",
      "Artwork compressed to 8 WebP files and a single small script bundle.",
      "A full reduced-motion fallback and keyboard navigation.",
    ],
    decisions: [
      {
        decision: "Respect reduced motion",
        why: "Visitors who turn off animation get a calm, complete version of the page rather than a broken one.",
      },
    ],
    results: [],
    demonstrates: ["Distinctive brand storytelling", "About 62 KB of JavaScript in total", "Accessible motion design"],
    gallery: [
      { src: "/work/ember-and-oak/desktop.png", alt: "Ember & Oak home page", device: "desktop" },
      { src: "/work/ember-and-oak/mobile.png", alt: "Ember & Oak on mobile", device: "mobile" },
    ],
    featured: false,
    order: 5,
  },
  {
    slug: "lightkeep",
    title: "A SaaS marketing site the team edits themselves",
    summary:
      "A multi-page site for a fictional uptime-monitoring company, with a built-in CMS for the blog, changelog and docs, and product screens built as real components.",
    label: "concept",
    clientPermission: "n/a",
    client: "Lightkeep (fictional brand)",
    industry: "B2B software",
    services: ["Business website", "CMS"],
    year: "2026",
    duration: "Self-initiated",
    stack: ["Next.js 16", "React 19", "Payload CMS 3", "TypeScript", "Tailwind 4", "Resend"],
    problem:
      "Software companies outgrow page builders: the blog, changelog and docs live in three different tools, marketing pages slow down with every plugin, and only a developer can publish safely.",
    approach: [
      "Fifteen pages: home, product and feature pages, pricing with a monthly/annual switch and comparison table, customers, about, contact and legal.",
      "Payload CMS built into the site at /admin, so blog posts, changelog entries and docs are edited in one place with drafts, autosave, scheduled publishing and live preview.",
      "Dashboards, alerts, uptime bars and the status page drawn as real interface components rather than screenshots, so they stay sharp and load fast.",
      "Docs with a searchable sidebar, an RSS feed, a live system-status page and a demo-request form that emails the sales team.",
    ],
    decisions: [
      {
        decision: "Keep the CMS inside the site",
        why: "Content lives in the client's own database and repository. There is no monthly CMS fee, and editors never touch code.",
      },
      {
        decision: "Publish on save, not on rebuild",
        why: "When an editor publishes, only the affected pages refresh, so a new post is live in seconds without a full redeploy.",
      },
    ],
    results: [
      { label: "Pages and templates", value: "15", source: "project repository" },
      { label: "Content types editors manage", value: "3", source: "blog, changelog, docs" },
      { label: "Phone models tested, no layout issues", value: "8", source: "Zordev device audit, Nov 2026" },
    ],
    demonstrates: [
      "A multi-page site with a CMS a non-developer can use",
      "Drafts, live preview and scheduled publishing",
      "Product UI built as code, not images",
    ],
    gallery: [
      { src: "/work/lightkeep/desktop.png", alt: "Lightkeep home page with the headline 'Know it's down before your customers do'", device: "desktop" },
      { src: "/work/lightkeep/mobile.png", alt: "Lightkeep home page on a phone", device: "mobile" },
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "saltbrook",
    title: "A local service site built to turn visits into bookings",
    summary:
      "A site for a fictional heating and air contractor in North Carolina, with a four-step booking form that emails each request and a call button always in reach on phones.",
    label: "concept",
    clientPermission: "n/a",
    client: "Saltbrook Heating & Air (fictional brand)",
    industry: "Home services",
    services: ["Business website"],
    year: "2026",
    duration: "Self-initiated",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind 4", "Zod", "Resend"],
    problem:
      "Most visitors to a contractor's site have a broken air conditioner and a phone in their hand. They want a price they can trust, a time slot and a number to call.",
    approach: [
      "A four-step booking form (what's wrong, when, where, who), checked at every step and emailed to the office.",
      "A sticky call bar on phones and an 'open now' indicator driven by the business hours.",
      "Service, maintenance-plan and service-area pages written for local search, with structured data for the business.",
      "Spam protection on the form: a hidden trap field and a limit on repeat submissions.",
    ],
    decisions: [
      {
        decision: "Booking before browsing",
        why: "The first thing on the home page is 'What can we help with?'. One tap starts a booking with that service already chosen.",
      },
      {
        decision: "Say so plainly when email fails",
        why: "If a request can't be sent, the visitor is asked to call and shown the number, instead of a success message that loses the lead.",
      },
    ],
    results: [
      { label: "Steps to book", value: "4", source: "booking form" },
      { label: "Phone models tested, no layout issues", value: "8", source: "Zordev device audit, Nov 2026" },
    ],
    demonstrates: ["A booking flow that works one-handed on a phone", "Local SEO foundations", "Form email delivery with spam protection"],
    gallery: [
      { src: "/work/saltbrook/desktop.png", alt: "Saltbrook home page with the headline 'Comfort you can count on, every season' and a service picker", device: "desktop" },
      { src: "/work/saltbrook/mobile.png", alt: "Saltbrook home page on a phone", device: "mobile" },
    ],
    featured: false,
    order: 4,
  },
];

export const sortedCaseStudies = [...caseStudies].sort((a, b) => a.order - b.order);
export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
