"use client";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { paginate, searchRows, sortRows, toCsv, type ColumnLike, type SortState } from "../lib/table-utils";
import { Button } from "./button";
import { EmptyState } from "./empty-state";
import { Icon } from "./icons";
import { Input, Select } from "./field";
import { Skeleton } from "./skeleton";

export interface Column<T> extends ColumnLike<T> {
  /** What to show in the cell. Defaults to the raw value. */
  cell?: (row: T) => ReactNode;
  align?: "start" | "end";
  /** Numbers and money: right-aligned, tabular. */
  numeric?: boolean;
  /** Start hidden; the person can switch it on in the Columns menu. */
  hiddenByDefault?: boolean;
  /** Always shown; not offered in the Columns menu. */
  required?: boolean;
}

export interface TableProps<T> {
  /** Names the table for everyone, and the exported file. */
  caption: string;
  columns: ReadonlyArray<Column<T>>;
  rows: readonly T[];
  getRowId: (row: T) => string;
  /** Used to name each row's Open button, e.g. the receipt number. */
  rowLabel?: (row: T) => string;
  onOpen?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  pageSizes?: readonly number[];
  /** File name (without .csv). Turns on Export CSV. */
  exportName?: string;
  defaultSort?: SortState;
  loading?: boolean;
  /** Shown when there are no rows at all. */
  empty?: ReactNode;
  /** Filters and other controls, placed beside the search box. */
  toolbar?: ReactNode;
  density?: "dense" | "comfortable";
  className?: string;
}

