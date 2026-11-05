"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/docs";
import { cn } from "@/lib/cn";

/** "On this page". The current section is marked with aria-current and a bar, not colour alone. */
export function Toc({ items }: { items: Heading[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const els = items.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const seen = new Map<string, number>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : -1);
      const visible = [...seen.entries()].filter(([, t]) => t >= 0).sort((a, b) => a[1] - b[1]);
      if (visible[0]) setCurrent(visible[0][0]);
    }, { rootMargin: "-80px 0px -65% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  if (!items.length) return null;
  return (
    <nav aria-label="On this page" className="text-[13px]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-fg-muted">On this page</p>
      <ul>
        {items.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} aria-current={current === h.id ? "location" : undefined} className={cn("flex min-h-8 items-center rounded-md py-1 text-fg-muted hover:text-fg", h.depth > 2 ? "pl-6" : "pl-3", current === h.id ? "bg-sunken font-medium text-fg" : "")}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function MobileToc({ items }: { items: Heading[] }) {
  if (!items.length) return null;
  return (
    <details className="mb-6 rounded-[var(--pd-radius-sm)] border border-edge xl:hidden">
      <summary className="flex min-h-11 cursor-pointer items-center px-4 text-[14px] font-medium">On this page</summary>
      <ul className="border-t border-edge px-2 py-2 text-[14px]">{items.map((h) => <li key={h.id}><a href={`#${h.id}`} className={cn("flex min-h-11 items-center rounded-md px-2 hover:bg-sunken", h.depth > 2 && "pl-6")}>{h.text}</a></li>)}</ul>
    </details>
  );
}
