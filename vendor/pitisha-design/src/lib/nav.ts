/** Role-aware navigation and the command palette's search, as pure functions. */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  /** Roles that may see this item. Omit for everyone. */
  roles?: readonly string[];
  keywords?: readonly string[];
  badge?: string | number;
}
export interface NavGroup<I extends NavItem = NavItem> { id: string; label: string; items: readonly I[] }

export function visibleNav<I extends NavItem>(groups: ReadonlyArray<NavGroup<I>>, role?: string): NavGroup<I>[] {
  return groups
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.roles || (role !== undefined && i.roles.includes(role))) }))
    .filter((g) => g.items.length > 0);
}

/** "/" matches only itself; any other href matches itself and its children, on a segment boundary. */
export function isActive(href: string, pathname: string): boolean {
  const clean = (s: string) => (s.length > 1 ? s.replace(/\/+$/, "") : s).split(/[?#]/)[0] || "/";
  const h = clean(href);
  const p = clean(pathname);
  return h === "/" ? p === "/" : p === h || p.startsWith(`${h}/`);
}

export interface Command { id: string; label: string; group?: string; keywords?: readonly string[]; href?: string }

/** Every term must appear in the label, group or keywords. Label matches rank first, prefix matches ahead of the rest. */
export function filterCommands<C extends Command>(commands: readonly C[], query: string): C[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [...commands];
  const scored: Array<{ c: C; score: number; i: number }> = [];
  commands.forEach((c, i) => {
    const label = c.label.toLowerCase();
    const rest = `${c.group ?? ""} ${(c.keywords ?? []).join(" ")}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (label.startsWith(t)) score += 3;
      else if (label.includes(t)) score += 2;
      else if (rest.includes(t)) score += 1;
      else return;
    }
    scored.push({ c, score, i });
  });
  return scored.sort((a, b) => b.score - a.score || a.i - b.i).map((s) => s.c);
}
