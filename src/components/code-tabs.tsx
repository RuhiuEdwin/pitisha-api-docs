"use client";

import { Check, Copy } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";
import { usePrefs } from "@/components/prefs";
import type { Lang } from "@/lib/snippets";

export interface TabSample { id: string; label: string; code: string; html: string }

/** Language tabs (arrow keys, Home, End), copy with a spoken confirmation, and one language choice shared by every block on the site. */
export function CodeTabs({ samples, title, label = "Code samples" }: { samples: TabSample[]; title?: string; label?: string }) {
  const { lang, setLang } = usePrefs();
  const multi = samples.length > 1;
  const active = samples.find((s) => s.id === lang) ?? samples[0];
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const baseId = `ct${useId().replace(/:/g, "")}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(active.code); setCopied("ok"); } catch { setCopied("fail"); }
    setTimeout(() => setCopied("idle"), 2000);
  };
  const onKey = (e: KeyboardEvent) => {
    const i = samples.findIndex((s) => s.id === active.id);
    const to = e.key === "ArrowRight" ? (i + 1) % samples.length : e.key === "ArrowLeft" ? (i - 1 + samples.length) % samples.length : e.key === "Home" ? 0 : e.key === "End" ? samples.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setLang(samples[to].id as Lang);
    document.getElementById(`${baseId}-${samples[to].id}`)?.focus();
  };

  return (
    <figure className="pd-code my-0">
      <div className="pd-code-bar">
        {multi ? (
          <div role="tablist" aria-label={label} className="pd-code-tabs">
            {samples.map((s) => (
              <button key={s.id} role="tab" type="button" id={`${baseId}-${s.id}`} aria-selected={s.id === active.id} aria-controls={`${baseId}-panel`} tabIndex={s.id === active.id ? 0 : -1} className="pd-code-tab" onClick={() => setLang(s.id as Lang)} onKeyDown={onKey}>{s.label}</button>
            ))}
          </div>
        ) : <figcaption className="pd-code-title">{title ?? active.label}</figcaption>}
        <button type="button" className="pd-code-copy" onClick={copy}>
          {copied === "ok" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          <span>{copied === "ok" ? "Copied" : copied === "fail" ? "Copy failed" : "Copy"}</span>
        </button>
        <span className="pd-vh" role="status">{copied === "ok" ? "Copied to clipboard" : copied === "fail" ? "Could not copy. Select the code and copy it by hand." : ""}</span>
      </div>
      <div id={`${baseId}-panel`} role={multi ? "tabpanel" : undefined} aria-labelledby={multi ? `${baseId}-${active.id}` : undefined} className="code-body">
        {/* tabIndex lets keyboard users scroll long lines */}
        <pre tabIndex={0} aria-label={`${active.label} code`}><code dangerouslySetInnerHTML={{ __html: active.html }} /></pre>
      </div>
    </figure>
  );
}
