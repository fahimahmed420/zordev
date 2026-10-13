"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type Option = { value: string; label: string };

/** Accessible custom select (listbox) that posts its value through a hidden input. */
export function Select({
  name,
  options,
  placeholder,
  defaultValue = "",
  invalid,
  describedBy,
}: {
  name: string;
  options: Option[];
  placeholder: string;
  defaultValue?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const choose = (i: number) => {
    setValue(options[i].value);
    setOpen(false);
  };

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const onKey = (e: KeyboardEvent) => {
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") setActive((a) => Math.min(options.length - 1, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(options.length - 1);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape") return setOpen(false);
    else if (e.key === "Tab") return choose(active); // keep the highlighted option when tabbing away
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      // Typeahead: jump to the next option starting with the typed letter.
      const k = e.key.toLowerCase();
      const n = options.length;
      for (let step = 1; step <= n; step++) {
        const i = (active + step) % n;
        if (options[i].label.toLowerCase().startsWith(k)) {
          setActive(i);
          break;
        }
      }
    }
    else return;
    e.preventDefault();
  };

  return (
    <div ref={root} className="relative mt-1.5">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        id={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid}
        aria-required="true"
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-[#0f0f0f] px-4 py-3 text-left transition-colors focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30 ${
          invalid ? "border-red-400" : open ? "border-orange" : "border-line-strong hover:border-ink"
        }`}
      >
        <span className={current ? "text-ink" : "text-[#8a847c]"}>{current?.label ?? placeholder}</span>
        <svg viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${open ? "rotate-180 text-orange" : ""}`} aria-hidden="true">
          <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <ul
        id={listId}
        role="listbox"
        aria-labelledby={name + "-label"}
        className={`absolute left-0 right-0 z-30 mt-2 origin-top overflow-hidden rounded-xl border border-line-strong bg-[#141414] p-1.5 shadow-2xl shadow-black/60 transition-all duration-200 ${
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        {options.map((o, i) => {
          const selected = o.value === value;
          return (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={selected}
              onPointerEnter={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                i === active ? "bg-orange text-[#0c0c0c]" : selected ? "text-orange hover:bg-orange hover:text-[#0c0c0c]" : "text-ink hover:bg-orange hover:text-[#0c0c0c]"
              }`}
            >
              {o.label}
              {selected && <span aria-hidden="true">✓</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
