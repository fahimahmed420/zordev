// Client-safe form options and types (no zod, so the validation library stays on the server).
export const needOptions = ["Online store", "Business website", "Web app or MVP", "Fix an AI-built app", "Redesign", "Not sure yet"] as const;

export const budgetOptions = [
  { value: "under-1200", label: "Under $1,200", qualified: false },
  { value: "1200-2500", label: "$1,200 – $2,500", qualified: true },
  { value: "2500-5000", label: "$2,500 – $5,000", qualified: true },
  { value: "5000-10000", label: "$5,000 – $10,000", qualified: true },
  { value: "10000-plus", label: "$10,000+", qualified: true },
  { value: "not-sure", label: "Not sure yet", qualified: true },
] as const;

export const timelineOptions = ["As soon as possible", "Within 1 month", "1–3 months", "Just exploring"] as const;

/* ── Free 3-risk check ─────────────────────────────────────────────────── */

export const builtWithOptions = ["Lovable", "Bolt", "v0", "Replit", "Cursor", "Other"] as const;
export const stageOptions = ["Live with users", "Launching within 60 days", "Still building"] as const;

export type CheckField = "name" | "email" | "appUrl" | "builtWith" | "stage" | "worries" | "consent";

export type CheckState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<CheckField, string>>;
  values?: Partial<Record<string, string>>;
  stage?: string;
};

export type ContactField = "name" | "email" | "company" | "appUrl" | "need" | "budget" | "timeline" | "details" | "source" | "utm";

export type ContactState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<string, string>>;
  qualified?: boolean;
};

export const isQualified = (budget: string) => budgetOptions.find((b) => b.value === budget)?.qualified ?? true;
export const budgetLabel = (budget: string) => budgetOptions.find((b) => b.value === budget)?.label ?? budget;
