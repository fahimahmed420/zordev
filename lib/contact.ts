import { z } from "zod";
import { budgetOptions, builtWithOptions, needOptions, stageOptions, timelineOptions } from "./contact-options";

export { budgetLabel, isQualified, type ContactState } from "./contact-options";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  appUrl: z.string().trim().max(300).optional().or(z.literal("")),
  need: z.enum(needOptions, "Please choose what you need."),
  budget: z.enum(budgetOptions.map((b) => b.value) as [string, ...string[]], "Please choose a budget range."),
  timeline: z.enum(timelineOptions, "Please choose a timeline."),
  details: z.string().trim().min(20, "A couple of sentences helps me reply usefully (20+ characters).").max(5000),
  source: z.string().trim().max(200).optional().or(z.literal("")),
  utm: z.string().max(500).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

const appUrl = z
  .string()
  .trim()
  .min(4, "Please enter your app's web address.")
  .max(300)
  .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
  .pipe(z.url({ protocol: /^https?$/, error: "Please enter your app's web address." }));

export const checkSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  appUrl,
  builtWith: z.enum(builtWithOptions, "Please choose what you built it with."),
  stage: z.enum(stageOptions, "Please choose where the app is."),
  worries: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal("on", "Please confirm I can review your app."),
  utm: z.string().max(500).optional().or(z.literal("")),
});
