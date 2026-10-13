"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/*
 * A tiny live-coding engine.
 * The editor holds a real text buffer that a script edits (type, delete, select, replace).
 * The preview is never scripted: it is compiled from the buffer on every keystroke,
 * so the code and the rendered site cannot drift apart.
 */

/* ── Script ──────────────────────────────────────────────────────────────── */

type Op =
  | { k: "type"; s: string; fast?: boolean }
  | { k: "del"; n: number }
  | { k: "pause"; ms: number }
  | { k: "select"; find: string; len: number }
  | { k: "click"; card: number }
  | { k: "end" };

const T = (s: string, fast?: boolean): Op => ({ k: "type", s, fast });
const P = (ms: number): Op => ({ k: "pause", ms });
const D = (n: number): Op => ({ k: "del", n });

const SCRIPT: Op[] = [
  T("// store.tsx · every keystroke re-renders →\n", true),
  T('import { useState } from "react"\n\n', true),
  T("const beans = [\n", true),
  T('  { name: "Ethiopia", price: 18 },\n', true),
  T('  { name: "Colombia", price: 16 },\n', true),
  T('  { name: "Sumatra", price: 17 },\n', true),
  T("]\n\n", true),
  T("export default function Store() {\n"),
  T("  const [cart, setCart] = useState(0)\n\n"),
  T("  return (\n"),
  T('    <Page bg="#f6f1ea" accent="#c2410c">\n'),
  T('      <Nav brand="Northwind" cart={cart} />\n'),
  T('      <Hero title="Coffee, roasted this wek'),
  P(380),
  D(2),
  T('eek" />\n'),
  T("      <Grid cols={2"),
  P(750),
  D(1),
  T("3}>\n"),
  T("        {beans.map((b) => (\n"),
  T("          <Card\n"),
  T("            key={b.name}\n"),
  T("            {...b}\n"),
  T("            onAdd={() => setCart((n) => n + 1)}\n"),
  T("          />\n"),
  T("        ))}\n"),
  T("      </Grid>\n"),
  { k: "click", card: 1 },
  T('      <Checkout courier="auto" />\n'),
  T("    </Page>\n"),
  T("  )\n"),
  T("}"),
  P(700),
  { k: "select", find: 'accent="', len: 7 },
  P(550),
  T("#1d4ed8"),
  P(350),
  { k: "end" },
  { k: "click", card: 0 },
];

/* ── Compiler: buffer → what the preview renders ─────────────────────────── */

type Bean = { name: string; price: string };
type View = {
  page: boolean;
  bg?: string;
  accent?: string;
  nav: boolean;
  brand?: string;
  cartBadge: boolean;
  state: boolean;
  hero: boolean;
  title?: string;
  grid: boolean;
  cols: number;
  card: boolean;
  spread: boolean;
  add: boolean;
  beans: Bean[];
  checkout: boolean;
  courier?: string;
  closed: boolean;
};

const grab = (code: string, re: RegExp) => code.match(re)?.[1];

function compile(code: string, prev: View | null): View {
  // While a value is mid-edit (invalid), keep the last good render, like hot module reload does.
  let bg = grab(code, /\bbg="(#[0-9a-fA-F]{6})"/);
  if (!bg && /\bbg="/.test(code)) bg = prev?.bg;
  let accent = grab(code, /accent="(#[0-9a-fA-F]{6})"/);
  if (!accent && /accent="/.test(code)) accent = prev?.accent;
  let cols = Number(grab(code, /cols=\{(\d)/) ?? 0);
  if (!cols && /cols=\{/.test(code)) cols = prev?.cols ?? 0;

  return {
    page: /<Page\b/.test(code),
    bg,
    accent,
    nav: /<Nav\b/.test(code),
    brand: grab(code, /brand="([^"\n]*)/),
    cartBadge: /cart=\{cart\}/.test(code),
    state: /useState\(0\)/.test(code),
    hero: /<Hero\b/.test(code),
    title: grab(code, /title="([^"\n]*)/),
    grid: /<Grid\b/.test(code),
    cols,
    card: /<Card\b/.test(code),
    spread: /\{\.\.\.b\}/.test(code),
    add: /onAdd=\{\(\) => setCart\(\(n\) => n \+ 1\)\}/.test(code),
    beans: [...code.matchAll(/\{ name: "([^"\n]*)"?(?:, price: (\d*))?/g)].map((m) => ({ name: m[1], price: m[2] ?? "" })),
    checkout: /<Checkout\b/.test(code),
    courier: grab(code, /courier="([^"\n]*)/),
    closed: /<\/Page>/.test(code) && code.trimEnd().endsWith("}"),
  };
}

