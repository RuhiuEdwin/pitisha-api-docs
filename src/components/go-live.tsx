"use client";

import { Check, Code2, Copy, LayoutDashboard, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocal } from "@/components/prefs";
import { ALL_CHECK_ITEMS, GOLIVE, goLiveMarkdown } from "@/content/golive";
import { PORTAL_URL } from "@/content/config";

/** Mirrors the partners portal: build in the sandbox, set up in Settings and security, request live access, then watch. Progress is saved on this device only. */
export function GoLiveChecklist() {
  const [done, setDone] = useLocal<string[]>("tefo-docs-golive", []);
  const [copied, setCopied] = useState(false);
  const set = new Set(done);
  const toggle = (id: string) => setDone(set.has(id) ? done.filter((x) => x !== id) : [...done, id]);
  const total = ALL_CHECK_ITEMS.length;
  const n = ALL_CHECK_ITEMS.filter((i) => set.has(i.id)).length;
  const copy = async () => { try { await navigator.clipboard.writeText(goLiveMarkdown(set)); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ } };
  return (
    <div>
      <p className="max-w-[68ch]">Live access is reviewed by Tefo before it is enabled. Work through this list in the sandbox first. The steps after &ldquo;Build&rdquo; are the ones the partners portal asks for under <strong>Settings and security</strong>{PORTAL_URL ? <> (<a className="underline" href={PORTAL_URL}>open the portal</a>)</> : ""}: the status goes from onboarding, to in review, to live.</p>
      <div className="sticky top-16 z-10 -mx-1 my-4 rounded-[var(--pd-radius-sm)] border border-edge bg-canvas/95 p-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <p className="pd-num text-[14px] font-medium" id="gl-count">{n} of {total} done</p>
          <progress className="h-2 min-w-32 flex-1 accent-[var(--pd-accent-text)]" value={n} max={total} aria-labelledby="gl-count" />
          <button type="button" onClick={copy} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--pd-radius-sm)] border border-edge-strong px-3 text-[13px] hover:bg-sunken">{copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied ? "Copied" : "Copy as Markdown"}</button>
          <button type="button" disabled={n === 0} onClick={() => setDone([])} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--pd-radius-sm)] px-3 text-[13px] text-fg-muted underline disabled:no-underline disabled:opacity-50"><RotateCcw size={14} aria-hidden="true" />Reset</button>
        </div>
        <p className="mt-1 text-[12px] text-fg-muted">Ticks are saved on this device only.</p>
        <span className="pd-vh" role="status">{copied ? "Checklist copied as Markdown" : ""}</span>
      </div>
      {GOLIVE.map((ph, pi) => {
        const pn = ph.items.filter((i) => set.has(i.id)).length;
        return (
          <section key={ph.id} id={ph.id} aria-labelledby={`${ph.id}-h`} className="mt-8 scroll-mt-24">
            <h2 id={`${ph.id}-h`} className="pd-h3 flex flex-wrap items-baseline gap-x-3"><span className="font-mono text-[13px] text-fg-muted">{pi + 1}</span>{ph.title}<span className="pd-num text-[13px] font-normal text-fg-muted">{pn} of {ph.items.length}</span></h2>
            <p className="mt-1 text-[14px] text-fg-muted">{ph.blurb}</p>
            <ul className="mt-3 divide-y divide-edge rounded-[var(--pd-radius-lg)] bg-surface shadow-pd-sm">
              {ph.items.map((i) => (
                <li key={i.id} className="flex items-start gap-3 px-4 py-3">
                  <input id={`c-${i.id}`} type="checkbox" checked={set.has(i.id)} onChange={() => toggle(i.id)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--pd-accent-text)]" />
                  <label htmlFor={`c-${i.id}`} className="-my-3 min-h-11 flex-1 cursor-pointer py-3 text-[14.5px]">
                    <span className={set.has(i.id) ? "text-fg-muted line-through" : ""}>{i.text}</span>
                    {i.help && <span className="mt-0.5 block text-[13px] text-fg-muted">{i.help}</span>}
                  </label>
                  <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-edge px-2 text-[11px] text-fg-muted">{i.where === "portal" ? <LayoutDashboard size={11} aria-hidden="true" /> : <Code2 size={11} aria-hidden="true" />}{i.where === "portal" ? "Portal" : "Your code"}</span>
                  {i.href && <Link href={i.href} className="mt-0.5 shrink-0 text-[13px] underline">How</Link>}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
