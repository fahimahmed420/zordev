export type FaqItem = { id: string; q: string; a: string; tags: string[] };

export const faq: FaqItem[] = [
  {
    id: "cost",
    q: "How much does a website cost?",
    a: "Business websites start from $900 and custom online stores from $4,500. The pricing page shows what each package includes. After a short call you get a fixed price for an agreed scope.",
    tags: ["home", "pricing"],
  },
  {
    id: "time",
    q: "How long does it take?",
    a: "Most business sites take 2–5 weeks and custom stores 5–8 weeks. The biggest factor is how quickly content and feedback arrive.",
    tags: ["home", "pricing"],
  },
  {
    id: "timezones",
    q: "Do you work with clients in other countries and time zones?",
    a: "Yes. I'm based in Dhaka (GMT+6), and I take calls from 10 PM to 4 AM my time. That is the working day across the US and afternoon to evening in the UK and EU. Weekly written updates keep everything moving between calls.",
    tags: ["home"],
  },
  {
    id: "solo",
    q: "Who will actually build my project?",
    a: "I will. Zordev is a small studio run by Fahim Ahmed. You talk directly to the person writing the code, with no account managers in between.",
    tags: ["home"],
  },
  {
    id: "ownership",
    q: "Who owns the code and domain?",
    a: "You do. Code lives in a repository you own, and the domain, hosting and other accounts are in your name. Everything is handed over in full on final payment.",
    tags: ["home", "pricing"],
  },
  {
    id: "start",
    q: "What do you need from me to start?",
    a: "A short brief, examples you like, your logo and brand files, and someone who can give feedback within a few days. I'll help with the rest.",
    tags: ["home"],
  },
  {
    id: "payments",
    q: "How do payments work?",
    a: "Projects under $3,000 are 50% to start and 50% before launch. Larger projects are paid in three milestones. Invoices are in USD and can be paid by card or bank transfer.",
    tags: ["pricing"],
  },
  {
    id: "changes",
    q: "What if I need changes after launch?",
    a: "Bug fixes for what I built are free for 30 days. New features or changes are quoted upfront, or covered by an optional monthly care plan.",
    tags: ["pricing", "home"],
  },
  {
    id: "maintenance",
    q: "Do you offer maintenance?",
    a: "Yes. An optional monthly care plan covers updates, small fixes, uptime checks and performance, from $99/month.",
    tags: ["pricing"],
  },
  {
    id: "tech",
    q: "Which technology do you use?",
    a: "Mostly Next.js, React and TypeScript, with PostgreSQL or MongoDB for data. I pick tools that are fast, well supported and easy to hand over.",
    tags: ["services:web-apps", "services:websites"],
  },
  {
    id: "redesign",
    q: "Can you redesign my existing site?",
    a: "Yes. I'll review what works today, keep your search rankings in mind, and rebuild it on a faster foundation.",
    tags: ["services:websites"],
  },
  {
    id: "migrate-store",
    q: "Can you move my store off a marketplace or theme?",
    a: "Yes. Products, customers and order history can usually be migrated, and redirects keep existing links working.",
    tags: ["services:ecommerce"],
  },
  {
    id: "payments-store",
    q: "Which payment and shipping providers can you connect?",
    a: "Any provider with a documented API. I have production experience with courier booking automation and local payment gateways.",
    tags: ["services:ecommerce"],
  },
  {
    id: "admin",
    q: "Will I be able to manage the store myself?",
    a: "Yes. Every store comes with an admin panel for products, orders, coupons and stock, plus a short guide.",
    tags: ["services:ecommerce"],
  },
  {
    id: "mvp-scope",
    q: "How do you keep an MVP on budget?",
    a: "We agree a written scope before work starts and build in 2-week sprints. Anything new is quoted and scheduled, not squeezed in.",
    tags: ["services:web-apps"],
  },
  {
    id: "agencies",
    q: "Do you partner with agencies?",
    a: "Yes. I can work as a white-label build partner for design and marketing agencies.",
    tags: ["services:web-apps"],
  },
];

export const faqFor = (tag: string) => faq.filter((f) => f.tags.includes(tag));
