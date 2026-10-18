export type FaqItem = { id: string; q: string; a: string; tags: string[] };

export const faq: FaqItem[] = [
  {
    id: "audit-checks",
    q: "What do you check in an audit?",
    a: "Login and user roles, database access rules, secrets and API keys, server routes, payment webhooks, input validation, known vulnerable packages, error logging, backups and page speed. You get a written report with every finding ranked, plus a fixed price to fix them.",
    tags: ["home", "audit"],
  },
  {
    id: "builders",
    q: "My app was built with Lovable, Bolt, v0, Replit or Cursor. Can you work with it?",
    a: "Yes. Most of these tools produce React code, often with Supabase or a similar database behind it. That's the stack I work in every day. If yours is different, I'll tell you on the first call.",
    tags: ["home", "audit"],
  },
  {
    id: "read-only",
    q: "Will you change anything in my app during the check or audit?",
    a: "No. Both use read-only access. Nothing changes until you approve a fix and its price.",
    tags: ["home", "audit"],
  },
  {
    id: "keep-builder",
    q: "Do I have to stop using the AI builder?",
    a: "Not necessarily. The audit tells you whether to keep building there or move to a normal codebase, and what to avoid touching if you stay.",
    tags: ["home", "audit"],
  },
  {
    id: "cost",
    q: "How much does it cost?",
    a: "The audit is $500, credited in full if you book fixes within 30 days. A hardening sprint is $2,500 and a production launch is $4,500, for apps within the scope on the pricing page. Larger apps get a fixed quote after the audit.",
    tags: ["home", "pricing"],
  },
  {
    id: "ownership",
    q: "Who owns the code?",
    a: "You do. The code lives in your GitHub, and the hosting and database accounts are in your name. I hand everything over in full.",
    tags: ["home", "pricing", "builds"],
  },
  {
    id: "timezones",
    q: "You're in Dhaka. How does the time difference work?",
    a: "I take calls from 10 PM to 4 AM Dhaka time. That's the working day across the US and the evening in the UK and EU. Between calls you get written updates, and a working demo every Friday.",
    tags: ["home", "agencies", "builds"],
  },
  {
    id: "payment",
    q: "How do I pay?",
    a: "In USD by invoice through Payoneer: bank transfer (ACH in the US), card or international wire. Audits are paid upfront. Sprints are 50% to start and 50% on delivery. Launches are paid in three milestones.",
    tags: ["home", "pricing"],
  },
  {
    id: "nothing-found",
    q: "What if the audit finds nothing serious?",
    a: "Then the report says so, and you don't pay for it: if the audit finds no critical or high-risk issues, the audit is free.",
    tags: ["home", "pricing", "audit"],
  },
  {
    id: "agencies",
    q: "Do you work with agencies?",
    a: "Yes, under your brand and NDA, at $40 an hour in 20-hour blocks or a fixed price per job. The agencies page has the details.",
    tags: ["home", "agencies"],
  },
  {
    id: "refund",
    q: "What if you don't deliver what we agreed?",
    a: "You get a refund. Every job has a signed scope, and if I don't deliver it, you don't pay for it. Anything I fixed or built also gets 30 days of free fixes after handover.",
    tags: ["pricing", "builds"],
  },
  {
    id: "ai-privacy",
    q: "Does my code go into AI tools?",
    a: "I use Claude and ChatGPT to move faster on routine work, but your code and data never go into a tool that trains on them. Every change that reaches your app is read, tested and understood by me.",
    tags: ["pricing", "audit"],
  },
  {
    id: "start",
    q: "How soon can you start?",
    a: "Work starts within 5 business days of your approval of the written scope. I take one sprint or launch at a time, so if I'm booked, I'll give you a date.",
    tags: ["pricing", "builds"],
  },
  {
    id: "agency-nda",
    q: "Will your name appear anywhere?",
    a: "No, unless you want it to. I work under your brand, in your repositories and tools, and I never contact your client directly unless you ask me to.",
    tags: ["agencies"],
  },
  {
    id: "agency-scope",
    q: "What kind of work do agencies send you?",
    a: "Next.js builds, fixing apps a client built with AI tools, security reviews before launch, and overflow work when your own developers are full.",
    tags: ["agencies"],
  },
  {
    id: "build-cost",
    q: "How much does a new site, store or MVP cost?",
    a: "Business websites start from $1,500 and custom online stores from $5,000. An MVP is $3,000 per 2-week sprint, and a typical MVP takes 3 to 5 sprints. You get a fixed price for an agreed scope before anything starts.",
    tags: ["builds"],
  },
];

export const faqFor = (tag: string) => faq.filter((f) => f.tags.includes(tag));
