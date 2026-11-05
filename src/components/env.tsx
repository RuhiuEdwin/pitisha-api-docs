"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { ENVS, ENV_IDS, PLACEHOLDER_BASE, type EnvId } from "@/content/config";
import { usePrefs } from "@/components/prefs";

/** Sandbox or live. This only changes what the docs show (base URL, key prefix, what Try it can do). It never sends anything. */
export function EnvSwitcher() {
  const { env, setEnv } = usePrefs();
  return (
    <div role="radiogroup" aria-label="Environment" className="inline-flex rounded-[var(--pd-radius-lg)] bg-surface shadow-pd-sm p-0.5 text-[13px]">
      {ENV_IDS.map((id) => (
        <button key={id} type="button" role="radio" aria-checked={env === id} onClick={() => setEnv(id)} className="min-h-11 rounded-[8px] px-3 font-medium text-fg-muted hover:text-fg aria-checked:bg-fg aria-checked:text-canvas">
          {ENVS[id].label}
        </button>
      ))}
    </div>
  );
}

export function useEnv() {
  const { env } = usePrefs();
  const cfg = ENVS[env as EnvId];
  return { env, cfg, base: cfg.baseUrl ?? PLACEHOLDER_BASE, isPlaceholder: cfg.baseUrl === null };
}

/** The base URL for the chosen environment, from one config. A placeholder says so. */
export function BaseUrl() {
  const { cfg, base, isPlaceholder } = useEnv();
  const [ok, setOk] = useState(false);
  return (
    <div className="grid gap-1 text-[12px]">
      <span className="text-fg-muted">{cfg.label} base URL</span>
      <div className="flex items-center gap-1 rounded-[var(--pd-radius-xs)] border border-edge bg-sunken pl-2">
        <code className="min-w-0 flex-1 truncate font-mono text-[12px]" title={base}>{base}</code>
        <button type="button" aria-label="Copy base URL" onClick={async () => { try { await navigator.clipboard.writeText(base); setOk(true); setTimeout(() => setOk(false), 1500); } catch { /* ignore */ } }} className="grid h-11 w-11 place-items-center rounded-md hover:bg-edge">{ok ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}</button>
      </div>
      <span className="text-fg-muted">{isPlaceholder ? "A placeholder. Your real URL is in the partners portal." : cfg.note}</span>
      <span className="pd-vh" role="status">{ok ? "Base URL copied" : ""}</span>
    </div>
  );
}
