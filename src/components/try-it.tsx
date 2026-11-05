"use client";

import { Check, CircleX, Copy, Eye, EyeOff, FlaskConical, Play, RefreshCw } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useEnv } from "@/components/env";
import type { Endpoint } from "@/content/api";
import { curlFor, pretty, samplePath } from "@/lib/snippets";
import { simulate, type IdemStore, type Sim } from "@/lib/simulate";
import { cn } from "@/lib/cn";

const REASON: Record<number, string> = { 200: "OK", 201: "Created", 400: "Bad request", 401: "Unauthorized", 409: "Conflict", 422: "Unprocessable", 429: "Too many requests", 500: "Server error" };
const newKey = () => `try-${Math.random().toString(36).slice(2, 8)}`;
const SCENARIOS = ["success", "insufficient_funds", "customer_cancelled", "no_response"];

const labelCls = "grid gap-1 text-[13px] font-medium";
const inputCls = "min-h-11 rounded-[var(--pd-radius-xs)] border border-edge-strong bg-surface px-3 font-mono text-[13px] text-fg";

/** Labelled sandbox mode. Runs entirely in this browser: nothing is sent, no live key is accepted. */
export function TryIt({ endpoint }: { endpoint: Endpoint }) {
  const { env, cfg } = useEnv();
  const e = endpoint;
  const scenarios = e.id === "create-collection";
  const hasIdem = !!e.headers?.some((h) => h.name === "Idempotency-Key");
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const [idem, setIdem] = useState(newKey);
  const [scenario, setScenario] = useState("success");
  const [path, setPath] = useState<Record<string, string>>(() => Object.fromEntries((e.pathParams ?? []).map((p) => [p.name, samplePath(`{${p.name}}`)])));
  const initial = e.bodyExample !== undefined ? pretty(e.bodyExample) : "";
  const [body, setBody] = useState(initial);
  const [sim, setSim] = useState<Sim | null>(null);
  const [tab, setTab] = useState<"body" | "headers" | "webhook">("body");
  const [copied, setCopied] = useState(false);
  const store = useRef<IdemStore>(new Map());

  const bodyError = useMemo(() => { if (!e.body || !body.trim()) return null; try { JSON.parse(body); return null; } catch (x) { return (x as Error).message; } }, [body, e.body]);
  const fullPath = e.path.replace(/\{(\w+)\}/g, (_, k) => path[k] || k.toUpperCase());
  const reqHeaders: [string, string][] = [
    ...(e.body ? [["Content-Type", "application/json"] as [string, string]] : []),
    ...(hasIdem && idem ? [["Idempotency-Key", idem] as [string, string]] : []),
    ...(scenarios ? [["Tefo-Sandbox-Scenario", scenario] as [string, string]] : []),
  ];

  if (!cfg.simulated) {
    return (
      <section aria-label="Try it" className="rounded-[var(--pd-radius-lg)] bg-surface shadow-pd-sm p-4 text-[14px]">
        <h4 className="font-medium">Try it</h4>
        <p className="mt-2 text-fg-muted">Try it runs only against the simulated sandbox. This site never sends a live request. Switch the environment at the top of the page to <strong>Sandbox</strong> to use it.</p>
      </section>
    );
  }

  const send = () => {
    let sc = scenario;
    if (e.id === "simulate-payment") { try { sc = String(JSON.parse(body).scenario ?? "success"); } catch { sc = "success"; } }
    setSim(simulate(e, { body, scenario: sc, key, idempotencyKey: idem }, store.current));
    setTab("body");
  };
  const copyCurl = async () => {
    const text = curlFor({ method: e.method, path: fullPath, body: e.body ? body : undefined, headers: reqHeaders, base: cfg.baseUrl, key });
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };
  const ok = sim && sim.status < 400;

  return (
    <section aria-labelledby={`try-${e.id}`} className="rounded-[var(--pd-radius-lg)] bg-surface shadow-pd-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-edge px-4 py-3">
        <h4 id={`try-${e.id}`} className="text-[15px] font-medium">Try it</h4>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pd-info)] bg-info-bg px-2.5 py-0.5 text-[12px] font-medium"><FlaskConical size={13} aria-hidden="true" />Simulated. Nothing is sent.</span>
        <span className="ml-auto text-[12px] text-fg-muted">{env === "sandbox" ? "Sandbox" : ""}</span>
      </div>
      <div className="grid gap-4 p-4">
        <p className="text-[13px] text-fg-muted">This runs in your browser against a made-up sandbox, until a real sandbox URL exists. It checks required fields and amounts and plays the scenarios. Use any key that starts with <code className="font-mono">sk_test_</code>. Never paste a live key.</p>

        <label className={labelCls}>Secret key
          <span className="flex gap-2">
            <input type={show ? "text" : "password"} value={key} onChange={(x) => setKey(x.target.value)} autoComplete="off" spellCheck={false} placeholder="sk_test_..." className={cn(inputCls, "min-w-0 flex-1")} />
            <button type="button" aria-pressed={show} aria-label={show ? "Hide key" : "Show key"} onClick={() => setShow(!show)} className="grid h-11 w-11 place-items-center rounded-[var(--pd-radius-xs)] border border-edge-strong hover:bg-sunken">{show ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}</button>
          </span>
          <span className="text-[12px] font-normal text-fg-muted">Kept in this page only. It is gone when you leave.</span>
        </label>

        {(e.pathParams ?? []).map((p) => (
          <label key={p.name} className={labelCls}>{p.name}<input value={path[p.name] ?? ""} onChange={(x) => setPath({ ...path, [p.name]: x.target.value })} className={inputCls} /><span className="text-[12px] font-normal text-fg-muted">{p.description}</span></label>
        ))}

        {hasIdem && (
          <label className={labelCls}>Idempotency-Key
            <span className="flex gap-2"><input value={idem} onChange={(x) => setIdem(x.target.value)} className={cn(inputCls, "min-w-0 flex-1")} /><button type="button" onClick={() => setIdem(newKey())} aria-label="Make a new Idempotency-Key" className="grid h-11 w-11 place-items-center rounded-[var(--pd-radius-xs)] border border-edge-strong hover:bg-sunken"><RefreshCw size={16} aria-hidden="true" /></button></span>
            <span className="text-[12px] font-normal text-fg-muted">Send twice with the same key and body to see a replay. Change the body to see a 409.</span>
          </label>
        )}

        {scenarios && (
          <label className={labelCls}>Tefo-Sandbox-Scenario
            <select value={scenario} onChange={(x) => setScenario(x.target.value)} className={cn(inputCls, "font-sans")}>{SCENARIOS.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
        )}

        {e.body && (
          <label className={labelCls}>Request body (JSON, editable)
            <textarea value={body} onChange={(x) => setBody(x.target.value)} spellCheck={false} rows={Math.min(16, body.split("\n").length + 1)} aria-invalid={!!bodyError} aria-describedby={`${e.id}-bodyerr`} className={cn(inputCls, "py-3 leading-relaxed")} />
            <span id={`${e.id}-bodyerr`} className={cn("text-[12px] font-normal", bodyError ? "text-err" : "text-fg-muted")}>{bodyError ? `Problem: ${bodyError}` : "Valid JSON. amount is in cents."}</span>
          </label>
        )}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={send} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--pd-radius-sm)] bg-primary px-4 text-[14px] font-medium text-primary-fg hover:opacity-90"><Play size={15} aria-hidden="true" />Send simulated request</button>
          <button type="button" onClick={copyCurl} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--pd-radius-sm)] border border-edge-strong px-4 text-[14px] hover:bg-sunken">{copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copied ? "Copied" : "Copy as cURL"}</button>
          {body !== initial && e.body && <button type="button" onClick={() => setBody(initial)} className="min-h-11 rounded-[var(--pd-radius-sm)] px-3 text-[14px] text-fg-muted underline">Reset body</button>}
        </div>
        <span className="pd-vh" role="status">{copied ? "cURL copied to clipboard" : ""}</span>

        <div role="status" aria-live="polite" className="min-h-[2px]">
          {sim && (
            <div className="grid gap-3 rounded-[var(--pd-radius-sm)] border border-edge bg-sunken p-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
                <span className={cn("inline-flex items-center gap-1.5 font-medium", ok ? "text-ok" : "text-err")}>{ok ? <Check size={15} aria-hidden="true" /> : <CircleX size={15} aria-hidden="true" />}{sim.status} {REASON[sim.status] ?? ""}{ok ? "" : ", failed"}</span>
                <span className="pd-num text-fg-muted">{sim.latencyMs} ms <span className="text-[12px]">(simulated)</span></span>
                <span className="rounded-full border border-[var(--pd-info)] px-2 text-[11px]">Simulated response</span>
              </div>
              <div role="tablist" aria-label="Response" className="flex gap-1 border-b border-edge">
                {(["body", "headers", ...(sim.webhook !== undefined ? ["webhook"] : [])] as const).map((t) => <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t as typeof tab)} className="min-h-11 border-b-2 border-transparent px-3 text-[13px] font-medium text-fg-muted aria-selected:border-[var(--pd-accent)] aria-selected:text-fg">{t === "body" ? "Body" : t === "headers" ? "Headers" : "Webhook sent next"}</button>)}
              </div>
              <pre tabIndex={0} aria-label="Response" className="max-h-80 overflow-auto rounded-[var(--pd-radius-xs)] bg-code p-3 font-mono text-[12.5px] leading-relaxed text-code-fg">
                {tab === "body" ? pretty(sim.body) : tab === "headers" ? sim.headers.map(([k, v]) => `${k}: ${v}`).join("\n") : pretty(sim.webhook)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
