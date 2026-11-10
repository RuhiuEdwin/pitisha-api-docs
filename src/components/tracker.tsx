"use client";

import { Check, Circle, RotateCcw } from "lucide-react";
import { createContext, useContext, type ReactNode } from "react";
import { useLocal } from "@/components/prefs";

interface T { done: Set<string>; toggle: (id: string) => void; reset: () => void; ids: string[]; titles: string[] }
const Ctx = createContext<T | null>(null);
const useT = () => { const c = useContext(Ctx); if (!c) throw new Error("Tracker missing"); return c; };

/** Quickstart and recipe progress, saved on this device only. */
export function Tracker({ storageKey, steps, children }: { storageKey: string; steps: { id: string; title: string }[]; children: ReactNode }) {
  const [list, setList] = useLocal<string[]>(`tefo-docs-progress-${storageKey}`, []);
  const done = new Set(list);
  const value: T = { done, ids: steps.map((s) => s.id), titles: steps.map((s) => s.title), toggle: (id) => setList(done.has(id) ? list.filter((x) => x !== id) : [...list, id]), reset: () => setList([]) };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function ProgressBar() {
  const { done, ids, titles, reset } = useT();
  const n = ids.filter((i) => done.has(i)).length;
  const nextIdx = ids.findIndex((i) => !done.has(i));
  return (
    <div className="sticky top-16 z-10 my-5 rounded-[var(--pd-radius-sm)] border border-edge bg-canvas/95 p-3 backdrop-blur" aria-label="Progress">
      <div className="flex flex-wrap items-center gap-3">
        <p id="qs-count" className="pd-num text-[14px] font-medium">{n} of {ids.length} steps done</p>
        <progress className="h-2 min-w-24 flex-1 accent-[var(--pd-accent-text)]" value={n} max={ids.length} aria-labelledby="qs-count" />
        {n > 0 && <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-[13px] text-fg-muted underline"><RotateCcw size={13} aria-hidden="true" />Start over</button>}
      </div>
      <ol className="mt-2 hidden flex-wrap gap-2 sm:flex" aria-label="Steps">
        {ids.map((id, i) => (
          <li key={id}><a href={`#${id}`} aria-current={i === nextIdx ? "step" : undefined} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-edge px-3 text-[12.5px] hover:shadow-pd-md aria-[current=step]:border-[var(--pd-accent-text)] aria-[current=step]:font-medium">{done.has(id) ? <Check size={12} aria-hidden="true" /> : <Circle size={12} aria-hidden="true" />}<span className="pd-vh">{done.has(id) ? "Done: " : i === nextIdx ? "Next: " : "To do: "}</span>{i + 1}. {titles[i]}</a></li>
        ))}
      </ol>
      <p role="status" className="pd-vh">{n === ids.length ? "All steps done" : ""}</p>
    </div>
  );
}

export function StepShell({ id, index, title, children }: { id: string; index: number; title: string; children: ReactNode }) {
  const { done, toggle } = useT();
  const on = done.has(id);
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-40 border-t border-edge py-8">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-edge-strong font-mono text-[13px] data-[on=true]:border-[var(--pd-ok)] data-[on=true]:bg-ok-bg" data-on={on}>{on ? <Check size={15} /> : index}</span>
        <h2 id={`${id}-h`} className="pd-h3 flex-1 pt-0.5">{title}</h2>
        <label className="-mt-1 flex min-h-11 shrink-0 cursor-pointer items-center gap-2 text-[13px]"><input type="checkbox" checked={on} onChange={() => toggle(id)} className="h-5 w-5 accent-[var(--pd-accent-text)]" /><span>Mark done</span></label>
      </div>
      <div className="mt-3 grid gap-4 sm:pl-11">{children}</div>
    </section>
  );
}
