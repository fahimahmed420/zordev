export type FaqItem = { id: string; q: string; a: string; tags: string[] };

export const faq: FaqItem[] = [
  {
    id: "cost",
    q: "How much does a website cost?",
    a: "Business websites start from $1,200, custom online stores from $4,000, and web apps are built in 2-week sprints from $2,500. The pricing page shows what each package includes. After a short call you get a fixed price for an agreed scope.",
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
    a: "Yes. I'm based in Dhaka (GMT+6), and I take calls from 10 PM to 4 AM my time. That covers the working day across the US, and evenings in the UK and EU. Weekly written updates keep everything moving between calls.",
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
    a: "Audits are paid upfront. Projects under $3,000 are 50% to start and 50% on delivery, and larger projects are paid in three milestones (40% / 30% / 30%). Invoices are in USD through Payoneer: bank transfer (ACH in the US), card or international wire.",
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
    a: "Yes. Site Care for websites and stores is from $99/month, and App Care for apps with logins and payments is from $249/month.",
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
    id: "edit-site",
    q: "Will I be able to update the site myself?",
    a: "Yes. Growth sites come with a CMS so you can edit pages, posts and images without touching code, and every site comes with a short editing guide. For Launch sites I can make small text changes for you, or add a CMS later.",
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
  {
    id: "guarantee",
    q: "What if you don't deliver what we agreed?",
    a: "You get a refund. Every project has a signed scope, and if I don't deliver it, you don't pay for it. Anything I build or fix also gets 30 days of free bug fixes after handover.",
    tags: ["home", "pricing"],
  },
  {
    id: "ai-privacy",
    q: "Do you use AI tools? Does my code go into them?",
    a: "I use Claude, Claude Code and ChatGPT to move faster on routine code, and I read, test and understand every change before it reaches your project. Your code and data never go into a tool that trains on them.",
    tags: ["home", "pricing", "services:fix-ai-apps"],
  },
  {
    id: "fix-what",
    q: "My app was built with Lovable, Bolt, v0 or Replit. Can you fix it?",
    a: "Yes. Most of these tools produce React code, often with Supabase behind it. A $500 audit checks login, database rules, secrets, payments, backups and speed, with read-only access. You get a written report and a fixed price to fix everything. A hardening sprint is $2,500, and the audit fee comes off it if you book within 30 days.",
    tags: ["home", "services:fix-ai-apps"],
  },
  {
    id: "fix-free",
    q: "What if the audit finds nothing serious?",
    a: "Then the report says so, and you don't pay for it: if the audit finds no critical or high-risk issues, it's free. Not sure yet? Ask for a free 3-risk check first.",
    tags: ["services:fix-ai-apps"],
  },
  {
    id: "fix-readonly",
    q: "Will you change anything in my app during the audit?",
    a: "No. The free check and the audit both use read-only access. Nothing changes until you approve a fix and its price.",
    tags: ["services:fix-ai-apps"],
  },
];

export const faqFor = (tag: string) => faq.filter((f) => f.tags.includes(tag));