/** Human label for what the last edit re-rendered. */
function changed(a: View | null, b: View): string | null {
  if (!a) return b.page ? "<Page> mounted" : null;
  const checks: [boolean, string][] = [
    [a.page !== b.page, "<Page> mounted"],
    [a.bg !== b.bg, `<Page> bg="${b.bg ?? ""}"`],
    [a.accent !== b.accent, `<Page> accent="${b.accent ?? ""}"`],
    [a.nav !== b.nav || a.brand !== b.brand, "<Nav> brand"],
    [a.cartBadge !== b.cartBadge, "<Nav> cart={cart}"],
    [a.state !== b.state, "useState(0)"],
    [a.hero !== b.hero || a.title !== b.title, "<Hero> title"],
    [a.grid !== b.grid || a.cols !== b.cols, `<Grid> cols={${b.cols || ""}}`],
    [JSON.stringify(a.beans) !== JSON.stringify(b.beans), "beans[]"],
    [a.card !== b.card || a.spread !== b.spread, "<Card> props"],
    [a.add !== b.add, "<Card> onAdd wired"],
    [a.checkout !== b.checkout || a.courier !== b.courier, "<Checkout> courier"],
    [a.closed !== b.closed, "compiled ✓"],
  ];
  return checks.find(([c]) => c)?.[1] ?? null;
}

/** Which component the cursor is in, and which string prop it is typing into. */
function cursorInfo(code: string, cur: number) {
  const before = code.slice(0, cur);
  const tags = [...before.matchAll(/<\/?(Page|Nav|Hero|Grid|Card|Checkout)\b/g)];
  const owner = tags.length ? tags[tags.length - 1][1] : null;
  const typing = /brand="[^"\n]*$/.test(before)
    ? "brand"
    : /title="[^"\n]*$/.test(before)
      ? "title"
      : /courier="[^"\n]*$/.test(before)
        ? "courier"
        : null;
  const line = before.split("\n").length - 1;
  const col = cur - (before.lastIndexOf("\n") + 1);
  return { owner, typing, line, col };
}

/* ── Syntax highlighting (works on partial code) ─────────────────────────── */

