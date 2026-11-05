"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KINDS, SUGGESTED, highlight, search, words, type SearchDoc, type SearchKind } from "@/lib/search";

type Load = "idle" | "loading" | "ready" | "error";

function Marked({ text, ws }: { text: string; ws: string[] }) {
  return <>{highlight(text, ws).map((s, i) => (s.hit ? <mark key={i} className="hit">{s.text}</mark> : <span key={i}>{s.text}</span>))}</>;
}

/** Cmd or Ctrl K, or "/" . Native dialog (focus trap, Escape, focus return) with a combobox inside it. */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [load, setLoad] = useState<Load>("idle");
  const [q, setQ] = useState("");
  const [kinds, setKinds] = useState<SearchKind[]>([]);
  const [cursor, setCursor] = useState(0);

  const fetchIndex = useCallback(() => {
    setLoad("loading");
    fetch("/search-index.json").then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).then((d: SearchDoc[]) => { setDocs(d); setLoad("ready"); }).catch(() => setLoad("error"));
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setTimeout(() => input.current?.focus(), 0);
      // The index is only fetched the first time search opens.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (load === "idle") fetchIndex();
    }
    if (!open && d.open) d.close();
  }, [open, load, fetchIndex]);

  const ws = useMemo(() => words(q), [q]);
  const hits = useMemo(() => (ws.length ? search(docs, q, { kinds, limit: 40 }).map((h) => h.doc) : []), [docs, q, kinds, ws.length]);
  // Groups follow the best hit in each, so an exact error match is not buried under a vague guide section.
  const groups = useMemo(() => [...new Set(hits.map((h) => h.kind))].map((k) => ({ kind: k, items: hits.filter((h) => h.kind === k) })), [hits]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const starts = useMemo(() => groups.map((_, gi) => groups.slice(0, gi).reduce((a, g) => a + g.items.length, 0)), [groups]);

  const go = (d: SearchDoc) => { onClose(); router.push(d.href); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === "Enter" && flat[cursor]) { e.preventDefault(); go(flat[cursor]); }
  };
  const toggle = (k: SearchKind) => { setKinds((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k])); setCursor(0); };
  const listId = "search-results";

  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-label="Search the docs" className="m-auto mt-[8vh] w-[min(640px,calc(100vw-24px))] rounded-[var(--pd-radius-lg)] border border-edge bg-surface p-0 text-fg shadow-pd-overlay">
      <div className="flex items-center gap-2 border-b border-edge px-4">
        <Search size={18} aria-hidden="true" className="shrink-0 text-fg-muted" />
        <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setCursor(0); }} onKeyDown={onKey} role="combobox" aria-expanded={flat.length > 0} aria-controls={listId} aria-activedescendant={flat.length ? `sr-${cursor}` : undefined} aria-autocomplete="list" autoComplete="off" spellCheck={false} placeholder="Search guides, endpoints, errors and events" aria-label="Search the docs" className="h-14 min-w-0 flex-1 bg-transparent text-[16px] outline-none" />
        <button type="button" aria-label="Close search" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-md text-fg-muted hover:bg-sunken"><X size={18} aria-hidden="true" /></button>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-edge px-4 py-2" role="group" aria-label="Filter by type">
        {KINDS.map((k) => <button key={k} type="button" aria-pressed={kinds.includes(k)} onClick={() => toggle(k)} className="min-h-9 rounded-full border border-edge px-3 text-[12.5px] aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-canvas hover:shadow-pd-md">{k}</button>)}
      </div>
      <div className="max-h-[52vh] overflow-y-auto p-2" aria-busy={load === "loading"}>
        {load === "loading" && <p role="status" className="px-3 py-8 text-center text-[14px] text-fg-muted">Loading the search index&hellip;</p>}
        {load === "error" && <div role="alert" className="px-3 py-8 text-center text-[14px]"><p>Search could not load.</p><p className="mt-1 text-fg-muted">Use the sidebar to browse, or try again.</p><button type="button" onClick={fetchIndex} className="mt-3 min-h-11 rounded-md border border-edge px-4 hover:shadow-pd-md">Try again</button></div>}
        {load === "ready" && !ws.length && (
          <div className="px-3 py-4 text-[14px]"><p className="text-fg-muted">Try a word, an endpoint, an error code or an event name.</p><ul className="mt-3 flex flex-wrap gap-2">{SUGGESTED.map((s) => <li key={s}><button type="button" onClick={() => setQ(s)} className="min-h-9 rounded-full bg-sunken px-3 font-mono text-[12.5px] hover:bg-edge">{s}</button></li>)}</ul></div>
        )}
        {load === "ready" && ws.length > 0 && flat.length === 0 && <p role="status" className="px-3 py-8 text-center text-[14px] text-fg-muted">Nothing found for &ldquo;{q}&rdquo;. Try fewer words, or remove a filter.</p>}
        <div id={listId} role="listbox" aria-label="Results">
          {groups.map((g, gi) => (
            <div key={g.kind} role="group" aria-label={g.kind}>
              <p className="px-3 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wider text-fg-muted">{g.kind}</p>
              {g.items.map((d, k) => { const i = starts[gi] + k; return (
                <div key={d.href + d.title} id={`sr-${i}`} role="option" aria-selected={i === cursor} onMouseMove={() => setCursor(i)} onClick={() => go(d)} className="cursor-pointer rounded-lg px-3 py-2 aria-selected:bg-sunken">
                  <div className="flex items-baseline gap-2"><span className="text-[14px] font-medium"><Marked text={d.title} ws={ws} /></span><span className="rounded border border-edge px-1.5 text-[10.5px] text-fg-muted">{d.kind}</span></div>
                  <p className="truncate text-[12.5px] text-fg-muted"><Marked text={d.hint} ws={ws} /></p>
                </div>
              ); })}
            </div>
          ))}
        </div>
      </div>
      <p className="flex flex-wrap gap-x-4 gap-y-1 border-t border-edge px-4 py-2 text-[12px] text-fg-muted"><span><kbd>↑</kbd> <kbd>↓</kbd> to move</span><span><kbd>Enter</kbd> to open</span><span><kbd>Esc</kbd> to close</span></p>
      <span className="pd-vh" role="status">{load === "ready" && ws.length ? `${flat.length} results` : ""}</span>
    </dialog>
  );
}
