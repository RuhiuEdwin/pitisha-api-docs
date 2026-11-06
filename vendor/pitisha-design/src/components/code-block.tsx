"use client";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { Icon } from "./icons";

export interface CodeTab {
  id: string;
  label: string;
  code: string;
  language?: string;
  /** Pre-highlighted markup (e.g. from Shiki). Falls back to the plain code. */
  highlighted?: ReactNode;
}
export interface CodeBlockProps {
  tabs?: readonly CodeTab[];
  code?: string;
  language?: string;
  title?: string;
  className?: string;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function CodeBlock({ tabs, code, language, title, className }: CodeBlockProps) {
  const list: readonly CodeTab[] = tabs?.length ? tabs : [{ id: "code", label: language ?? "Code", code: code ?? "", language }];
  const [active, setActive] = useState(list[0]!.id);
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const cur = list.find((t) => t.id === active) ?? list[0]!;
  const multi = list.length > 1;

  const copy = async () => {
    setState((await copyText(cur.code)) ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  };
  const onKey = (e: KeyboardEvent) => {
    const i = list.findIndex((t) => t.id === active);
    const to = e.key === "ArrowRight" ? (i + 1) % list.length : e.key === "ArrowLeft" ? (i - 1 + list.length) % list.length : e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    const t = list[to]!;
    setActive(t.id);
    refs.current[t.id]?.focus();
  };

  return (
    <figure className={cx("pd-code", className)}>
      <div className="pd-code-bar">
        {multi ? (
          <div role="tablist" aria-label={title ?? "Code samples"} className="pd-code-tabs">
            {list.map((t) => (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[t.id] = el;
                }}
                role="tab"
                type="button"
                id={`tab-${t.id}`}
                aria-selected={t.id === active}
                aria-controls={`panel-${t.id}`}
                tabIndex={t.id === active ? 0 : -1}
                className="pd-code-tab"
                onClick={() => setActive(t.id)}
                onKeyDown={onKey}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <figcaption className="pd-code-title">{title ?? cur.label}</figcaption>
        )}
        <button type="button" className="pd-code-copy" onClick={copy}>
          <Icon name={state === "copied" ? "check" : "copy"} size={14} />
          <span>{state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}</span>
        </button>
        <span className="pd-vh" role="status">{state === "copied" ? "Copied to clipboard" : state === "failed" ? "Could not copy. Select the code and copy it by hand." : ""}</span>
      </div>
      <div role={multi ? "tabpanel" : undefined} id={`panel-${cur.id}`} aria-labelledby={multi ? `tab-${cur.id}` : undefined}>
        {/* tabIndex lets keyboard users scroll long lines */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <pre className="pd-code-pre" tabIndex={0}>
          {cur.highlighted ?? <code>{cur.code}</code>}
        </pre>
      </div>
    </figure>
  );
}
