"use client";

import { CircleX, RotateCw, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FAILURE_CODES, RETRY_LABEL, type Retry } from "@/content/api";

export interface ExplorerError { code: string; status: number; meaning: string; cause: string; fix: string; retry: Retry; usedBy: { label: string; href: string }[] }

const CLASSES = [{ id: "all", label: "All" }, { id: "4", label: "4xx: your request" }, { id: "5", label: "5xx: our side" }];

/** Code, meaning, cause and fix. Filter by text or by who is at fault. Each error has its own link. */
export function ErrorExplorer({ errors }: { errors: ExplorerError[] }) {
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("all");
  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return errors.filter((e) => (cls === "all" || String(e.status).startsWith(cls)) && (!n || `${e.code} ${e.status} ${e.meaning} ${e.cause} ${e.fix}`.toLowerCase().includes(n)));
  }, [errors, q, cls]);
  return (
    <section id="explorer" aria-labelledby="explorer-h" className="mt-10 scroll-mt-24">
      <h2 id="explorer-h" className="pd-h2">Error explorer</h2>
      <p className="mt-2 max-w-[68ch] text-fg-muted">Find an error by its code, its status or a word from the message. Branch your code on <code className="font-mono">error.code</code>, never on <code className="font-mono">error.message</code>.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex min-h-11 min-w-0 flex-1 basis-60 items-center gap-2 rounded-[var(--pd-radius-sm)] border border-edge-strong bg-surface px-3"><Search size={16} aria-hidden="true" className="text-fg-muted" /><span className="pd-vh">Filter errors</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by code, status or word" className="min-w-0 flex-1 bg-transparent outline-none" /></label>
        <div role="group" aria-label="Whose side" className="flex flex-wrap gap-2">{CLASSES.map((c) => <button key={c.id} type="button" aria-pressed={cls === c.id} onClick={() => setCls(c.id)} className="min-h-11 rounded-full border border-edge-strong px-4 text-[13px] aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-canvas hover:bg-sunken aria-pressed:hover:bg-fg">{c.label}</button>)}</div>
      </div>
      <p role="status" className="mt-3 text-[13px] text-fg-muted">{shown.length} of {errors.length} errors</p>
      {shown.length === 0 && <p className="mt-4 rounded-[var(--pd-radius-sm)] border border-edge p-6 text-center text-fg-muted">No error matches. Clear the filter to see all of them.</p>}
      <ul className="mt-2 grid gap-3">
        {shown.map((e) => (
          <li key={e.code} id={`err-${e.code}`} className="scroll-mt-24 rounded-[var(--pd-radius-lg)] bg-surface shadow-pd-sm p-4 target:shadow-pd-md">
            <div className="flex flex-wrap items-center gap-2">
              <code className="font-mono text-[14px] font-medium">{e.code}</code>
              <span className="inline-flex items-center gap-1 rounded-full border border-edge-strong px-2 text-[12px]"><CircleX size={12} aria-hidden="true" />HTTP {e.status}</span>
              <a href={`#err-${e.code}`} className="ml-auto text-[12px] text-fg-muted underline">Link</a>
            </div>
            <dl className="mt-3 grid gap-3 text-[14px] md:grid-cols-3">
              <div><dt className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">Meaning</dt><dd className="mt-0.5">{e.meaning}</dd></div>
              <div><dt className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">Likely cause</dt><dd className="mt-0.5">{e.cause}</dd></div>
              <div><dt className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">Fix</dt><dd className="mt-0.5">{e.fix}</dd></div>
            </dl>
            <p className="mt-3 flex items-start gap-2 text-[13px] text-fg-muted"><RotateCw size={14} aria-hidden="true" className="mt-0.5 shrink-0" />{RETRY_LABEL[e.retry]}</p>
            {e.usedBy.length > 0 && <p className="mt-2 text-[13px] text-fg-muted">Returned by: {e.usedBy.map((u, i) => <span key={u.href}>{i > 0 && ", "}<Link href={u.href} className="underline">{u.label}</Link></span>)}</p>}
          </li>
        ))}
      </ul>
      <h3 className="mt-10 text-[17px] font-medium">Failure codes on a collection</h3>
      <p className="mt-1 max-w-[68ch] text-[14px] text-fg-muted">A collection that ends as <code className="font-mono">failed</code> carries <code className="font-mono">failure.code</code>. These describe what happened to the payment. They are not HTTP errors, even where a name matches one.</p>
      <div className="table-wrap mt-3" role="region" aria-label="Failure codes, scrolls sideways" tabIndex={0}>
        <table className="w-full min-w-[22rem] border-collapse text-[14px]"><thead><tr className="text-left"><th scope="col" className="border-b border-edge py-2 pr-4">Code</th><th scope="col" className="border-b border-edge py-2">Meaning</th></tr></thead><tbody>{FAILURE_CODES.map((f) => <tr key={f.code}><td className="border-b border-edge py-2 pr-4"><code className="font-mono">{f.code}</code></td><td className="border-b border-edge py-2 text-fg-muted">{f.meaning}</td></tr>)}</tbody></table>
      </div>
    </section>
  );
}
