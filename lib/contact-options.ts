// Client-safe form options and types (no zod, so the validation library stays on the server).
export const needOptions = ["AI-built app to production", "Security audit", "Online store", "Business website", "Web app or MVP", "Not sure yet"] as const;

export const budgetOptions = [
  { value: "audit", label: "$500 audit", qualified: true },
  { value: "1500-3000", label: "$1,500 – $3,000", qualified: true },
  { value: "3000-6000", label: "$3,000 – $6,000", qualified: true },
  { value: "6000-12000", label: "$6,000 – $12,000", qualified: true },
  { value: "12000-plus", label: "$12,000+", qualified: true },
  { value: "not-sure", label: "Not sure", qualified: true },
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
