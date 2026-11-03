"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

/*
 * A tiny live-coding engine that works through real problems, one after another.
 * The editor holds a real text buffer that a script edits (type, delete, cut, pause).
 * The preview is never scripted: it is derived from the buffer on every keystroke,
 * so the code on the left and what the client sees on the right cannot drift apart.
 */

/* ── Script ops ─────────────────────────────────────────────────────────── */

type Op =
  | { k: "type"; s: string; fast?: boolean }
  | { k: "del"; n: number }
  | { k: "cut"; n: number } // select a block and delete it in one go
  | { k: "pause"; ms: number }
  | { k: "end" };

const T = (s: string, fast?: boolean): Op => ({ k: "type", s, fast });
const P = (ms: number): Op => ({ k: "pause", ms });
const D = (n: number): Op => ({ k: "del", n });
const X = (n: number): Op => ({ k: "cut", n });
const END: Op = { k: "end" };

/* ── Scenarios ──────────────────────────────────────────────────────────── */

type Milestone = { re: RegExp; status: string };
type PreviewProps = { step: number; done: boolean };
type Scenario = {
  id: string;
  kind: string;
  chip: string;
  title: string;
  file: string;
  lang: "sql" | "ts";
  tool: string;
  url: string;
  summary: string;
  initialStatus: string;
  script: Op[];
  /** In order. The step reached is how many match from the start without a gap. */
  milestones: Milestone[];
  badge: (step: number) => { label: string; ok: boolean };
  Preview: (p: PreviewProps) => ReactNode;
};

const ME = "maya@acme.co";

const SLOW_CODE =
  "  const products = await db.product.findMany();\n" +
  "  for (const p of products) {\n" +
  "    p.reviews = await db.review.findMany({\n" +
  "      where: { productId: p.id } }); // 240 more queries\n" +
  "  }\n";

