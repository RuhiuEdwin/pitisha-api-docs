"use client";

import { ChevronDown, Menu, Moon, Search, Sun, X, Activity } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand, DemoStrip } from "pitisha-design";
import { PORTAL_URL } from "@/content/config";
import { PrefsProvider, usePrefs } from "@/components/prefs";
import { SearchDialog } from "@/components/search-dialog";
import { BaseUrl, EnvSwitcher } from "@/components/env";
import { cn } from "@/lib/cn";
import type { NavGroup } from "@/lib/docs";

const MC: Record<string, string> = { GET: "text-ok", POST: "text-accent-text", PATCH: "text-info", DELETE: "text-err" };

/** The Tefo "t" mark. Colours come from tokens so it holds on the sand and on the dark surface. */
function Mark() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true"><rect width="24" height="24" rx="7" fill="var(--pd-night-950)" stroke="var(--pd-line-night)" strokeWidth="1"/><path d="M9.6 4.2V14.1a4.4 4.4 0 0 0 4.4 4.4" fill="none" stroke="var(--pd-ivory-100)" strokeWidth="3.3" strokeLinecap="round"/><path d="M5.4 9.1H14.2" fill="none" stroke="var(--pd-ivory-100)" strokeWidth="3.3" strokeLinecap="round"/><circle cx="19.1" cy="18.5" r="2.35" fill="var(--pd-gold-300)"/></svg>;
}

function Nav({ nav, onNav }: { nav: NavGroup[]; onNav?: () => void }) {
  const path = usePathname();
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  return (
    <nav aria-label="Documentation" className="grid gap-1 text-[14px]">
      {nav.map((g) => {
        const active = g.items.some((i) => !i.external && i.href.split("#")[0] === path);
        const isRef = g.group.startsWith("API: ");
        const open = toggles[g.group] ?? (g.group === "Concepts" ? active : !isRef || active);
        const id = `nav-${g.group.replace(/\W+/g, "-")}`;
        return (
          <div key={g.group}>
            <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setToggles((t) => ({ ...t, [g.group]: !open }))} className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-[11px] font-medium uppercase tracking-wider text-fg-muted hover:text-fg">
              {g.group}<ChevronDown size={14} aria-hidden="true" className={cn("transition-transform", open && "rotate-180")} />
            </button>
            {open && (
              <ul id={id} className="mb-2">
                {g.items.map((i) => {
                  const on = !i.external && path === i.href.split("#")[0] && !i.href.includes("#");
                  return (
                    <li key={i.href}>
                      {i.external ? <a href={i.href} className="flex min-h-11 items-center rounded-md px-2 font-mono text-[12.5px] text-fg-muted hover:bg-sunken hover:text-fg">{i.label}</a> : (
                        <Link href={i.href} onClick={onNav} aria-current={on ? "page" : undefined} className={cn("flex min-h-11 items-center gap-2 rounded-xl px-3 text-[13.5px] hover:bg-sunken", on ? "bg-warn-bg font-medium text-fg" : "text-fg-muted hover:text-fg")}>
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
    <button type="button" onClick={() => setTheme(dark ? "light" : "dark")} aria-pressed={dark} aria-label="Dark mode" className="grid h-11 w-11 place-items-center rounded-xl hover:bg-sunken">
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

  const lockup = <Brand logo={<><Mark /><span className="text-[17px] font-bold lowercase tracking-tight">tefo</span></>} chip="Docs" />;
  return (
    <div className="min-h-dvh">
      <a href="#content" className="pd-skip">Skip to content</a>
      {proposed && <DemoStrip actions={<Link href="/docs/versioning/">Versioning</Link>}><strong>Proposed API.</strong> Endpoints and webhooks may change. Tefo is not live.</DemoStrip>}

      {menu && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Documentation menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-[var(--pd-scrim)]" onClick={() => setMenu(false)} />
          <div className="tefo-side absolute inset-y-0 left-0 w-[min(20rem,88vw)] overflow-y-auto bg-surface p-4 shadow-pd-overlay">
            <div className="mb-3 flex items-center justify-between">{lockup}<button type="button" aria-label="Close menu" autoFocus onClick={() => { setMenu(false); menuBtn.current?.focus(); }} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-sunken"><X size={18} aria-hidden="true" /></button></div>
            <div className="mb-4 grid gap-3 border-b border-edge pb-4"><EnvSwitcher /><BaseUrl /><a href={statusHref} className="inline-flex min-h-11 items-center gap-2 text-[14px]"><Activity size={15} aria-hidden="true" />Status</a></div>
            <Nav nav={nav} onNav={() => setMenu(false)} />
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[var(--pd-sidebar-w)_minmax(0,1fr)]">
        <aside aria-label="Sidebar" className="tefo-side sticky top-0 hidden h-dvh flex-col border-r border-edge bg-surface lg:flex">
          <div className="px-5 py-4">{lockup}</div>
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <div className="mb-4 grid gap-1 px-1"><BaseUrl /></div>
            <Nav nav={nav} />
          </div>
        </aside>
        <div className="min-w-0">
          <header className="tefo-top sticky top-0 z-30 border-b border-edge bg-surface/90 backdrop-blur">
            <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 lg:px-6">
              <button ref={menuBtn} type="button" className="grid h-11 w-11 place-items-center rounded-xl hover:bg-sunken lg:hidden" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><Menu size={20} aria-hidden="true" /></button>
              <Link href="/" className="rounded-xl lg:hidden" aria-label="Tefo docs home">{lockup}</Link>
              <button type="button" onClick={() => setFind(true)} className="ml-auto flex h-11 items-center gap-2 rounded-[var(--pd-radius-sm)] border border-edge bg-surface px-3 text-[13px] text-fg-muted hover:border-fg lg:ml-0 lg:w-72" aria-label="Search the docs" aria-keyshortcuts="Control+K Meta+K">
                <Search size={16} aria-hidden="true" /><span className="hidden flex-1 text-left sm:inline">Search</span><span className="hidden gap-1 sm:flex"><kbd>⌘</kbd><kbd>K</kbd></span>
              </button>
              <div className="ml-auto hidden items-center gap-2 md:flex">
                <span className="hidden font-mono text-[12px] text-fg-muted xl:inline" title="Current API version">v{version}</span>
                <EnvSwitcher />
                <a href={statusHref} className="hidden h-11 items-center gap-1.5 rounded-xl px-3 text-[13px] text-fg-muted hover:bg-sunken hover:text-fg lg:inline-flex"><Activity size={15} aria-hidden="true" />Status</a>
                {PORTAL_URL && <a href={PORTAL_URL} className="inline-flex h-11 items-center rounded-xl px-3 text-[13px] font-medium underline underline-offset-4">Open portal</a>}
              </div>
              <ThemeToggle />
            </div>
          </header>
          <main id="content" tabIndex={-1} className="min-w-0 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
        </div>
      </div>
      <SearchDialog open={find} onClose={() => setFind(false)} />
    </div>
  );
}

export function DocsShell(props: { nav: NavGroup[]; statusHref: string; proposed: boolean; version: string; children: React.ReactNode }) {
  return <PrefsProvider><Inner {...props} /></PrefsProvider>;
}
