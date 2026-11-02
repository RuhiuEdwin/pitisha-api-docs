/** Pure search over the static index. Runs in the browser. No dependencies. */
export type SearchKind = "Guide" | "Recipe" | "Endpoint" | "Error" | "Event" | "Field";
export const KINDS: SearchKind[] = ["Guide", "Recipe", "Endpoint", "Error", "Event", "Field"];

export interface SearchDoc {
  title: string;
  href: string;
  kind: SearchKind;
  /** Short context shown under the title, such as "POST /v1/collections" or the page a heading is on. */
  hint: string;
  text: string;
}

const norm = (s: string) => s.toLowerCase().replace(/[_./\-{}:]+/g, " ").replace(/\s+/g, " ").trim();
export const words = (q: string) => norm(q).split(" ").filter(Boolean);

export function score(d: SearchDoc, ws: string[]): number {
  const t = norm(d.title), h = norm(d.hint), x = norm(d.text);
  const tw = t.split(" ");
  let total = 0;
  for (const w of ws) {
    let s = 0;
    if (t === w) s = 14;
    else if (tw.includes(w)) s = 8;
    else if (tw.some((a) => a.startsWith(w))) s = 6;
    else if (t.includes(w)) s = 4;
    else if (h.includes(w)) s = 3;
    else if (x.includes(w)) s = 1;
    else return -1;
    total += s;
  }
  if (ws.length > 1 && t.includes(ws.join(" "))) total += 6;
  return total;
}

export interface Hit { doc: SearchDoc; score: number }

export function search(docs: readonly SearchDoc[], q: string, opts: { kinds?: readonly SearchKind[]; limit?: number } = {}): Hit[] {
  const ws = words(q);
  if (!ws.length) return [];
  const kinds = opts.kinds?.length ? new Set(opts.kinds) : null;
  const hits: Hit[] = [];
  for (const doc of docs) {
    if (kinds && !kinds.has(doc.kind)) continue;
    const s = score(doc, ws);
    if (s > 0) hits.push({ doc, score: s });
  }
  hits.sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title));
  return hits.slice(0, opts.limit ?? 30);
}

/** Split text into segments, marking the ones that match a query word. For rendering <mark>. */
export function highlight(text: string, ws: string[]): { text: string; hit: boolean }[] {
  const ok = ws.filter((w) => w.length > 0);
  if (!ok.length) return [{ text, hit: false }];
  const re = new RegExp(`(${ok.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig");
  return text.split(re).filter(Boolean).map((s) => ({ text: s, hit: ok.some((w) => s.toLowerCase() === w) }));
}

/** What to show before anyone types: the way in to each kind of page. */
export const SUGGESTED = ["quickstart", "idempotency", "webhooks", "match", "go live", "insufficient_funds"];
