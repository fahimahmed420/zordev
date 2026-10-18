"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
 * A tiny live-coding engine, scripted as an audit fix.
 * The editor holds a real text buffer that a script edits (type, delete, pause).
 * The preview is never scripted: it is derived from the buffer on every keystroke,
 * so the SQL on the left and what the signed-in user can see on the right cannot drift apart.
 */

/* ── Script ──────────────────────────────────────────────────────────────── */

type Op = { k: "type"; s: string; fast?: boolean } | { k: "del"; n: number } | { k: "pause"; ms: number } | { k: "end" };

const T = (s: string, fast?: boolean): Op => ({ k: "type", s, fast });
const P = (ms: number): Op => ({ k: "pause", ms });
const D = (n: number): Op => ({ k: "del", n });

const SCRIPT: Op[] = [
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
  { k: "end" },
];

/* ── Compiler: buffer → what the signed-in user can read ──────────────────── */

type Phase = "open" | "locked" | "secured";
type View = { phase: Phase; policy: boolean; done: boolean };

function compile(code: string): View {
  const rls = /enable row level security;/.test(code);
  const policy = /using \(auth\.uid\(\) = user_id\);/.test(code);
  // RLS on with no policy denies every row: the realistic in-between state.
  return { phase: policy && rls ? "secured" : rls ? "locked" : "open", policy: /create policy/.test(code), done: /retest/.test(code) };
}

function changed(a: View | null, b: View): string | null {
  if (!a) return null;
  if (a.phase !== b.phase)
    return b.phase === "locked" ? "RLS on · no policy yet → 0 rows" : b.phase === "secured" ? "policy applied → own rows only" : null;
  if (a.policy !== b.policy) return "writing policy…";
  if (a.done !== b.done) return "retest passed ✓";
  return null;
}

const ME = "maya@acme.co";
const ORDERS = [
  { id: "#1042", who: ME, total: "$84.00" },
  { id: "#1043", who: "jon@northwind.io", total: "$312.50" },
  { id: "#1044", who: "priya@kettle.app", total: "$19.99" },
  { id: "#1045", who: ME, total: "$46.20" },
  { id: "#1046", who: "lee@harbor.dev", total: "$1,240.00" },
  { id: "#1047", who: "sam@fernway.com", total: "$58.75" },
];

/* ── Syntax highlighting (works on partial code) ─────────────────────────── */