const SCENARIOS: Scenario[] = [
  {
    id: "rls",
    kind: "Security",
    chip: "Data leak",
    title: "Any signed-in user can read every customer's orders",
    file: "0007_orders_rls.sql",
    lang: "sql",
    tool: "⚡ supabase",
    url: "yourapp.com/account/orders",
    summary:
      "A database rule is added so a signed-in user can only see their own orders. Before the fix, the orders page shows every customer's orders. After it, only the user's own.",
    initialStatus: "reading audit finding",
    script: [
      T("-- migrations/0007_orders_rls.sql\n", true),
      T("-- Audit finding #1 · CRITICAL\n", true),
      T("-- any signed-in user can read every order\n\n", true),
      P(900),
      T("alter table orders\n"),
      T("  enable row level security;\n\n"),
      P(1100),
      T('create policy "own orders only"\n'),
      T("  on orders for select\n"),
      T("  using (auth.uid() = user_di"),
      P(420),
      D(2),
      T("id);\n"),
      P(900),
      T("\n-- retest: signed in as maya → 2 rows ✓", true),
      P(300),
      END,
    ],
    milestones: [
      { re: /enable row level security;/, status: "RLS on · no policy yet → 0 rows" },
      { re: /create policy/, status: "writing policy…" },
      { re: /using \(auth\.uid\(\) = user_id\);/, status: "policy applied → own rows only" },
    ],
    badge: (step) => (step >= 3 ? { label: "● secured", ok: true } : { label: "● exposed", ok: false }),
    Preview: OrdersPreview,
  },
  {
    id: "secret",
    kind: "Security",
    chip: "Exposed key",
    title: "The Stripe secret key ships to every visitor in the browser bundle",
    file: "checkout/actions.ts",
    lang: "ts",
    tool: "▲ next.js",
    url: "devtools · sources · main-7f3a.js",
    summary:
      "A payment key that was readable in the browser is moved into a server action. Before the fix, a bundle scan finds the secret key. After it, the browser only receives a redirect URL and the key is rotated.",
    initialStatus: "scanning the client bundle",
    script: [
      T("// app/checkout/actions.ts\n", true),
      T("// Audit finding #2 · CRITICAL\n", true),
      T("// the Stripe secret key is read in the browser\n", true),
      T("// and shipped to every visitor in main-7f3a.js\n\n", true),
      P(1000),
      T('"use server";\n\n'),
      P(500),
      T('import Stripe from "stripe";\n'),
      T("const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);\n\n"),
      P(600),
      T("export async function createCheckout(cartId: string) {\n"),
      T("  const cart = await getCart(cartId);\n"),
      T("  const session = await stripe.checkout.sessions.create({\n"),
      T('    line_items: cart.lines, mode: "payment",\n'),
      T("    success_url: `${env.SITE_URL}/thank-you`,\n"),
      T("  });\n"),
      T("  return { url: session.url }; // the browser only gets a URL\n"),
      T("}\n"),
      P(700),
      T("\n// retest: bundle scan → 0 secrets · key rotated ✓", true),
      P(300),
      END,
    ],
    milestones: [
      { re: /"use server";/, status: "server action · this file never reaches the browser" },
      { re: /sessions\.create\(/, status: "checkout session created on the server" },
      { re: /return \{ url: session\.url \};/, status: "the browser receives a URL, never the key" },
    ],
    badge: (step) => (step >= 3 ? { label: "● 0 secrets", ok: true } : { label: "● key in bundle", ok: false }),
    Preview: BundlePreview,
  },
  {
    id: "webhook",
    kind: "Payments",
    chip: "Fake payment",
    title: "Any request to the webhook URL marks an order as paid",
    file: "api/stripe/webhook/route.ts",
    lang: "ts",
    tool: "⚡ stripe",
    url: "yourapp.com/admin/payments",
    summary:
      "The payment webhook starts checking Stripe's signature and applying each event once. Before the fix, forged requests mark orders paid and retries apply twice. After it, forged requests are rejected and each event counts once.",
    initialStatus: "reading the request handler",
    script: [
      T("// app/api/stripe/webhook/route.ts\n", true),
      T("// Audit finding #3 · CRITICAL\n", true),
      T("// any POST to this URL marks an order as paid\n\n", true),
      P(1000),
      T("export async function POST(req: Request) {\n"),
      T('  const sig = req.headers.get("stripe-signature");\n'),
      T("  const event = stripe.webhooks.constructEvent(\n"),
      T("    await req.text(), sig!, env.STRIPE_WEBHOOK_SECRET);\n\n"),
      P(900),
      T('  if (event.type !== "checkout.session.completed")\n'),
      T('    return new Response("ignored");\n\n'),
      T("  await markPaid(event.data.object.id, {\n"),
      T("    eventId: event.id, // applied once, even if Stripe retries\n"),
      T("  });\n"),
      T('  return new Response("ok");\n'),
      T("}\n"),
      P(700),
      T("\n// retest: forged POST → 400 · real event → paid once ✓", true),
      P(300),
      END,
    ],
    milestones: [
      { re: /env\.STRIPE_WEBHOOK_SECRET\);/, status: "signature required · forged requests get 400" },
      { re: /eventId: event\.id,/, status: "idempotent · each event applied once" },
    ],
    badge: (step) => (step >= 1 ? { label: "● verified", ok: true } : { label: "● forgeable", ok: false }),
    Preview: PaymentsPreview,
  },
  {
    id: "speed",
    kind: "Speed",
    chip: "Slow page",
    title: "The catalog page makes 241 database queries and takes 4.2 s on a phone",
    file: "products/page.tsx",
    lang: "ts",
    tool: "◆ prisma",
    url: "yourapp.com/products · performance",
    summary:
      "A product page that ran one database query per product is rewritten to use a single query with a join, then cached. Before the fix: 241 queries and 4.2 seconds. After it: one query, 0.3 seconds, and repeat visits served from cache.",
    initialStatus: "profiling the page",
    script: [
      T("// app/(store)/products/page.tsx\n", true),
      T("// Audit finding #4 · HIGH\n", true),
      T("// 241 database queries per page view · 4.2 s on 4G\n\n", true),
      T("export default async function Products() {\n", true),
      T(SLOW_CODE, true),
      P(1600),
      X(SLOW_CODE.length),
      P(400),
      T("  const products = await db.product.findMany({\n"),
      T("    include: { reviews: { select: { rating: true } } },\n"),
      T("  }); // one query, with a join\n"),
      P(500),
      T("  return <Grid items={products} />;\n"),
      T("}\n\n"),
      P(600),
      T("export const revalidate = 60; // cached, refreshed each minute\n"),
      P(700),
      T("\n// retest: 241 → 1 query · 4.2 s → 0.3 s ✓", true),
      P(300),
      END,
    ],
    milestones: [
      { re: /\}\); \/\/ one query/, status: "1 query with a join · 180 ms" },
      { re: /export const revalidate = 60;/, status: "cached · repeat visits in 12 ms" },
    ],
    badge: (step) => (step >= 2 ? { label: "● cached", ok: true } : step === 1 ? { label: "● 1 query", ok: true } : { label: "● 241 queries", ok: false }),
    Preview: SpeedPreview,
  },
  {
    id: "dispatch",
    kind: "Feature",
    chip: "Manual work",
    title: "Staff copy every paid order into the courier's website by hand",
    file: "orders/dispatch.ts",
    lang: "ts",
    tool: "⚡ steadfast",
    url: "yourapp.com/admin/dispatch",
    summary:
      "An automation is written so paid orders from trusted repeat customers book their own courier and email an invoice, while new customers are held for a person to check. Before: five orders waiting for manual booking. After: three booked automatically, two held.",
    initialStatus: "reading the feature request",
    script: [
      T("// lib/orders/dispatch.ts\n", true),
      T("// Feature · every paid order books its own courier\n", true),
      T("// today: staff copy each address into the courier site\n\n", true),
      P(1000),
      T("export async function onOrderPaid(order: Order) {\n"),
      T("  const c = await customerStats(order.customerId);\n"),
      T("  const trusted = c.delivered >= 3 && c.cancelled === 0;\n"),
      P(700),
      T("  if (!trusted) return holdForReview(order); // a person checks\n\n"),
      P(500),
      T("  const booking = await steadfast.createOrder({\n"),
      T("    recipient: order.address, cod: order.total,\n"),
      T("  });\n"),
      T('  await order.update({ status: "booked", tracking: booking.id });\n'),
      P(600),
      T("  await emailInvoice(order); // PDF attached\n"),
      T("}\n"),
      P(700),
      T("\n// retest: 5 orders → 3 booked, 2 held · 0 copy-paste ✓", true),
      P(300),
      END,
    ],
    milestones: [
      { re: /const trusted = c\.delivered >= 3 && c\.cancelled === 0;/, status: "trust rule · 3+ delivered, 0 cancelled" },
      { re: /tracking: booking\.id \}\);/, status: "trusted orders booked · tracking saved" },
      { re: /emailInvoice\(order\);/, status: "invoice PDF emailed to each customer" },
    ],
    badge: (step) => (step >= 2 ? { label: "● automated", ok: true } : step === 1 ? { label: "● rule set", ok: false } : { label: "● manual", ok: false }),
    Preview: DispatchPreview,
  },
];

