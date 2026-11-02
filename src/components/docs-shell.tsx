"use client";

import { ChevronDown, Menu, Moon, Search, Sun, X, Activity } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PrefsProvider, usePrefs } from "@/components/prefs";
import { SearchDialog } from "@/components/search-dialog";
import { BaseUrl, EnvSwitcher } from "@/components/env";
import { cn } from "@/lib/cn";
import type { NavGroup } from "@/lib/docs";

const MC: Record<string, string> = { GET: "text-ok", POST: "text-accent-text", PATCH: "text-info", DELETE: "text-err" };

function Mark() {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true"><path d="M9.6 4.2V14.1a4.4 4.4 0 0 0 4.4 4.4" fill="none" stroke="#F3EBDD" stroke-width="3.3" stroke-linecap="round"/><path d="M5.4 9.1H14.2" fill="none" stroke="#F3EBDD" stroke-width="3.3" stroke-linecap="round"/><circle cx="19.1" cy="18.5" r="2.35" fill="#7FE3CB"/></svg>;
}

function Nav({ nav, onNav }: { nav: NavGroup[]; onNav?: () => void }) {
  const path = usePathname();
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  return (
    <nav aria-label="Documentation" className="grid gap-1 text-[14px]">
      {nav.map((g) => {
        const active = g.items.some((i) => !i.external && i.href.split("#")[0] === path);
        const isRef = g.group.startsWith("API: ");
        const open = toggles[g.group] ?? (!isRef || active);
        const id = `nav-${g.group.replace(/\W+/g, "-")}`;
        return (
          <div key={g.group}>
            <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setToggles((t) => ({ ...t, [g.group]: !open }))} className="flex min-h-11 w-full items-center justify-between rounded-md px-2 text-left text-[11px] font-medium uppercase tracking-wider text-fg-muted hover:text-fg">
              {g.group}<ChevronDown size={14} aria-hidden="true" className={cn("transition-transform", open && "rotate-180")} />
            </button>
            {open && (
              <ul id={id} className="mb-2">
                {g.items.map((i) => {
                  const on = !i.external && path === i.href.split("#")[0] && !i.href.includes("#");
                  return (
                    <li key={i.href}>
                      {i.external ? <a href={i.href} className="flex min-h-9 items-center rounded-md px-2 font-mono text-[12.5px] text-fg-muted hover:bg-sunken hover:text-fg">{i.label}</a> : (
                        <Link href={i.href} onClick={onNav} aria-current={on ? "page" : undefined} className={cn("flex min-h-9 items-center gap-2 rounded-md px-2 hover:bg-sunken", on ? "bg-sunken font-medium text-fg shadow-[inset_3px_0_0_var(--pd-accent)]" : "text-fg-muted hover:text-fg")}>
                          {i.method && <span className={cn("w-11 shrink-0 font-mono text-[10px] font-medium", MC[i.method])}>{i.method}</span>}{i.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = usePrefs();
  const dark = theme === "dark";
  return (
    <button type="button" onClick={() => setTheme(dark ? "light" : "dark")} aria-pressed={dark} aria-label="Dark mode" className="grid h-11 w-11 place-items-center rounded-md hover:bg-sunken">
      {dark ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
    </button>
  );
}

function Inner({ nav, statusHref, proposed, version, children }: { nav: NavGroup[]; statusHref: string; proposed: boolean; version: string; children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [find, setFind] = useState(false);
  const path = usePathname();
  const menuBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest?.("input, textarea, select, [contenteditable='true']");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setFind((v) => !v); }
      else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setFind(true); }
      else if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  const [seen, setSeen] = useState(path);
  if (seen !== path) { setSeen(path); setMenu(false); }
  useEffect(() => { if (menu) document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, [menu]);

  return (
    <div className="min-h-dvh">
      <a href="#content" className="pd-skip">Skip to content</a>
      <header className="sticky top-0 z-30 border-b border-edge bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-2 px-3 sm:gap-3 lg:px-6">
          <button ref={menuBtn} type="button" className="grid h-11 w-11 place-items-center rounded-md hover:bg-sunken lg:hidden" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><Menu size={20} aria-hidden="true" /></button>
          <Link href="/" className="flex min-h-11 items-center gap-2.5 rounded-md pr-2"><Mark /><span className="text-[15px] font-medium">Tefo</span><span className="rounded-md bg-night px-2 py-0.5 text-[11px] font-medium text-gold">API docs</span></Link>
          <span className="hidden font-mono text-[12px] text-fg-muted md:inline" title="Current API version">v{version}</span>
          {proposed && <Link href="/docs/versioning/" className="hidden min-h-9 items-center rounded-full border border-[var(--pd-accent-text)] px-3 text-[12px] text-accent-text hover:bg-sunken md:inline-flex" title="The endpoints and webhook scheme are a proposal until the backend matches">Proposed API</Link>}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <div className="hidden md:block"><EnvSwitcher /></div>
            <button type="button" onClick={() => setFind(true)} className="flex h-11 items-center gap-2 rounded-[var(--pd-radius-sm)] border border-edge bg-surface px-3 text-[13px] text-fg-muted hover:border-fg sm:w-60" aria-label="Search the docs" aria-keyshortcuts="Control+K Meta+K">
              <Search size={16} aria-hidden="true" /><span className="hidden flex-1 text-left sm:inline">Search</span><span className="hidden gap-1 sm:flex"><kbd>⌘</kbd><kbd>K</kbd></span>
            </button>
            <a href={statusHref} className="hidden h-11 items-center gap-1.5 rounded-md px-3 text-[13px] text-fg-muted hover:bg-sunken hover:text-fg lg:inline-flex"><Activity size={15} aria-hidden="true" />Status</a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Documentation menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-night/60" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 left-0 w-[min(20rem,88vw)] overflow-y-auto bg-canvas p-4 shadow-pd-overlay">
            <div className="mb-3 flex items-center justify-between"><span className="text-[15px] font-medium">Menu</span><button type="button" aria-label="Close menu" autoFocus onClick={() => { setMenu(false); menuBtn.current?.focus(); }} className="grid h-11 w-11 place-items-center rounded-md hover:bg-sunken"><X size={18} aria-hidden="true" /></button></div>
            <div className="mb-4 grid gap-3 border-b border-edge pb-4"><EnvSwitcher /><BaseUrl /><a href={statusHref} className="inline-flex min-h-11 items-center gap-2 text-[14px]"><Activity size={15} aria-hidden="true" />Status</a></div>
            <Nav nav={nav} onNav={() => setMenu(false)} />
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside aria-label="Sidebar" className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto border-r border-edge px-3 py-5 lg:block">
          <div className="mb-4 grid gap-1 px-1"><BaseUrl /></div>
          <Nav nav={nav} />
        </aside>
        <main id="content" tabIndex={-1} className="min-w-0 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
      <SearchDialog open={find} onClose={() => setFind(false)} />
    </div>
  );
}

export function DocsShell(props: { nav: NavGroup[]; statusHref: string; proposed: boolean; version: string; children: React.ReactNode }) {
  return <PrefsProvider><Inner {...props} /></PrefsProvider>;
}
