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
      { src: "art:aura-goli", alt: "Illustration of the admin revenue chart and a bilingual chat assistant conversation", device: "desktop" },
    ],
    featured: true,
    order: 2,
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
    featured: true,
    order: 3,
  },
];

export const sortedCaseStudies = [...caseStudies].sort((a, b) => a.order - b.order);
export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
