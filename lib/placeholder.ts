/** Typed placeholder. A production build fails while any of these remain (see scripts/check-placeholders.mjs). */
export type Ph = { __placeholder: true; note: string };

export const ph = (note: string): Ph => ({ __placeholder: true, note });

export const isPh = (v: unknown): v is Ph =>
  typeof v === "object" && v !== null && (v as Ph).__placeholder === true;

export type Text = string | Ph;
