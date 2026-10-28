"use client";

import { Check, Copy, Play } from "lucide-react";
import { useState } from "react";
import type { Endpoint } from "@/content/api";
import { cn } from "@/lib/cn";
import { simulate, type Sim } from "@/lib/simulate";

export interface Rendered { lang: string; label: string; html: string; raw: string }

function Copy1({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" aria-label="Copy code" onClick={() => { navigator.clipboard?.writeText(text).catch(() => {}); setOk(true); setTimeout(() => setOk(false), 1400); }} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-ivory/70 hover:bg-ivory/10 hover:text-ivory">
      {ok ? <Check size={13} /> : <Copy size={13} />}{ok ? "Copied" : "Copy"}
    </button>
  );
}

export function CodePanel({ endpoint, samples, responseHtml }: { endpoint: Endpoint; samples: Rendered[]; responseHtml: string }) {
  const [tab, setTab] = useState(samples[0].lang);
  const [mode, setMode] = useState<"example" | "try">("example");
  const [body, setBody] = useState(endpoint.bodyExample !== undefined ? JSON.stringify(endpoint.bodyExample, null, 2) : "");
  const [scenario, setScenario] = useState("success");
  const [sim, setSim] = useState<Sim | null>(null);
  const cur = samples.find((s) => s.lang === tab)!;
  const canTry = endpoint.method !== "DELETE";
  const scenarios = endpoint.id === "create-collection" || endpoint.id === "simulate-payment";
  const tabBtn = (on: boolean) => cn("rounded-t-md px-3 py-2 text-xs font-medium", on ? "bg-deep text-gold" : "text-ivory/60 hover:text-ivory");
  return (
    <div className="overflow-hidden rounded-2xl bg-night text-ivory shadow-[0_20px_50px_-30px_rgba(6,14,27,.8)]">
      <div className="flex items-center justify-between border-b border-ivory/10 px-3 pt-2">
        <div role="tablist" aria-label="Language" className="flex gap-1">
          {samples.map((s) => <button key={s.lang} role="tab" aria-selected={tab === s.lang} onClick={() => setTab(s.lang)} className={tabBtn(tab === s.lang)}>{s.label}</button>)}
        </div>
        <Copy1 text={cur.raw} />
      </div>
      <div className="code-dark bg-deep" dangerouslySetInnerHTML={{ __html: cur.html }} />
      <div className="border-t border-ivory/10">
        <div role="tablist" aria-label="Response" className="flex gap-1 px-3 pt-2">
          <button role="tab" aria-selected={mode === "example"} onClick={() => setMode("example")} className={tabBtn(mode === "example")}>Response <span className="ml-1 text-ivory/50">{endpoint.status}</span></button>
          {canTry && <button role="tab" aria-selected={mode === "try"} onClick={() => setMode("try")} className={tabBtn(mode === "try")}>Try it</button>}
        </div>
        {mode === "example" ? (
          <div className="code-dark max-h-[420px] overflow-auto bg-deep" dangerouslySetInnerHTML={{ __html: responseHtml }} />
        ) : (
          <div className="grid gap-3 bg-deep p-4">
            <p className="text-xs text-ivory/60">A sandbox simulated in your browser. No request is sent and no key is needed.</p>
            {endpoint.body && (
              <label className="grid gap-1 text-xs text-ivory/70">Request body
                <textarea value={body} onChange={(e) => setBody(e.target.value)} spellCheck={false} rows={Math.min(14, body.split("\n").length + 1)} className="rounded-lg border border-ivory/15 bg-night p-3 font-mono text-[12.5px] leading-relaxed text-ivory" />
              </label>
            )}
            {scenarios && (
              <label className="grid gap-1 text-xs text-ivory/70">Pitisha-Sandbox-Scenario
                <select value={scenario} onChange={(e) => setScenario(e.target.value)} className="h-9 rounded-lg border border-ivory/15 bg-night px-2 text-[13px] text-ivory">
                  <option value="success">success</option><option value="insufficient_funds">insufficient_funds</option><option value="customer_cancelled">customer_cancelled</option><option value="no_response">no_response</option>
                </select>
              </label>
            )}
            <button type="button" onClick={() => setSim(simulate(endpoint, body, scenario))} className="inline-flex h-9 w-fit items-center gap-2 rounded-lg bg-gold px-4 text-[13px] font-medium text-night hover:brightness-95"><Play size={14} /> Send simulated request</button>
            {sim && (
              <div role="status" className="grid gap-3">
                <div><p className="mb-1 text-xs text-ivory/60">Response <span className={cn("ml-1 font-medium", sim.status < 400 ? "text-gold" : "text-[#FFA498]")}>{sim.status}</span></p><pre className="max-h-72 overflow-auto rounded-lg bg-night p-3 font-mono text-[12.5px] leading-relaxed">{JSON.stringify(sim.body, null, 2)}</pre></div>
                {sim.webhook !== undefined && <div><p className="mb-1 text-xs text-ivory/60">Then Pitisha sends this webhook to your endpoint</p><pre className="max-h-72 overflow-auto rounded-lg bg-night p-3 font-mono text-[12.5px] leading-relaxed">{JSON.stringify(sim.webhook, null, 2)}</pre></div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
