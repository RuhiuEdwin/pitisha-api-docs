/** Pure helpers behind Table: sort, search, paginate, CSV. Kept free of React so they are easy to test. */
export type SortDir = "asc" | "desc";
export interface SortState { id: string; dir: SortDir }

export interface ColumnLike<T> {
  id: string;
  header: string;
  /** Raw value used for sorting, search and (by default) CSV. */
  value: (row: T) => string | number | bigint | null | undefined;
  /** Override what goes in the CSV, e.g. a plain decimal for money. */
  csv?: (row: T) => string | number | null | undefined;
  sortable?: boolean;
  searchable?: boolean;
}

const cmp = (a: unknown, b: unknown): number => {
  if (a == null && b == null) return 0;
  if (a == null) return 1; // blanks last in both directions
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "bigint" && typeof b === "bigint") return a < b ? -1 : a > b ? 1 : 0;
  return String(a).localeCompare(String(b), "en", { numeric: true, sensitivity: "base" });
};

export function sortRows<T>(rows: readonly T[], col: ColumnLike<T> | undefined, dir: SortDir): T[] {
  if (!col) return [...rows];
  const sign = dir === "asc" ? 1 : -1;
  // Array.sort is stable, so equal rows keep their order.
  return [...rows].sort((x, y) => {
    const a = col.value(x);
    const b = col.value(y);
    if (a == null || b == null) return cmp(a, b);
    return sign * cmp(a, b);
  });
}

export function searchRows<T>(rows: readonly T[], cols: ReadonlyArray<ColumnLike<T>>, query: string): T[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [...rows];
  const searchable = cols.filter((c) => c.searchable !== false);
  return rows.filter((row) => {
    const hay = searchable.map((c) => String(c.value(row) ?? "").toLowerCase()).join("\u0000");
    return terms.every((t) => hay.includes(t));
  });
}

export interface Page<T> { rows: T[]; page: number; pageCount: number; from: number; to: number; total: number }

export function paginate<T>(rows: readonly T[], page: number, pageSize: number): Page<T> {
  const total = rows.length;
  const size = Math.max(1, Math.floor(pageSize));
  const pageCount = Math.max(1, Math.ceil(total / size));
  const p = Math.min(Math.max(0, Math.floor(page)), pageCount - 1);
  const start = p * size;
  const slice = rows.slice(start, start + size);
  return { rows: slice, page: p, pageCount, from: total ? start + 1 : 0, to: start + slice.length, total };
}

/** Spreadsheets run text that starts with = + - @ as a formula. Prefix text cells so exported data cannot do that. Real numbers are left alone. */
export function csvCell(v: string | number | bigint | null | undefined): string {
  if (v == null) return "";
  let s = typeof v === "string" ? v : String(v);
  if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv<T>(cols: ReadonlyArray<ColumnLike<T>>, rows: readonly T[]): string {
  const head = cols.map((c) => csvCell(c.header)).join(",");
  const body = rows.map((r) => cols.map((c) => csvCell(c.csv ? c.csv(r) : (c.value(r) as string | number | bigint | null | undefined))).join(","));
  return [head, ...body].join("\r\n");
}