const RULES: [RegExp, string][] = [
  [/\/\/.*/y, "tk-c"],
  [/"[^"\n]*"?/y, "tk-s"],
  [/\b(?:import|from|const|export|default|function|return)\b/y, "tk-k"],
  [/(?<=<\/?)[A-Z]\w*/y, "tk-t"],
  [/\b(?:useState|setCart|map)\b/y, "tk-f"],
  [/[A-Za-z_]\w*(?==)/y, "tk-a"],
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

type Seg = { text: string; cls: string; sel: boolean; caret?: boolean };

/** Split one line into styled runs, inserting the caret and selection. Pure. */
function segments(text: string, start: number, cur: number, sel: [number, number] | null): Seg[] {
  const cls = classify(text);
  const out: Seg[] = [];
  for (let i = 0; i <= text.length; i++) {
    const g = start + i;
    if (g === cur) out.push({ text: "", cls: "", sel: false, caret: true });
    if (i === text.length) break;
    const inSel = !!sel && g >= sel[0] && g < sel[1];
    const last = out[out.length - 1];
    if (last && !last.caret && last.cls === cls[i] && last.sel === inSel) last.text += text[i];
    else out.push({ text: text[i], cls: cls[i], sel: inSel });
  }
  return out;
}

/* ── Component ───────────────────────────────────────────────────────────── */

type Ui = { buf: string; cur: number; sel: [number, number] | null; v: View | null; status: string; idle: boolean; done: boolean };
type Pointer = { x: number; y: number; show: boolean; press: number | null };

const EMPTY: Ui = { buf: "", cur: 0, sel: null, v: null, status: "waiting for code", idle: true, done: false };
const VIS = 15; // visible editor lines
const LH = 20; // line height (px)
const SYNC = "#f37842"; // inspector colour, shared with the editor caret
const INK = "#22160f";
const MUTED = "#5f5248";
const SWATCH = ["#c98b5a", "#8a5a3b", "#4d3021"];

const delayFor = (chunk: string, fast?: boolean) => {
  if (chunk.startsWith("\n")) return fast ? 40 : 150;
  const base = fast ? 6 + Math.random() * 10 : 18 + Math.random() * 28;
  return /[,;{}()>]/.test(chunk) ? base + 45 : base;
};

export function LiveCodeHero() {
  const [ui, setUi] = useState<Ui>(EMPTY);
  const [cart, setCart] = useState(0);
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0, show: false, press: null });
  const [run, setRun] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const visibleRef = useRef(true);
  const [paused, setPaused] = useState(false);

  // Pause while the hero is scrolled out of view (saves CPU and battery).
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
      // Hold while the tab is hidden, the hero is off-screen, or the visitor paused it.
      while (alive && (document.hidden || !visibleRef.current || pausedRef.current)) await wait(250);
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ed = { buf: "", cur: 0, sel: null as [number, number] | null };
    let v: View | null = null;
    let status = EMPTY.status;
    let cartN = 0;

    const commit = (idle = false, done = false) => {
      const next = compile(ed.buf, v);
      status = changed(v, next) ?? status;
      v = next;
      setUi({ buf: ed.buf, cur: ed.cur, sel: ed.sel, v: next, status, idle, done });
    };

    const insert = (t: string) => {
      if (ed.sel) {
        ed.buf = ed.buf.slice(0, ed.sel[0]) + t + ed.buf.slice(ed.sel[1]);
        ed.cur = ed.sel[0] + t.length;
        ed.sel = null;
      } else {
        ed.buf = ed.buf.slice(0, ed.cur) + t + ed.buf.slice(ed.cur);
        ed.cur += t.length;
      }
    };

    const clickCard = async (i: number, onPress: () => void) => {
      const root = previewRef.current;
      const btn = root?.querySelector<HTMLElement>(`[data-add="${i}"]`);
      if (!root || !btn) return onPress();
      const r = root.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      setPointer({ x: r.width - 40, y: r.height - 30, show: true, press: null });
      await sleep(60);
      setPointer({ x: b.left - r.left + b.width * 0.55, y: b.top - r.top + b.height * 0.6, show: true, press: null });
      await sleep(760);
      setPointer((p) => ({ ...p, press: i }));
      onPress();
      await sleep(260);
      setPointer((p) => ({ ...p, press: null }));
      await sleep(500);
      setPointer((p) => ({ ...p, show: false }));
    };

    const apply = async (op: Op, instant: boolean) => {
      switch (op.k) {
        case "type": {
          if (instant) {
            insert(op.s);
            break;
          }
          for (let i = 0; i < op.s.length && alive; i++) {
            let chunk = op.s[i];
            if (chunk === "\n") while (op.s[i + 1] === " ") chunk += op.s[++i]; // auto-indent
            insert(chunk);
            commit();
            await sleep(delayFor(chunk, op.fast));
          }
          break;
        }
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
        case "select": {
          const at = ed.buf.indexOf(op.find);
          if (at >= 0) {
            const s = at + op.find.length;
            ed.sel = [s, s + op.len];
            ed.cur = s + op.len;
          }
          if (!instant) {
            commit(true);
            await sleep(200);
          }
          break;
        }
        case "click": {
          const cv = compile(ed.buf, v);
          if (!cv.add || !cv.state) break;
          const press = () => {
            cartN += 1;
            setCart(cartN);
            status = "onAdd → setCart(n + 1)";
            setUi((u) => ({ ...u, status }));
          };
          if (instant) press();
          else await clickCard(op.card, press);
          break;
        }
        case "end":
          ed.cur = ed.buf.length;
          ed.sel = null;
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
    setCart(0);
    setPointer({ x: 0, y: 0, show: false, press: null });
    setUi(EMPTY);
    setRun((r) => r + 1);
  };

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };

  const addByHand = () => {
    if (!ui.done) return;
    setCart((c) => c + 1);
    setUi((u) => ({ ...u, status: "onAdd → setCart(n + 1)" }));
  };

  /* Editor model */
  const lines = ui.buf.split("\n");
  const starts = lines.reduce<number[]>((acc, _l, i) => [...acc, i === 0 ? 0 : acc[i - 1] + lines[i - 1].length + 1], []);
  const info = cursorInfo(ui.buf, ui.cur);
  const top = Math.max(0, Math.min(info.line - (VIS - 4), lines.length - VIS));

  /* Preview model */
  const v = ui.v;
  const accent = v?.accent ?? INK;
  const owner = ui.done ? null : v?.page ? info.owner : null;
  const n = Math.min(Math.max(v?.cols || 1, 1), 4);
  const caret = <span className="ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.1em] animate-blink" style={{ background: SYNC }} />;
  const host = v?.brand ? `${v.brand.toLowerCase().replace(/[^a-z0-9]/g, "") || "localhost"}.shop` : "localhost:3000";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={ui.done ? replay : togglePause}
        aria-label={ui.done ? "Replay the live-code demo" : paused ? "Play the live-code demo" : "Pause the live-code demo"}
        className="absolute -top-12 right-0 z-20 inline-flex min-h-9 items-center gap-2 rounded-full border border-line-strong bg-[#0c0c0c]/80 px-3.5 font-mono text-xs text-ink backdrop-blur transition-colors hover:border-orange hover:text-orange"
      >
        <span aria-hidden="true">{ui.done ? "↻" : paused ? "▶" : "❚❚"}</span>
        {ui.done ? "Replay" : paused ? "Play" : "Pause"}
      </button>
    <div className="relative mx-auto grid w-full max-w-xl items-center lg:max-w-none lg:grid-cols-[0.92fr_1.08fr]" aria-hidden="true">
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(243,120,66,0.12),transparent)] blur-2xl" />

      {/* ── Live preview ── */}
      <div className="ml-auto w-[94%] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 lg:order-2 lg:w-full">
        <div className="flex items-center gap-2 border-b border-black/10 bg-[#ebe6df] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white/80 px-3 py-1 font-mono text-[10px] text-[#4a4038]">{host}</span>
        </div>
        <div
          ref={previewRef}
          className="relative h-[430px] overflow-hidden transition-colors duration-500 lg:h-[410px]"
          style={{ background: v?.page ? (v.bg ?? "#ffffff") : "#f3f2f0", color: INK }}
        >
          {!v?.page && (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-[#5f5f5f]">
              waiting for <span className="mx-1 text-[#22160f]">&lt;Page&gt;</span>…
            </div>
          )}

          {v?.page && (
            <div className="mount flex h-full flex-col gap-4 p-5 pb-14 lg:pb-5 lg:pl-14">
              <Inspect on={owner === "Page"} label="<Page>" inset />

              {v.nav && (
                <Box c="Nav" owner={owner}>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-extrabold tracking-tight">
                      {v.brand}
                      {info.typing === "brand" && !ui.done && caret}
                    </span>
                    {v.cartBadge && (
                      <span className="mount inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white" style={{ background: accent }}>
                        Cart
                        <span key={cart} className="bump inline-block min-w-[0.6em] text-center">
                          {v.state ? cart : "?"}
                        </span>
                      </span>
                    )}
                  </div>
                </Box>
              )}

              {v.hero && (
                <Box c="Hero" owner={owner}>
                  <div className="grid min-h-[78px] grid-cols-[1.5fr_1fr] items-center gap-3">
                    <p className="text-[22px] font-extrabold leading-[1.04] tracking-tight sm:text-[26px]">
                      {v.title}
                      {info.typing === "title" && !ui.done && caret}
                    </p>
                    <div className="mount aspect-[4/3] rounded-xl bg-[radial-gradient(circle_at_30%_30%,#d9a066,#7a4524_60%,#3a1f10)]" />
                  </div>
                </Box>
              )}

              {v.grid && (
                <Box c="Grid" owner={owner}>
                  <div className="grid gap-2.5 transition-[grid-template-columns] duration-500" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                    {v.card
                      ? v.beans.map((b, i) => (
                          <div key={i} className="mount rounded-xl bg-white/75 p-2 ring-1 ring-black/5" style={{ animationDelay: `${i * 70}ms` } as CSSProperties}>
                            <div className="h-11 rounded-lg sm:h-14" style={{ background: SWATCH[i % SWATCH.length] }} />
                            <div className="mt-1.5 flex items-baseline justify-between gap-1 text-[11px] font-semibold">
                              {v.spread ? (
                                <>
                                  <span className="truncate">{b.name}</span>
                                  {b.price && <span style={{ color: accent }}>${b.price}</span>}
                                </>
                              ) : (
                                <span className="my-1 h-2 w-2/3 rounded bg-black/10" />
                              )}
                            </div>
                            {v.add && (
                              <button
                                type="button"
                                tabIndex={-1}
                                data-add={i}
                                onClick={addByHand}
                                className={`mount mt-1.5 w-full rounded-md py-1 text-[10px] font-semibold text-white transition-transform duration-150 ${
                                  pointer.press === i ? "scale-90 ring-4 ring-black/15" : ui.done ? "hover:scale-[1.03]" : ""
                                }`}
                                style={{ background: accent }}
                              >
                                Add to cart
                              </button>
                            )}
                          </div>
                        ))
                      : Array.from({ length: n }, (_, i) => (
                          <div key={i} className="flex h-[92px] items-center justify-center rounded-xl border border-dashed border-black/20 font-mono text-[9px] text-[#5f5248]">
                            slot {i + 1}
                          </div>
                        ))}
                  </div>
                </Box>
              )}

              {v.checkout && (
                <Box c="Checkout" owner={owner}>
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-[11px] ring-1 ring-black/10">
                    <span className="font-semibold">
                      Checkout{cart > 0 && ` · ${cart} item${cart > 1 ? "s" : ""}`}
                    </span>
                    {v.courier === "auto" ? (
                      <span className="font-semibold text-[#15803d]">✓ courier booked automatically</span>
                    ) : (
                      <span className="font-mono text-[10px]" style={{ color: MUTED }}>
                        courier=&quot;{v.courier ?? ""}
                        {info.typing === "courier" && caret}&quot;
                      </span>
                    )}
                  </div>
                </Box>
              )}
            </div>
          )}

          {/* Simulated pointer */}
          <svg
            viewBox="0 0 24 24"
            className={`pointer-events-none absolute left-0 top-0 z-20 h-6 w-6 drop-shadow-md transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${pointer.show ? "opacity-100" : "opacity-0"}`}
            style={{ transform: `translate(${pointer.x}px, ${pointer.y}px) scale(${pointer.press !== null ? 0.85 : 1})` }}
          >
            <path d="M3 2l7 19 2.5-7.5L20 11z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── Editor ── */}
      <div className="relative z-10 -mt-10 w-[94%] overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/95 shadow-2xl shadow-black/70 backdrop-blur sm:w-[90%] lg:order-1 lg:-mr-10 lg:mt-0 lg:w-auto lg:translate-y-8">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-[#d9d3cb]">
            store.tsx
            {!ui.done && <span className="h-1.5 w-1.5 rounded-full" style={{ background: SYNC }} />}
          </span>
          <span className="ml-auto flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${v?.closed ? "bg-emerald-400/15 text-emerald-300" : "bg-orange/15 text-orange"}`}>
              {v?.closed ? "● live" : "● compiling"}
            </span>
          </span>
        </div>

        <div className="relative h-[324px] overflow-hidden py-3 font-mono text-[9.5px] sm:text-[12px]">
          <div className="transition-transform duration-300 ease-out" style={{ transform: `translateY(${-top * LH}px)` }}>
            {lines.map((text, i) => (
              <div key={i} className={`flex h-5 items-center whitespace-pre pr-4 leading-5 ${i === info.line && !ui.done ? "bg-white/[0.045]" : ""}`}>
                <span className={`w-9 shrink-0 select-none pr-3 text-right ${i === info.line && !ui.done ? "text-[#d9d3cb]" : "text-[#77706a]"}`}>{i + 1}</span>
                <span>
                  {segments(text, starts[i], ui.cur, ui.sel).map((s, j) =>
                    s.caret ? (
                      <span
                        key={j}
                        className={`relative -mr-[2px] inline-block h-[1.15em] w-[2px] translate-y-[2px] ${ui.idle ? "animate-blink" : ""}`}
                        style={{ background: SYNC }}
                      />
                    ) : (
                      <span key={j} className={`${s.cls} ${s.sel ? "bg-orange/35" : ""}`}>
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
            <span style={{ color: SYNC }}>⚡ HMR</span>
            <span key={ui.status} className="mount truncate text-[#d9d3cb]">
              {ui.status}
            </span>
          </span>
          <span className="shrink-0">
            Ln {info.line + 1}, Col {info.col + 1}
          </span>
        </div>
      </div>
    </div>
    </div>
  );
}

/** A rendered component in the preview, outlined when the editor cursor is inside its code. */
function Box({ c, owner, children }: { c: string; owner: string | null; children: ReactNode }) {
  return (
    <div data-c={c} className="mount relative">
      {children}
      <Inspect on={owner === c} label={`<${c}>`} />
    </div>
  );
}

function Inspect({ on, label, inset = false }: { on: boolean; label: string; inset?: boolean }) {
  return (
    <>
      <span
        className={`pointer-events-none absolute rounded-lg border border-dashed transition-opacity duration-200 ${inset ? "inset-2" : "-inset-1.5"} ${on ? "opacity-100" : "opacity-0"}`}
        style={{ borderColor: SYNC }}
      />
      <span
        className={`pointer-events-none absolute z-10 rounded px-1.5 py-px font-mono text-[9px] font-semibold text-[#0c0c0c] transition-opacity duration-200 ${
          inset ? "left-2 top-2" : "-top-[19px] left-0"
        } ${on ? "opacity-100" : "opacity-0"}`}
        style={{ background: SYNC }}
      >
        {label}
      </span>
    </>
  );
}