const HOLD = 3800; // how long the finished state stays before the next problem

/* ── Compiler: buffer → how far the fix has got ─────────────────────────── */

type View = { step: number; done: boolean };

function compile(code: string, sc: Scenario): View {
  let step = 0;
  for (const m of sc.milestones) {
    if (m.re.test(code)) step++;
    else break;
  }
  return { step, done: /retest/.test(code) };
}

function changed(a: View | null, b: View, sc: Scenario): string | null {
  if (!a) return null;
  if (b.step > a.step) return sc.milestones[b.step - 1].status;
  if (!a.done && b.done) return "retest passed ✓";
  return null;
}

/* ── Syntax highlighting (works on partial code) ─────────────────────────── */

type Rule = [RegExp, string];

const SQL_RULES: Rule[] = [
  [/--.*/y, "tk-c"],
  [/"[^"\n]*"?/y, "tk-s"],
  [/\b(?:alter|table|enable|row|level|security|create|policy|on|for|select|using)\b/y, "tk-k"],
  [/\b(?:auth\.uid)\b/y, "tk-f"],
  [/\b(?:orders)\b/y, "tk-t"],
  [/\b\d+\b/y, "tk-n"],
  [/[A-Za-z_$][\w$]*/y, "tk-v"],
  [/\s+/y, ""],
  [/[\s\S]/y, "tk-p"],
];

