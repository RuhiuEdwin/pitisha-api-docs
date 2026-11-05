"use client";

import { Check, CircleX, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { TOLERANCE_SECONDS, parseHeader, sign, verify, type Verdict } from "@/lib/signature";

const SAMPLE_BODY = '{"id":"evt_6h2p0q","object":"event","type":"collection.recorded","livemode":false,"data":{"object":{"id":"col_8f3k2q","status":"succeeded","amount":250000}}}';
const SAMPLE_SECRET = "whsec_example_not_a_real_secret";

const REASONS: Record<string, string> = {
  bad_header: "The header is not in the form t=<unix seconds>,v1=<hex>.",
  no_secret: "Enter your signing secret.",
  mismatch: "The signature does not match. Usual causes: the body was parsed and re-serialised, a different secret, or an extra newline.",
  too_old: `The signature is valid but older than ${TOLERANCE_SECONDS / 60} minutes. Reject it: this is how replays are stopped.`,
};

/** Runs entirely in your browser with Web Crypto. Nothing you paste leaves the page. The scheme is proposed. */
export function WebhookVerifier() {
  const [secret, setSecret] = useState("");
  const [body, setBody] = useState("");
  const [header, setHeader] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [busy, setBusy] = useState(false);

  const loadSample = async () => {
    const t = Math.floor(Date.now() / 1000);
    const v1 = await sign(SAMPLE_SECRET, t, SAMPLE_BODY);
    setSecret(SAMPLE_SECRET); setBody(SAMPLE_BODY); setHeader(`t=${t},v1=${v1}`); setVerdict(null);
  };
  const run = async () => {
    setBusy(true);
    try { setVerdict(await verify(body, header, secret)); } finally { setBusy(false); }
  };
  const parsed = header ? parseHeader(header) : null;
  const label = "grid gap-1 text-[13px] font-medium";
  const input = "rounded-[var(--pd-radius-xs)] border border-edge-strong bg-surface px-3 font-mono text-[13px]";

  return (
    <section id="verifier" aria-labelledby="verifier-h" className="scroll-mt-24 rounded-[var(--pd-radius-lg)] bg-surface shadow-pd-sm p-4 sm:p-5">
      <h2 id="verifier-h" className="flex items-center gap-2 text-[20px] font-normal"><ShieldCheck size={20} aria-hidden="true" />Signature verifier</h2>
      <p className="mt-1 max-w-[68ch] text-[14px] text-fg-muted">Paste a delivery to check it the way your server should. It runs in this browser and sends nothing. Use a test secret, not a live one. The scheme is <strong>proposed</strong> until the backend matches it.</p>
      <div className="mt-4 grid gap-4">
        <label className={label}>Signing secret<input type="password" autoComplete="off" spellCheck={false} value={secret} onChange={(e) => setSecret(e.target.value)} className={`${input} min-h-11`} /></label>
        <label className={label}>Tefo-Signature header<input value={header} onChange={(e) => setHeader(e.target.value)} placeholder="t=1761639604,v1=5257a8…" spellCheck={false} className={`${input} min-h-11`} aria-describedby="v-hdr" /><span id="v-hdr" className="text-[12px] font-normal text-fg-muted">{header ? (parsed ? `Timestamp ${parsed.t}, signature of ${parsed.v1.length} characters.` : "Problem: not in the form t=<unix seconds>,v1=<hex>.") : "Copy it from the delivery. It looks like t=1761639604,v1=<hex>."}</span></label>
        <label className={label}>Raw request body<textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} spellCheck={false} className={`${input} py-3`} /><span className="text-[12px] font-normal text-fg-muted">Exactly the bytes received. Pretty-printing the JSON changes the signature.</span></label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={run} disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--pd-radius-sm)] bg-primary px-4 text-[14px] font-medium text-primary-fg hover:opacity-90 disabled:opacity-60">Verify</button>
          <button type="button" onClick={loadSample} className="min-h-11 rounded-[var(--pd-radius-sm)] border border-edge-strong px-4 text-[14px] hover:bg-sunken">Fill with a sample</button>
        </div>
        <div role="status" aria-live="polite">
          {verdict && (verdict.ok ? (
            <p className="flex items-start gap-2 rounded-[var(--pd-radius-md)] bg-ok-bg p-4 text-[14px]"><Check size={18} aria-hidden="true" className="mt-0.5 shrink-0" /><span><strong>Valid.</strong> The signature matches and the request is {Math.abs(Math.round(verdict.ageSeconds))} seconds old, inside the {TOLERANCE_SECONDS / 60} minute window.</span></p>
          ) : (
            <div className="rounded-[var(--pd-radius-md)] bg-err-bg p-4 text-[14px]"><p className="flex items-start gap-2"><CircleX size={18} aria-hidden="true" className="mt-0.5 shrink-0" /><span><strong>Not valid.</strong> {REASONS[verdict.reason]}</span></p>{verdict.expected && verdict.reason === "mismatch" && <p className="mt-2 break-all font-mono text-[12px] text-fg-muted">Expected v1: {verdict.expected}</p>}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
