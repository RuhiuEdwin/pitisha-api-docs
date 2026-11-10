"use client";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type AnchorHTMLAttributes, type ComponentType, type ReactNode } from "react";
import { filterCommands, isActive, visibleNav, type Command, type NavGroup, type NavItem } from "../lib/nav";
import { Dialog } from "./dialog";
import { Icon } from "./icons";

export interface ShellNavItem extends NavItem { icon?: ReactNode }
export type ShellLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export interface AppShellProps {
  brand: ReactNode;
  nav: ReadonlyArray<NavGroup<ShellNavItem>>;
  /** Current user's role. Items that list `roles` are hidden from everyone else. This hides the interface only; the server must enforce permissions. */
  userRole?: string;
  pathname: string;
  /** Pass next/link here. Defaults to a plain <a>. */
  Link?: ComponentType<ShellLinkProps>;
  /** Called when the command palette picks a destination. Pass router.push. Defaults to a full page load. */
  onNavigate?: (href: string) => void;
  /** Extra palette entries (actions, recent items). */
  commands?: readonly Command[];
  /** Page title shown in the top bar. */
  title?: ReactNode;
  /** Right side of the top bar: role switch, user menu, theme toggle. */
  topbar?: ReactNode;
  sidebarFooter?: ReactNode;
  /** A <DemoBanner /> goes here so it sits above everything. */
  banner?: ReactNode;
  /** Keep the shell inside its container instead of the full viewport. For the reference page and screenshots. */
  embedded?: boolean;
  children: ReactNode;
}

const DefaultLink = ({ href, children, ...rest }: ShellLinkProps) => <a href={href} {...rest}>{children}</a>;

export function AppShell({ brand, nav, userRole, pathname, Link = DefaultLink, onNavigate, commands = [], title, topbar, sidebarFooter, banner, embedded, children }: AppShellProps) {
  const groups = useMemo(() => visibleNav(nav, userRole), [nav, userRole]);
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close the mobile drawer after any navigation.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      setDrawer(false);
    }
  }, [pathname]);

  const all: Command[] = useMemo(
    () => [...groups.flatMap((g) => g.items.map((i) => ({ id: i.id, label: i.label, group: g.label, keywords: i.keywords, href: i.href }))), ...commands],
    [groups, commands],
  );

  const go = useCallback(
    (href: string) => {
      setPalette(false);
      if (onNavigate) onNavigate(href);
      else window.location.assign(href);
    },
    [onNavigate],
  );

  const sidebar = (
    <nav aria-label="Main" className="pd-nav">
      {groups.map((g) => (
        <div key={g.id} className="pd-nav-group">
          <p className="pd-nav-label" id={`nav-${g.id}`}>{g.label}</p>
          <ul aria-labelledby={`nav-${g.id}`}>
            {g.items.map((i) => {
              const active = isActive(i.href, pathname);
              return (
                <li key={i.id}>
                  <Link href={i.href} className="pd-nav-link" aria-current={active ? "page" : undefined} onClick={() => setDrawer(false)}>
                    {i.icon ? <span className="pd-nav-icon" aria-hidden="true">{i.icon}</span> : null}
                    <span className="pd-nav-text">{i.label}</span>
                    {i.badge !== undefined ? <span className="pd-nav-badge pd-num">{i.badge}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="pd-shell-wrap" data-embedded={embedded ? "" : undefined}>
      <a className="pd-skip" href="#pd-main">Skip to content</a>
      {banner}
      <div className="pd-shell">
        <aside className="pd-sidebar" aria-label="Sidebar">
          <div className="pd-sidebar-brand">{brand}</div>
          {sidebar}
          {sidebarFooter ? <div className="pd-sidebar-foot">{sidebarFooter}</div> : null}
        </aside>
        <div className="pd-main-col">
          <header className="pd-topbar">
            <button type="button" className="pd-icon-btn pd-menu-btn" onClick={() => setDrawer(true)} aria-label="Open menu">
              <Icon name="menu" size={20} />
            </button>
            {title ? <p className="pd-topbar-title">{title}</p> : null}
            <button type="button" className="pd-palette-btn" onClick={() => setPalette(true)} aria-label="Search pages and actions">
              <Icon name="search" size={16} />
              <span className="pd-palette-hint">Search</span>
              <kbd className="pd-kbd" aria-hidden="true">Ctrl K</kbd>
            </button>
            <div className="pd-topbar-end">{topbar}</div>
          </header>
          <main id="pd-main" className="pd-main" tabIndex={-1}>{children}</main>
        </div>
      </div>

      <Dialog open={drawer} onClose={() => setDrawer(false)} title="Menu" variant="drawer" side="start" size="sm" className="pd-nav-drawer">
        <div className="pd-drawer-brand">{brand}</div>
        {sidebar}
        {sidebarFooter ? <div className="pd-sidebar-foot">{sidebarFooter}</div> : null}
      </Dialog>
      <CommandPalette open={palette} onClose={() => setPalette(false)} commands={all} onPick={(c) => (c.href ? go(c.href) : setPalette(false))} />
    </div>
  );
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: readonly Command[];
  onPick: (c: Command) => void;
}

export function CommandPalette({ open, onClose, commands, onPick }: CommandPaletteProps) {
  const id = useId();
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => filterCommands(commands, q), [commands, q]);
  const idx = Math.min(i, Math.max(0, results.length - 1));

  useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
      const h = setTimeout(() => input.current?.focus(), 0);
      return () => clearTimeout(h);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} title="Search pages and actions" hideTitle size="md" className="pd-palette">
      <div className="pd-palette-box">
        <Icon name="search" size={18} />
        <input
          ref={input}
          className="pd-palette-input"
          role="combobox"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-activedescendant={results[idx] ? `${id}-o-${idx}` : undefined}
          aria-autocomplete="list"
          aria-label="Search pages and actions"
          placeholder="Search pages and actions"
          value={q}
          onChange={(e) => { setQ(e.target.value); setI(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setI(Math.min(idx + 1, results.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setI(Math.max(idx - 1, 0)); }
            else if (e.key === "Enter" && results[idx]) { e.preventDefault(); onPick(results[idx]!); }
          }}
        />
      </div>
      <ul className="pd-palette-list" role="listbox" id={`${id}-list`} aria-label="Results">
        {results.map((c, n) => (
          // Options are driven from the combobox input (aria-activedescendant); the click is for pointer users.
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <li key={c.id} id={`${id}-o-${n}`} role="option" aria-selected={n === idx} className="pd-palette-opt" onMouseMove={() => setI(n)} onClick={() => onPick(c)}>
            <span>{c.label}</span>
            {c.group ? <span className="pd-palette-group">{c.group}</span> : null}
          </li>
        ))}
      </ul>
      <p className="pd-palette-empty" role="status">{results.length ? `${results.length} result${results.length === 1 ? "" : "s"}` : "No matches. Try another word."}</p>
    </Dialog>
  );
}