const RULES: [RegExp, string][] = [
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

function classify(line: string): string[] {
  const out: string[] = new Array(line.length).fill("");
  let i = 0;
  while (i < line.length) {
    for (const [re, cls] of RULES) {
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

function segments(text: string, start: number, cur: number): Seg[] {
  const cls = classify(text);
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

/* ── Component ───────────────────────────────────────────────────────────── */

type Ui = { buf: string; cur: number; v: View; status: string; idle: boolean; done: boolean };

const START = compile("");
const EMPTY: Ui = { buf: "", cur: 0, v: START, status: "reading audit finding", idle: true, done: false };
const VIS = 15;
const LH = 20;
const SYNC = "#f37842";

const delayFor = (chunk: string, fast?: boolean) => {
  if (chunk.startsWith("\n")) return fast ? 40 : 150;
  const base = fast ? 6 + Math.random() * 10 : 22 + Math.random() * 30;
  return /[;()]/.test(chunk) ? base + 45 : base;
};

export function LiveCodeHero() {
  const [ui, setUi] = useState<Ui>(EMPTY);
  const [run, setRun] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const visibleRef = useRef(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    const sleep = async (ms: number) => {
      await wait(ms);
      while (alive && (document.hidden || !visibleRef.current || pausedRef.current)) await wait(250);
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ed = { buf: "", cur: 0 };
    let v: View | null = null;
    let status = EMPTY.status;

    const commit = (idle = false, done = false) => {
      const next = compile(ed.buf);
      status = changed(v, next) ?? status;
      v = next;
      setUi({ buf: ed.buf, cur: ed.cur, v: next, status, idle, done });
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
        for (const op of SCRIPT) await apply(op, true);
        commit(true, true);
        return;
      }
      // Play once, then stop (WCAG 2.2.2). Visitors can replay with the button.
      for (const op of SCRIPT) {
        if (!alive) return;
        await apply(op, false);
      }
      if (alive) commit(true, true);
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [run]);

  const replay = () => {
    pausedRef.current = false;
    setPaused(false);
    setUi(EMPTY);
    setRun((r) => r + 1);
  };

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };

  const lines = ui.buf.split("\n");
  const starts = lines.reduce<number[]>((acc, _l, i) => [...acc, i === 0 ? 0 : acc[i - 1] + lines[i - 1].length + 1], []);
  const before = ui.buf.slice(0, ui.cur);
  const curLine = before.split("\n").length - 1;
  const curCol = ui.cur - (before.lastIndexOf("\n") + 1);
  const top = Math.max(0, Math.min(curLine - (VIS - 4), lines.length - VIS));

  const { phase } = ui.v;
  const rows = phase === "open" ? ORDERS : phase === "secured" ? ORDERS.filter((o) => o.who === ME) : [];
  const others = ORDERS.filter((o) => o.who !== ME).length;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={ui.done ? replay : togglePause}
        aria-label={ui.done ? "Replay the security-fix demo" : paused ? "Play the security-fix demo" : "Pause the security-fix demo"}
        className="absolute -top-12 right-0 z-20 inline-flex min-h-9 items-center gap-2 rounded-full border border-line-strong bg-[#0c0c0c]/80 px-3.5 font-mono text-xs text-ink backdrop-blur transition-colors hover:border-orange hover:text-orange"
      >
        <span aria-hidden="true">{ui.done ? "↻" : paused ? "▶" : "❚❚"}</span>
        {ui.done ? "Replay" : paused ? "Play" : "Pause"}
      </button>
      <p className="sr-only">
        Demo: a database rule is added so a signed-in user can only see their own orders. Before the fix, the orders page shows every customer&apos;s
        orders. After it, only the user&apos;s own.
      </p>
      <div className="relative mx-auto grid w-full max-w-xl items-center lg:max-w-none lg:grid-cols-[0.92fr_1.08fr]" aria-hidden="true">
        <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(243,120,66,0.12),transparent)] blur-2xl" />

        {/* ── What the signed-in user sees ── */}
        <div className="ml-auto w-[94%] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 lg:order-2 lg:w-full">
          <div className="flex items-center gap-2 border-b border-black/10 bg-[#ebe6df] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 flex-1 truncate rounded-md bg-white/80 px-3 py-1 font-mono text-[10px] text-[#4a4038]">yourapp.com/account/orders</span>
          </div>
          <div className="relative h-[430px] overflow-hidden bg-[#f6f3ee] p-5 pb-14 text-[#22160f] lg:h-[410px] lg:pb-5 lg:pl-16">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-extrabold tracking-tight">My orders</p>
              <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[10px] ring-1 ring-black/10">signed in as {ME}</span>
            </div>

            <Banner phase={phase} others={others} />

            <div className="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
              <div className="grid grid-cols-[4rem_1fr_5rem] border-b border-black/10 px-3 py-2 font-mono text-[9.5px] uppercase tracking-wider text-[#5f5248]">
                <span>Order</span>
                <span>Customer</span>
                <span className="text-right">Total</span>
              </div>
              {rows.length === 0 && <p className="px-3 py-6 text-center font-mono text-[10.5px] text-[#5f5248]">0 rows · waiting for a policy</p>}
              {rows.map((o) => {
                const leak = o.who !== ME;
                return (
                  <div
                    key={o.id}
                    className={`mount grid grid-cols-[4rem_1fr_5rem] items-center border-b border-black/5 px-3 py-2 text-[11.5px] last:border-0 ${leak ? "bg-[#fdecea]" : ""}`}
                  >
                    <span className="font-mono">{o.id}</span>
                    <span className={`truncate ${leak ? "font-semibold text-[#b42318]" : ""}`}>{o.who}</span>
                    <span className="text-right font-semibold">{o.total}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Editor ── */}
        <div className="relative z-10 -mt-10 w-[94%] overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/95 shadow-2xl shadow-black/70 backdrop-blur sm:w-[90%] lg:order-1 lg:-mr-10 lg:mt-0 lg:w-auto lg:translate-y-8">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="ml-3 flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-[#d9d3cb]">
              0007_orders_rls.sql
              {!ui.done && <span className="h-1.5 w-1.5 rounded-full" style={{ background: SYNC }} />}
            </span>
            <span className="ml-auto">
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${phase === "secured" ? "bg-emerald-400/15 text-emerald-300" : "bg-[#ef4444]/15 text-[#fca5a5]"}`}
              >
                {phase === "secured" ? "● secured" : "● exposed"}
              </span>
            </span>
          </div>

          <div className="relative h-[324px] overflow-hidden py-3 font-mono text-[9.5px] sm:text-[12px]">
            <div className="transition-transform duration-300 ease-out" style={{ transform: `translateY(${-top * LH}px)` }}>
              {lines.map((text, i) => (
                <div key={i} className={`flex h-5 items-center whitespace-pre pr-4 leading-5 ${i === curLine && !ui.done ? "bg-white/[0.045]" : ""}`}>
                  <span className={`w-9 shrink-0 select-none pr-3 text-right ${i === curLine && !ui.done ? "text-[#d9d3cb]" : "text-[#77706a]"}`}>{i + 1}</span>
                  <span>
                    {segments(text, starts[i], ui.cur).map((s, j) =>
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
              <span style={{ color: SYNC }}>⚡ supabase</span>
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

function Banner({ phase, others }: { phase: Phase; others: number }) {
  const styles: Record<Phase, { cls: string; icon: ReactNode; title: string; text: string }> = {
    open: {
      cls: "bg-[#fdecea] text-[#7a1a12] ring-[#f5b5ad]",
      icon: "!",
      title: "Data exposed",
      text: `You can see ${others} orders that belong to other customers.`,
    },
    locked: {
      cls: "bg-[#fff6e0] text-[#6b4a00] ring-[#f2d48a]",
      icon: "…",
      title: "Locked down",
      text: "Row level security is on. Nothing is readable until a policy allows it.",
    },
    secured: {
      cls: "bg-[#e7f6ec] text-[#14532d] ring-[#9fd8b1]",
      icon: "✓",
      title: "Secured",
      text: "Each user reaches only their own orders. Retested with two accounts.",
    },
  };
  const s = styles[phase];
  return (
    <div key={phase} className={`mount mt-4 flex items-start gap-3 rounded-xl px-3.5 py-3 ring-1 ${s.cls}`}>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current/10 text-[11px] font-bold">{s.icon}</span>
      <div>
        <p className="text-[12.5px] font-bold">{s.title}</p>
        <p className="mt-0.5 text-[11px] leading-snug">{s.text}</p>
      </div>
    </div>
  );
}
