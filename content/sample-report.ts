import { isPh, ph, type Text } from "@/lib/placeholder";

// Report fields still to fill. They do not block the build: until all are filled, the site shows
// "sample report coming soon" instead of the findings (see reportReady below).
const todo = ph;

// The sample audit of Zordev's own test app. Fill every ph() from the real audit before launch.
// Rule: always label this as a studio test built by Zordev. Never imply it's a client.

export type Severity = "Critical" | "High" | "Medium" | "Low";

export type Finding = {
  severity: Severity;
  title: Text;
  meaning: Text;
  evidence: Text;
  fix: Text;
};

export const sampleReport = {
  label: "Studio test · built and audited by Zordev",
  appName: todo("Test app name, e.g. 'Slotly, a small booking app'"),
  builtWith: "Lovable",
  stack: todo("Stack of the test app, e.g. 'React, Supabase, Stripe (test mode)'"),
  buildTime: todo("How long the build took, e.g. 'about 4 hours, prompts only'"),
  summary: todo("Finding totals, e.g. '2 critical, 3 high, 4 medium'"),
  fixedIn: todo("How long the fixes took, e.g. '3 days'"),
  intro:
    "I built a small app in Lovable in one afternoon, with login, a database and a test checkout. Then I audited it the same way I audit client apps. This is the real report, unedited.",
  findings: [
    {
      severity: "Critical",
      title: todo("Critical finding, e.g. 'Orders table readable by any signed-in user'"),
      meaning: todo("Plain-words impact, e.g. 'Anyone with an account can see every customer's orders'"),
      evidence: todo("How it was found, e.g. 'Signed in as user B, queried orders, got all 37 rows'"),
      fix: todo("The fix, e.g. 'Row-level security on orders, tested with two accounts'"),
    },
    {
      severity: "High",
      title: todo("High finding, e.g. 'Payment webhook accepts unsigned requests'"),
      meaning: todo("Plain-words impact, e.g. 'Someone could mark an order paid without paying'"),
      evidence: todo("Evidence for the high finding"),
      fix: todo("The fix, e.g. 'Stripe signature check and duplicate-event guard'"),
    },
    {
      severity: "Medium",
      title: todo("Medium finding, e.g. 'Service key present in front-end code'"),
      meaning: todo("Plain-words impact, e.g. 'A key with full access ships to every visitor's browser'"),
      evidence: todo("Evidence for the medium finding"),
      fix: todo("The fix, e.g. 'Key moved to the server and rotated'"),
    },
  ] as Finding[],
  changed: [
    todo("Findings closed, e.g. 'Findings closed: 9 of 9, verified in the retest'"),
    todo("A before → after number, e.g. 'Mobile load time: 6.8s → 2.1s'"),
    todo("A before → after number, e.g. 'Automated tests on sign-up and checkout: 0 → 12'"),
  ] as Text[],
  pdfUrl: "" as string,
};

export const severityTone: Record<Severity, string> = {
  Critical: "bg-[#ef4444]/15 text-[#fca5a5] ring-[#ef4444]/40",
  High: "bg-orange/15 text-orange ring-orange/40",
  Medium: "bg-[#eab308]/15 text-[#fde047] ring-[#eab308]/40",
  Low: "bg-white/10 text-muted ring-line-strong",
};

/** True once every todo() above has been replaced with the real audit results. */
export const reportReady = !JSON.stringify(sampleReport).includes("__placeholder") && !sampleReport.findings.some((f) => isPh(f.title));
