// Client-safe form options and types (no zod, so the validation library stays on the server).
export const needOptions = ["Online store", "Business website", "Web app or MVP", "Redesign", "Not sure yet"] as const;

export const budgetOptions = [
  { value: "under-900", label: "Under $900", qualified: false },
  { value: "900-1500", label: "$900 – $1,500", qualified: true },
  { value: "1500-3000", label: "$1,500 – $3,000", qualified: true },
  { value: "3000-6000", label: "$3,000 – $6,000", qualified: true },
  { value: "6000-plus", label: "$6,000+", qualified: true },
  { value: "not-sure", label: "Not sure yet", qualified: true },
] as const;

export const timelineOptions = ["As soon as possible", "Within 1 month", "1–3 months", "Just exploring"] as const;

export type ContactField = "name" | "email" | "company" | "need" | "budget" | "timeline" | "details" | "source" | "utm";

export type ContactState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<string, string>>;
  qualified?: boolean;
};

export const isQualified = (budget: string) => budgetOptions.find((b) => b.value === budget)?.qualified ?? true;
export const budgetLabel = (budget: string) => budgetOptions.find((b) => b.value === budget)?.label ?? budget;