export function Table<T>({
  caption, columns, rows, getRowId, rowLabel, onOpen, searchable = true, searchPlaceholder = "Search", pageSize = 10, pageSizes = [10, 25, 50],
  exportName, defaultSort, loading, empty, toolbar, density = "dense", className,
}: TableProps<T>) {
  const uid = useId();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState | undefined>(defaultSort);
  const [size, setSize] = useState(pageSize);
  const [pageIndex, setPage] = useState(0);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(columns.filter((c) => c.hiddenByDefault).map((c) => c.id)));
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  const shown = columns.filter((c) => !hidden.has(c.id));
  const filtered = useMemo(() => searchRows(rows, columns, query), [rows, columns, query]);
  const sorted = useMemo(() => sortRows(filtered, columns.find((c) => c.id === sort?.id), sort?.dir ?? "asc"), [filtered, columns, sort]);
  const page = paginate(sorted, pageIndex, size);

  const toggleSort = (c: Column<T>) => {
    setPage(0);
    setSort((s) => (s?.id !== c.id ? { id: c.id, dir: "asc" } : s.dir === "asc" ? { id: c.id, dir: "desc" } : undefined));
  };
  const exportCsv = () => {
    // Exports what the person is looking at: filtered, sorted, visible columns, every page.
    const csv = `${String.fromCharCode(0xfeff)}${toCsv(shown, sorted)}`; // BOM so Excel reads UTF-8
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const noRows = !loading && rows.length === 0;
  const noMatches = !loading && rows.length > 0 && filtered.length === 0;

  return (
    <div className={cx("pd-table-wrap", className)} data-density={density}>
      <div className="pd-table-tools">
        {searchable ? (
          <div className="pd-table-search">
            <Icon name="search" size={16} />
            <Input type="search" aria-label={`${searchPlaceholder} ${caption}`} placeholder={searchPlaceholder} value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} />
          </div>
        ) : null}
        {toolbar}
        <div className="pd-table-tools-end">
          <div className="pd-menu" ref={menuRef}>
            <Button variant="secondary" size="sm" aria-expanded={menu} aria-controls={`${uid}-cols`} iconStart={<Icon name="columns" />} onClick={() => setMenu((m) => !m)} id={`${uid}-colbtn`}>Columns</Button>
            {menu ? (
              // Escape closes the menu and returns focus; the checkboxes are the interactive parts.
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <div
                className="pd-menu-panel"
                id={`${uid}-cols`}
                role="group"
                aria-label="Choose columns"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setMenu(false);
                    document.getElementById(`${uid}-colbtn`)?.focus();
                  }
                }}
              >
                {columns.filter((c) => !c.required).map((c) => (
                  <label key={c.id} className="pd-check">
                    <input
                      type="checkbox"
                      checked={!hidden.has(c.id)}
                      onChange={() => setHidden((h) => { const n = new Set(h); if (n.has(c.id)) n.delete(c.id); else n.add(c.id); return n; })}
                    />
                    <span>{c.header}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          {exportName ? <Button variant="secondary" size="sm" iconStart={<Icon name="download" />} onClick={exportCsv} disabled={!sorted.length}>Export CSV</Button> : null}
        </div>
      </div>

      {noRows ? (
        empty ?? <EmptyState title="Nothing here yet" description="When there is something to show, it will appear in this table." />
      ) : (
        // A keyboard-focusable scroll region so wide tables can be scrolled without a mouse.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div className="pd-table-scroll" role="region" aria-label={caption} tabIndex={0} aria-busy={loading || undefined}>
          <table className="pd-table">
            <caption className="pd-vh">{caption}</caption>
            <thead>
              <tr>
                {shown.map((c) => {
                  const active = sort?.id === c.id;
                  return (
                    <th key={c.id} scope="col" data-align={c.numeric ? "end" : (c.align ?? "start")} aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : c.sortable ? "none" : undefined}>
                      {c.sortable ? (
                        <button type="button" className="pd-th-btn" onClick={() => toggleSort(c)}>
                          {c.header}
                          <Icon name={active ? (sort!.dir === "asc" ? "arrow-up" : "arrow-down") : "chevrons-up-down"} size={14} />
                        </button>
                      ) : c.header}
                    </th>
                  );
                })}
                {onOpen ? <th scope="col" data-align="end"><span className="pd-vh">Actions</span></th> : null}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: Math.min(size, 5) }, (_, r) => (
                    <tr key={r}>{shown.map((c) => <td key={c.id}><Skeleton height="0.9em" width={c.numeric ? "60%" : "80%"} /></td>)}{onOpen ? <td /> : null}</tr>
                  ))
                : page.rows.map((row) => (
                    <tr key={getRowId(row)}>
                      {shown.map((c) => (
                        <td key={c.id} data-align={c.numeric ? "end" : (c.align ?? "start")} className={cx(c.numeric && "pd-num")}>
                          {c.cell ? c.cell(row) : (c.value(row) as ReactNode) ?? ""}
                        </td>
                      ))}
                      {onOpen ? (
                        <td data-align="end">
                          <Button variant="ghost" size="sm" onClick={() => onOpen(row)} aria-label={`Open ${rowLabel ? rowLabel(row) : getRowId(row)}`}>Open</Button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
            </tbody>
          </table>
          {noMatches ? <EmptyState icon="search" title="No matches" description="Nothing fits your search. Clear it or try fewer words." action={<Button variant="secondary" size="sm" onClick={() => setQuery("")}>Clear search</Button>} /> : null}
        </div>
      )}

      {!noRows ? (
        <div className="pd-table-foot">
          <p className="pd-table-count pd-num" role="status" aria-live="polite">
            {loading ? "Loading…" : page.total ? `Showing ${page.from}–${page.to} of ${page.total}` : "No rows"}
          </p>
          <div className="pd-table-pager">
            <label className="pd-table-size">
              <span>Rows</span>
              <Select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }} aria-label="Rows per page">
                {pageSizes.map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
            </label>
            <Button variant="secondary" size="sm" iconStart={<Icon name="chevron-left" />} disabled={page.page === 0} onClick={() => setPage(page.page - 1)}>Previous</Button>
            <span className="pd-num pd-table-page">Page {page.page + 1} of {page.pageCount}</span>
            <Button variant="secondary" size="sm" iconEnd={<Icon name="chevron-right" />} disabled={page.page >= page.pageCount - 1} onClick={() => setPage(page.page + 1)}>Next</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
