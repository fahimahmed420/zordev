import { z } from "zod";

export const needOptions = ["Online store", "Business website", "Web app or MVP", "Redesign", "Not sure yet"] as const;

export const budgetOptions = [
  { value: "under-1500", label: "Under $1,500", qualified: false },
  { value: "1500-3000", label: "$1,500 – $3,000", qualified: true },
  { value: "3000-6000", label: "$3,000 – $6,000", qualified: true },
  { value: "6000-plus", label: "$6,000+", qualified: true },
  { value: "not-sure", label: "Not sure yet", qualified: true },
] as const;

export const timelineOptions = ["As soon as possible", "Within 1 month", "1–3 months", "Just exploring"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  need: z.enum(needOptions, "Please choose what you need."),
  budget: z.enum(budgetOptions.map((b) => b.value) as [string, ...string[]], "Please choose a budget range."),
  timeline: z.enum(timelineOptions, "Please choose a timeline."),
  details: z.string().trim().min(20, "A couple of sentences helps me reply usefully (20+ characters).").max(5000),
  source: z.string().trim().max(200).optional().or(z.literal("")),
  utm: z.string().max(500).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
  values?: Partial<Record<string, string>>;
  qualified?: boolean;
};

export const isQualified = (budget: string) => budgetOptions.find((b) => b.value === budget)?.qualified ?? true;
export const budgetLabel = (budget: string) => budgetOptions.find((b) => b.value === budget)?.label ?? budget;