const TS_RULES: Rule[] = [
  [/\/\/.*/y, "tk-c"],
  [/"[^"\n]*"?/y, "tk-s"],
  [/'[^'\n]*'?/y, "tk-s"],
  [/`[^`\n]*`?/y, "tk-s"],
  [/\b(?:export|default|async|function|const|let|await|return|if|else|for|of|import|from|new|true|false|null|typeof)\b/y, "tk-k"],
  [/\b(?:Request|Response|Order|Stripe|string)\b/y, "tk-t"],
  [/\b[A-Za-z_$][\w$]*(?=\()/y, "tk-f"],
  [/\b\d+(?:\.\d+)?\b/y, "tk-n"],
  [/[A-Za-z_$][\w$]*/y, "tk-v"],
  [/\s+/y, ""],
  [/[\s\S]/y, "tk-p"],
];

function classify(line: string, rules: Rule[]): string[] {
  const out: string[] = new Array(line.length).fill("");
  let i = 0;
  while (i < line.length) {
    for (const [re, cls] of rules) {
      re.lastIndex = i;
      const m = re.exec(line);
      if (m && m[0].length) {
        out.fill(cls, i, i + m[0].length);
        i += m[0].length;
        break;
      }
    }
  }
  return out;
}

type Seg = { text: string; cls: string; caret?: boolean };

function segments(text: string, start: number, cur: number, rules: Rule[]): Seg[] {
  const cls = classify(text, rules);
  const out: Seg[] = [];
  for (let i = 0; i <= text.length; i++) {
    if (start + i === cur) out.push({ text: "", cls: "", caret: true });
    if (i === text.length) break;
    const last = out[out.length - 1];
    if (last && !last.caret && last.cls === cls[i]) last.text += text[i];
    else out.push({ text: text[i], cls: cls[i] });
  }
  return out;
}

/* ── Shell: which problem is playing; loops forever ─────────────────────── */

export function LiveCodeHero() {
  const [scn, setScn] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => setScn((i) => (i + 1) % SCENARIOS.length), []);

  return (
    <div ref={rootRef}>
      <Player key={scn} scn={scn} rootRef={rootRef} onFinished={next} />
    </div>
  );
}

/* ── Player: runs one problem's script and renders editor + preview ──────── */

type Ui = { buf: string; cur: number; v: View; status: string; idle: boolean; progress: number };

const VIS = 15;
const LH = 20;
const SYNC = "#f37842";

const delayFor = (chunk: string, fast?: boolean) => {
  if (chunk.startsWith("\n")) return fast ? 40 : 150;
  const base = fast ? 6 + Math.random() * 10 : 22 + Math.random() * 30;
  return /[;()]/.test(chunk) ? base + 45 : base;
};

function Player({
  scn,
  rootRef,
  onFinished,
}: {
  scn: number;
  rootRef: RefObject<HTMLDivElement | null>;
  onFinished: () => void;
}) {
  const sc = SCENARIOS[scn];
  const [ui, setUi] = useState<Ui>(() => ({ buf: "", cur: 0, v: { step: 0, done: false }, status: sc.initialStatus, idle: true, progress: 0 }));

  useEffect(() => {
    let alive = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        const t = setTimeout(() => {
          timers.delete(t);
          res();
        }, ms);
        timers.add(t);
      });
    // Typing only runs while the demo is on screen and the tab is visible.
    // Checked directly on each tick rather than through an observer, so it can never get stuck "hidden".
    const inView = () => {
      const el = rootRef.current;
      if (!el) return true;
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };
    const sleep = async (ms: number) => {
      await wait(ms);
      while (alive && (document.hidden || !inView())) await wait(250);
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ed = { buf: "", cur: 0 };
    let v: View | null = null;
    let status = sc.initialStatus;
    let progress = 0;

    const commit = (idle = false) => {
      const nextView = compile(ed.buf, sc);
      status = changed(v, nextView, sc) ?? status;
      v = nextView;
      setUi({ buf: ed.buf, cur: ed.cur, v: nextView, status, idle, progress });
    };

    const apply = async (op: Op, instant: boolean) => {
      switch (op.k) {
        case "type":
          for (let i = 0; i < op.s.length && alive; i++) {
            let chunk = op.s[i];
            if (chunk === "\n") while (op.s[i + 1] === " ") chunk += op.s[++i];
            ed.buf = ed.buf.slice(0, ed.cur) + chunk + ed.buf.slice(ed.cur);
            ed.cur += chunk.length;
            if (!instant) {
              commit();
              await sleep(delayFor(chunk, op.fast));
            }
          }
          break;
        case "del":
          for (let i = 0; i < op.n && alive; i++) {
            ed.buf = ed.buf.slice(0, ed.cur - 1) + ed.buf.slice(ed.cur);
            ed.cur -= 1;
            if (!instant) {
              commit();
              await sleep(90);
            }
          }
          break;
        case "cut":
          ed.buf = ed.buf.slice(0, ed.cur - op.n) + ed.buf.slice(ed.cur);
          ed.cur -= op.n;
          if (!instant) {
            commit();
            await sleep(350);
          }
          break;
        case "pause":
          if (!instant) {
            commit(true);
            await sleep(op.ms);
          }
          break;
        case "end":
          ed.cur = ed.buf.length;
          if (!instant) commit(true);
          break;
      }
    };

    (async () => {
      await sleep(reduce ? 0 : 600);
      if (reduce) {
        // No motion: show the finished fix and let the chips switch problems.
        for (const op of sc.script) await apply(op, true);
        progress = 1;
        status = "retest passed ✓";
        commit(true);
        return;
      }
      for (let i = 0; i < sc.script.length; i++) {
        if (!alive) return;
        progress = (i + 1) / sc.script.length;
        await apply(sc.script[i], false);
      }
      if (!alive) return;
      commit(true);
      await sleep(HOLD);
      if (alive) onFinished();
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [sc, onFinished, rootRef]);

  const rules = sc.lang === "sql" ? SQL_RULES : TS_RULES;
  const lines = ui.buf.split("\n");
  const starts = lines.reduce<number[]>((acc, _l, i) => [...acc, i === 0 ? 0 : acc[i - 1] + lines[i - 1].length + 1], []);
  const before = ui.buf.slice(0, ui.cur);
  const curLine = before.split("\n").length - 1;
  const curCol = ui.cur - (before.lastIndexOf("\n") + 1);
  const top = Math.max(0, Math.min(curLine - (VIS - 4), lines.length - VIS));
  const { step, done } = ui.v;
  const badge = sc.badge(step);
  const Preview = sc.Preview;

  return (
    <div>
      <p className="sr-only">Demo: {sc.summary}</p>

      <div className="relative mx-auto grid w-full max-w-xl items-center lg:max-w-none lg:grid-cols-[0.92fr_1.08fr]" aria-hidden="true">
        <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(243,120,66,0.12),transparent)] blur-2xl" />

        {/* ── What the client sees ── */}
        <div className="ml-auto w-[94%] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 lg:order-2 lg:w-full">
          <div className="flex items-center gap-2 border-b border-black/10 bg-[#ebe6df] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 flex-1 truncate rounded-md bg-white/80 px-3 py-1 font-mono text-[10px] text-[#4a4038]">{sc.url}</span>
          </div>
          <div className="relative h-[430px] overflow-hidden bg-[#f6f3ee] p-5 pb-14 text-[#22160f] lg:h-[410px] lg:pb-5 lg:pl-16">
            <Preview step={step} done={done} />
          </div>
        </div>

        {/* ── Editor ── */}
        <div className="relative z-10 -mt-10 w-[94%] overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/95 shadow-2xl shadow-black/70 backdrop-blur sm:w-[90%] lg:order-1 lg:-mr-10 lg:mt-0 lg:w-auto lg:translate-y-8">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="ml-3 flex min-w-0 items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-[#d9d3cb]">
              <span className="truncate">{sc.file}</span>
              {!done && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SYNC }} />}
            </span>
            <span className="ml-auto shrink-0">
              <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${badge.ok ? "bg-emerald-400/15 text-emerald-300" : "bg-[#ef4444]/15 text-[#fca5a5]"}`}>{badge.label}</span>
            </span>
          </div>

          <div className="relative h-[324px] overflow-hidden py-3 font-mono text-[9.5px] sm:text-[12px]">
            <div className="transition-transform duration-300 ease-out" style={{ transform: `translateY(${-top * LH}px)` }}>
              {lines.map((text, i) => (
                <div key={i} className={`flex h-5 items-center whitespace-pre pr-4 leading-5 ${i === curLine && !done ? "bg-white/[0.045]" : ""}`}>
                  <span className={`w-9 shrink-0 select-none pr-3 text-right ${i === curLine && !done ? "text-[#d9d3cb]" : "text-[#77706a]"}`}>{i + 1}</span>
                  <span>
                    {segments(text, starts[i], ui.cur, rules).map((s, j) =>
                      s.caret ? (
                        <span
                          key={j}
                          className={`relative -mr-[2px] inline-block h-[1.15em] w-[2px] translate-y-[2px] ${ui.idle ? "animate-blink" : ""}`}
                          style={{ background: SYNC }}
                        />
                      ) : (
                        <span key={j} className={s.cls}>
                          {s.text}
                        </span>
                      ),
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-1.5 font-mono text-[10px] text-[#a39d95]">
            <span className="flex min-w-0 items-center gap-2">
              <span className="shrink-0" style={{ color: SYNC }}>
                {sc.tool}
              </span>
              <span key={ui.status} className="mount truncate text-[#d9d3cb]">
                {ui.status}
              </span>
            </span>
            <span className="shrink-0">
              Ln {curLine + 1}, Col {curCol + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Preview building blocks ─────────────────────────────────────────────── */

type Tone = "bad" | "mid" | "good" | "muted";

const TONE: Record<Tone, { banner: string; icon: string; tag: string }> = {
  bad: { banner: "bg-[#fdecea] text-[#7a1a12] ring-[#f5b5ad]", icon: "!", tag: "bg-[#fdecea] text-[#b42318] ring-[#f5b5ad]" },
  mid: { banner: "bg-[#fff6e0] text-[#6b4a00] ring-[#f2d48a]", icon: "…", tag: "bg-[#fff6e0] text-[#8a5a00] ring-[#f2d48a]" },
  good: { banner: "bg-[#e7f6ec] text-[#14532d] ring-[#9fd8b1]", icon: "✓", tag: "bg-[#e7f6ec] text-[#166534] ring-[#9fd8b1]" },
  muted: { banner: "bg-white text-[#5f5248] ring-black/10", icon: "·", tag: "bg-white text-[#5f5248] ring-black/10" },
};

function Head({ title, pill }: { title: string; pill: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[15px] font-extrabold tracking-tight">{title}</p>
      <span className="min-w-0 truncate rounded-full bg-white px-2.5 py-1 font-mono text-[10px] ring-1 ring-black/10">{pill}</span>
    </div>
  );
}

function Banner({ tone, title, text }: { tone: Tone; title: string; text: string }) {
  const s = TONE[tone];
  return (
    <div key={title} className={`mount mt-4 flex items-start gap-3 rounded-xl px-3.5 py-3 ring-1 ${s.banner}`}>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current/10 text-[11px] font-bold">{s.icon}</span>
      <div>
        <p className="text-[12.5px] font-bold">{title}</p>
        <p className="mt-0.5 text-[11px] leading-snug">{text}</p>
      </div>
    </div>
  );
}

function Tag({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span key={String(children)} className={`mount inline-block max-w-full truncate rounded-full px-2 py-0.5 font-mono text-[9.5px] ring-1 ${TONE[tone].tag}`}>
      {children}
    </span>
  );
}

function Table({ cols, head, children }: { cols: string; head: string[]; children: ReactNode }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
      <div className={`grid ${cols} border-b border-black/10 px-3 py-2 font-mono text-[9.5px] uppercase tracking-wider text-[#5f5248]`}>
        {head.map((h, i) => (
          <span key={h} className={i === head.length - 1 ? "text-right" : ""}>
            {h}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}

/* ── 1 · Orders: row level security ─────────────────────────────────────── */

const ORDERS = [
  { id: "#1042", who: ME, total: "$84.00" },
  { id: "#1043", who: "jon@northwind.io", total: "$312.50" },
  { id: "#1044", who: "priya@kettle.app", total: "$19.99" },
  { id: "#1045", who: ME, total: "$46.20" },
  { id: "#1046", who: "lee@harbor.dev", total: "$1,240.00" },
  { id: "#1047", who: "sam@fernway.com", total: "$58.75" },
];

function OrdersPreview({ step }: PreviewProps) {
  const phase = step >= 3 ? "secured" : step >= 1 ? "locked" : "open";
  const rows = phase === "open" ? ORDERS : phase === "secured" ? ORDERS.filter((o) => o.who === ME) : [];
  const others = ORDERS.filter((o) => o.who !== ME).length;
  return (
    <>
      <Head title="My orders" pill={`signed in as ${ME}`} />
      {phase === "open" && <Banner tone="bad" title="Data exposed" text={`You can see ${others} orders that belong to other customers.`} />}
      {phase === "locked" && <Banner tone="mid" title="Locked down" text="Row level security is on. Nothing is readable until a policy allows it." />}
      {phase === "secured" && <Banner tone="good" title="Secured" text="Each user reaches only their own orders. Retested with two accounts." />}
      <Table cols="grid-cols-[4rem_1fr_5rem]" head={["Order", "Customer", "Total"]}>
        {rows.length === 0 && <p className="px-3 py-6 text-center font-mono text-[10.5px] text-[#5f5248]">0 rows · waiting for a policy</p>}
        {rows.map((o) => {
          const leak = o.who !== ME;
          return (
            <div key={o.id} className={`mount grid grid-cols-[4rem_1fr_5rem] items-center border-b border-black/5 px-3 py-2 text-[11.5px] last:border-0 ${leak ? "bg-[#fdecea]" : ""}`}>
              <span className="font-mono">{o.id}</span>
              <span className={`truncate ${leak ? "font-semibold text-[#b42318]" : ""}`}>{o.who}</span>
              <span className="text-right font-semibold">{o.total}</span>
            </div>
          );
        })}
      </Table>
    </>
  );
}

/* ── 2 · Bundle scan: secret key in the browser ──────────────────────────── */

function BundlePreview({ step, done }: PreviewProps) {
  const fixed = step >= 3;
  const moving = step >= 1 && !fixed;
  const rows: { file: string; what: ReactNode; tone: Tone; tag: string }[] = [
    fixed
      ? { file: "main-9c21.js", what: "no secrets found", tone: "good", tag: "clean" }
      : { file: "main-7f3a.js", what: <span className="font-mono text-[#b42318]">sk_live_51H8f…Qb2</span>, tone: "bad", tag: "readable by anyone" },
    { file: "main-*.js", what: <span className="font-mono">pk_live_51H8f…m3K</span>, tone: "muted", tag: "public by design" },
  ];
  if (step >= 1) rows.push({ file: "actions.ts", what: "runs on the server only", tone: fixed ? "good" : "mid", tag: fixed ? "server only" : "moving…" });
  if (done) rows.push({ file: "Stripe dashboard", what: "old key revoked · new key issued", tone: "good", tag: "rotated" });
  return (
    <>
      <Head title="Bundle scan" pill={fixed ? "main-9c21.js · 198 KB" : "main-7f3a.js · 214 KB"} />
      {!fixed && !moving && <Banner tone="bad" title="Secret key in the browser" text="Anyone can open DevTools, read the key and charge or refund on your Stripe account." />}
      {moving && <Banner tone="mid" title="Moving to the server" text="The checkout call now runs in a server action. The browser will only receive a redirect URL." />}
      {fixed && <Banner tone="good" title="0 secrets in the bundle" text={done ? "The key lives on the server and the old one has been revoked." : "The key lives on the server. Rotating the old one next."} />}
      <Table cols="grid-cols-[5.5rem_1fr_7rem]" head={["File", "Finding", "Status"]}>
        {rows.map((r) => (
          <div key={r.file} className="mount grid grid-cols-[5.5rem_1fr_7rem] items-center gap-2 border-b border-black/5 px-3 py-2 text-[11px] last:border-0">
            <span className="truncate font-mono text-[10px]">{r.file}</span>
            <span className="truncate">{r.what}</span>
            <span className="text-right">
              <Tag tone={r.tone}>{r.tag}</Tag>
            </span>
          </div>
        ))}
      </Table>
    </>
  );
}

/* ── 3 · Payments: forged webhook ────────────────────────────────────────── */

function PaymentsPreview({ step }: PreviewProps) {
  const verified = step >= 1;
  const once = step >= 2;
  const rows: { id: string; who: string; total: string; tone: Tone; tag: string }[] = [
    { id: "#1043", who: "jon@northwind.io", total: "$312.50", tone: verified ? "muted" : "bad", tag: verified ? "unpaid · forged POST → 400" : "paid · unsigned POST" },
    { id: "#1044", who: "priya@kettle.app", total: "$19.99", tone: "good", tag: "paid · evt_1QaZ…" },
    { id: "#1045", who: ME, total: "$46.20", tone: once ? "good" : "mid", tag: once ? "paid · once, retry ignored" : "paid · applied ×2 (retry)" },
    { id: "#1046", who: "lee@harbor.dev", total: "$1,240.00", tone: verified ? "muted" : "bad", tag: verified ? "unpaid · forged POST → 400" : "paid · unsigned POST" },
  ];
  return (
    <>
      <Head title="Payments" pill={verified ? "2 forged requests rejected" : "2 unsigned requests accepted"} />
      {!verified && <Banner tone="bad" title="Payments can be faked" text="Any request to this URL marks an order paid. No signature is checked, so goods ship for free." />}
      {verified && !once && <Banner tone="mid" title="Signature verified" text="Only events signed by Stripe are accepted. Retried events still apply twice." />}
      {once && <Banner tone="good" title="Verified and applied once" text="Forged requests get 400. Each Stripe event counts once, even when Stripe retries it." />}
      <Table cols="grid-cols-[3.4rem_1fr_9.5rem] sm:grid-cols-[3.4rem_1fr_11.5rem]" head={["Order", "Customer", "Status"]}>
        {rows.map((r) => (
          <div key={r.id} className={`grid grid-cols-[3.4rem_1fr_9.5rem] sm:grid-cols-[3.4rem_1fr_11.5rem] items-center gap-2 border-b border-black/5 px-3 py-2 text-[11px] last:border-0 ${r.tone === "bad" ? "bg-[#fdecea]" : ""}`}>
            <span className="font-mono">{r.id}</span>
            <span className="truncate">
              {r.who} <span className="font-semibold">{r.total}</span>
            </span>
            <span className="text-right">
              <Tag tone={r.tone}>{r.tag}</Tag>
            </span>
          </div>
        ))}
      </Table>
    </>
  );
}

/* ── 4 · Speed: 241 queries → 1 ─────────────────────────────────────────── */

function SpeedPreview({ step }: PreviewProps) {
  const fast = step >= 1;
  const cached = step >= 2;
  const score = cached ? 99 : fast ? 92 : 38;
  const stats = [
    ["Database queries", cached ? "1 · cached" : fast ? "1" : "241"],
    ["Server time", cached ? "12 ms" : fast ? "180 ms" : "3.9 s"],
    ["Largest paint", cached ? "0.3 s" : fast ? "0.6 s" : "4.2 s"],
  ];
  const bars = fast ? 1 : 24;
  return (
    <>
      <Head title="Catalog page" pill="/products · mobile · 4G" />
      {!fast && <Banner tone="bad" title="241 queries per page view" text="Every product fetches its own reviews. On a phone the page takes 4.2 seconds to show anything." />}
      {fast && !cached && <Banner tone="good" title="One query, with a join" text="Reviews come back with the products in a single round trip. 180 ms on the server." />}
      {cached && <Banner tone="good" title="Cached for a minute" text="Repeat visits are served in 12 ms. The first paint lands in 0.3 seconds." />}
      <div className="mt-4 grid grid-cols-[4.5rem_1fr] items-center gap-4">
        <div key={score} className={`mount flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full ring-4 ${fast ? "bg-[#e7f6ec] ring-[#9fd8b1] text-[#14532d]" : "bg-[#fdecea] ring-[#f5b5ad] text-[#7a1a12]"}`}>
          <span className="text-2xl font-extrabold tabular-nums">{score}</span>
        </div>
        <div className="grid gap-1.5">
          {stats.map(([k, val]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 border-b border-black/5 pb-1 text-[11px] last:border-0">
              <span className="text-[#5f5248]">{k}</span>
              <span key={val} className={`mount font-mono font-semibold ${fast ? "text-[#166534]" : "text-[#b42318]"}`}>
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-black/10">
        <p className="font-mono text-[9.5px] uppercase tracking-wider text-[#5f5248]">Request waterfall</p>
        <div key={bars} className="mount mt-2 flex h-[4.5rem] flex-col gap-[2px]">
          {Array.from({ length: Math.min(bars, 11) }).map((_, i) => (
            <span
              key={i}
              className={`h-[3px] rounded-sm ${fast ? "bg-[#4ade80]" : "bg-[#f87171]"}`}
              style={{ marginLeft: `${fast ? 0 : i * 7}%`, width: fast ? (cached ? "8%" : "22%") : "14%" }}
            />
          ))}
          {!fast && <span className="mt-auto font-mono text-[9.5px] text-[#b42318]">… and 230 more queries</span>}
          {fast && <span className="mt-auto font-mono text-[9.5px] text-[#166534]">{cached ? "1 request · cache hit" : "1 request · 180 ms"}</span>}
        </div>
      </div>
    </>
  );
}

/* ── 5 · Dispatch: orders book their own courier ─────────────────────────── */

const PAID = [
  { id: "#1042", who: "maya", city: "Dhaka", delivered: 7, cancelled: 0, tracking: "SF-20A4C1" },
  { id: "#1043", who: "jon", city: "Chattogram", delivered: 0, cancelled: 0, tracking: "" },
  { id: "#1044", who: "priya", city: "Sylhet", delivered: 3, cancelled: 0, tracking: "SF-20A4C2" },
  { id: "#1045", who: "lee", city: "Khulna", delivered: 12, cancelled: 1, tracking: "" },
  { id: "#1046", who: "sam", city: "Rajshahi", delivered: 4, cancelled: 0, tracking: "SF-20A4C3" },
];

function DispatchPreview({ step }: PreviewProps) {
  const ruled = step >= 1;
  const booked = step >= 2;
  const invoiced = step >= 3;
  const trusted = (o: (typeof PAID)[number]) => o.delivered >= 3 && o.cancelled === 0;
  const nBooked = PAID.filter(trusted).length;
  return (
    <>
      <Head title="Dispatch" pill={booked ? `${nBooked} booked · ${PAID.length - nBooked} held` : `${PAID.length} paid orders waiting`} />
      {!ruled && <Banner tone="bad" title="Manual dispatch" text="Every address is copied into the courier's website by hand. About four minutes per order, and typos happen." />}
      {ruled && !booked && <Banner tone="mid" title="Trust rule in place" text="Repeat customers with 3+ deliveries and no cancellations qualify. New customers get a human check." />}
      {booked && !invoiced && <Banner tone="good" title={`${nBooked} of ${PAID.length} orders booked themselves`} text="Tracking numbers are saved on the order. Two are held for a person to check." />}
      {invoiced && <Banner tone="good" title="Booked, tracked and invoiced" text="Each booked order emailed its customer a PDF invoice. No copy-paste left in the day." />}
      <Table cols="grid-cols-[3.4rem_1fr_8.5rem]" head={["Order", "Customer", "Status"]}>
        {PAID.map((o) => {
          const ok = trusted(o);
          let tone: Tone = "muted";
          let tag = "copy to courier ↗";
          if (booked) {
            tone = ok ? "good" : "mid";
            tag = ok ? `booked · ${o.tracking}` : "held for review";
          } else if (ruled) {
            tone = ok ? "good" : "mid";
            tag = ok ? "trusted" : o.delivered === 0 ? "new customer" : "1 cancellation";
          }
          return (
            <div key={o.id} className="grid grid-cols-[3.4rem_1fr_8.5rem] items-center gap-2 border-b border-black/5 px-3 py-2 text-[11px] last:border-0">
              <span className="font-mono">{o.id}</span>
              <span className="truncate">
                {o.who} · {o.city}
                <span className="ml-1.5 font-mono text-[9.5px] text-[#5f5248]">
                  {o.delivered} delivered{o.cancelled ? ` · ${o.cancelled} cancelled` : ""}
                </span>
              </span>
              <span className="flex items-center justify-end gap-1">
                {invoiced && ok && (
                  <span key="inv" className="mount text-[10px]" title="invoice emailed">
                    ✉
                  </span>
                )}
                <Tag tone={tone}>{tag}</Tag>
              </span>
            </div>
          );
        })}
      </Table>
    </>
  );
}
