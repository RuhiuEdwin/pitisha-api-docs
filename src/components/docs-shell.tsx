"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface NavGroup { group: string; items: { href: string; label: string; method?: string }[] }
interface SearchItem { title: string; href: string; kind: string; text: string }

const MC: Record<string, string> = { GET: "text-ok", POST: "text-gold-d", PATCH: "text-sky-700", DELETE: "text-err" };

function Mark() {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true"><rect x="3" y="2" width="4.5" height="20" fill="#0A1628" /><rect x="16.5" y="2" width="4.5" height="20" fill="#0A1628" /><rect x="7.5" y="14.2" width="9" height="2.6" fill="#E3BF74" /></svg>;
}

function Nav({ nav, onNav }: { nav: NavGroup[]; onNav?: () => void }) {
  const path = usePathname();
  return (
    <nav aria-label="Documentation" className="grid gap-6 pb-10 text-[13.5px]">
      {nav.map((g) => (
        <div key={g.group}>
          <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide text-muted">{g.group}</p>
          <ul>
            {g.items.map((i) => {
              const on = path === i.href.split("#")[0] && !i.href.includes("#");
              return (
                <li key={i.href}>
                  {i.href.endsWith(".json") ? <a href={i.href} className="flex rounded-md px-2 py-1.5 text-muted hover:bg-ivory hover:text-ink">{i.label}</a> :
                    <Link href={i.href} onClick={onNav} aria-current={on ? "page" : undefined} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-ivory", on ? "bg-ivory font-medium text-ink" : "text-muted hover:text-ink")}>
                      {i.method && <span className={cn("w-11 shrink-0 font-mono text-[10px] font-medium", MC[i.method])}>{i.method}</span>}{i.label}
                    </Link>}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SearchBox({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) { d.showModal(); setTimeout(() => input.current?.focus(), 0); }
    if (!open && d.open) d.close();
  }, [open]);
  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return items.filter((i) => ["Guide", "Resource"].includes(i.kind)).slice(0, 8);
    const words = n.split(/\s+/);
    return items.map((i) => {
      const t = i.title.toLowerCase(), x = (i.kind + " " + i.text).toLowerCase();
      let s = 0;
      for (const w of words) { if (t.includes(w)) s += 5; else if (x.includes(w)) s += 1; else return { i, s: -1 }; }
      return { i, s };
    }).filter((r) => r.s > 0).sort((a, b) => b.s - a.s).slice(0, 10).map((r) => r.i);
  }, [q, items]);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-line bg-ivory px-3 text-[13px] text-muted hover:border-ink">
        <Search size={15} /><span className="flex-1 text-left">Search the docs</span><kbd className="rounded border border-line bg-paper px-1.5 text-[11px]">Ctrl K</kbd>
      </button>
      <dialog ref={ref} onClose={() => setOpen(false)} onClick={(e) => e.target === ref.current && setOpen(false)} className="m-auto mt-[12vh] w-[min(560px,calc(100vw-24px))] rounded-2xl bg-paper p-0 shadow-2xl backdrop:bg-night/55">
        <div className="flex items-center gap-2 border-b border-line px-4"><Search size={16} className="text-muted" /><input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides and endpoints" aria-label="Search the docs" className="h-12 flex-1 bg-transparent text-[15px] outline-none" /><button aria-label="Close search" onClick={() => setOpen(false)} className="rounded p-1 text-muted hover:bg-ivory"><X size={16} /></button></div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.map((r) => <li key={r.href + r.title}><Link href={r.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-ivory"><span className="text-[14px] font-medium">{r.title}</span><span className="ml-2 font-mono text-[11px] text-muted">{r.kind}</span></Link></li>)}
          {results.length === 0 && <li className="px-3 py-8 text-center text-[13px] text-muted">Nothing found for &ldquo;{q}&rdquo;.</li>}
        </ul>
      </dialog>
    </>
  );
}

export function DocsShell({ nav, items, children }: { nav: NavGroup[]; items: SearchItem[]; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2">Skip to content</a>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-paper/90 px-4 backdrop-blur lg:px-6">
        <button className="rounded-md p-2 hover:bg-ivory lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={20} /></button>
        <Link href="/" className="flex items-center gap-2.5"><Mark /><span className="text-[15px] font-medium">Pitisha</span><span className="rounded-md bg-night px-2 py-0.5 text-[11px] font-medium text-gold">API</span></Link>
        <div className="ml-auto flex flex-1 justify-end"><SearchBox items={items} /></div>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 bg-night/50" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-paper p-4"><button aria-label="Close menu" onClick={() => setOpen(false)} className="mb-2 rounded p-1.5 hover:bg-ivory"><X size={18} /></button><Nav nav={nav} onNav={() => setOpen(false)} /></div></div>
      )}
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto border-r border-line px-4 py-6 lg:block"><Nav nav={nav} /></aside>
        <main id="content" className="min-w-0 px-4 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
