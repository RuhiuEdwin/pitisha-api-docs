import type { Endpoint } from "@/content/api";

export interface SimInput {
  body: string;
  /** The secret key typed into Try it. */
  key: string;
  idempotencyKey: string;
}
export interface Sim {
  status: number;
  body: unknown;
  headers: [string, string][];
  /** Always simulated: a number made from the request, not a measurement of any server. */
  latencyMs: number;
  webhook?: unknown;
}
/** Remembers idempotency keys for one visit, like the real API remembers them. */
export type IdemStore = Map<string, { fingerprint: string; result: Sim }>;

/** What the sandbox decides: simulate_payment names a scenario, a payment request is decided by the end of the phone number. */
const FAIL: Record<string, { code: string; message: string }> = {
  insufficient: { code: "1", message: "The customer has insufficient M-Pesa balance." },
  cancelled: { code: "1032", message: "The customer cancelled the request." },
};
const PHONE_FAIL = { code: "1032", message: "Request cancelled by user" };

const err = (status: number, code: string, message: string, param?: string): Sim => ({
  status,
  body: { error: { code, message, ...(param ? { param } : {}), request_id: "req_sim" } },
  headers: [["Content-Type", "application/json"], ["Tefo-Simulated", "true"]],
  latencyMs: 0,
});

const latencyFor = (seed: string) => {
  let h = 7;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return 60 + (h % 180);
};

export function simulate(e: Endpoint, input: SimInput, store: IdemStore = new Map()): Sim {
  const done = (s: Sim): Sim => ({ ...s, latencyMs: latencyFor(e.id + input.body), headers: s.headers.length ? s.headers : [["Content-Type", "application/json"], ["Tefo-Simulated", "true"]] });

  if (!input.key.trim()) return done(err(401, "authentication_failed", "No API key. Send Authorization: Bearer sk_test_..."));
  if (input.key.startsWith("sk_live_")) return done(err(401, "authentication_failed", "A live key does not work in the simulated sandbox. This page never sends live requests."));
  if (!input.key.startsWith("sk_test_")) return done(err(401, "authentication_failed", "The key must start with sk_test_ in the sandbox."));

  let body: Record<string, unknown> = {};
  if (e.body) {
    try { body = JSON.parse(input.body || "{}"); } catch { return done(err(400, "invalid_request", "The request body is not valid JSON.")); }
    for (const f of e.body.filter((x) => x.required)) {
      if (body[f.name] === undefined || body[f.name] === null || body[f.name] === "") return done(err(400, "invalid_request", `${f.name} is required.`, f.name));
    }
    if ("amount" in body && !(Number.isInteger(body.amount) && (body.amount as number) > 0)) return done(err(400, "invalid_request", "amount must be a positive integer in the smallest unit (cents).", "amount"));
    if ((e.id === "create-payout" || e.id === "create-payment-request") && (body.amount as number) % 100 !== 0) return done(err(400, "invalid_request", "Whole shillings only: amount must be a multiple of 100.", "amount"));
    const bad = e.body.find((f) => f.values && body[f.name] !== undefined && !f.values.includes(String(body[f.name])));
    if (bad) return done(err(400, "invalid_request", `${bad.name} must be one of: ${bad.values!.join(", ")}.`, bad.name));
  }

  const idemHeader = e.headers?.find((h) => h.name === "Idempotency-Key");
  if (idemHeader?.required && !input.idempotencyKey.trim()) return done(err(400, "invalid_request", "Send an Idempotency-Key header on this request so a retry cannot repeat it."));
  const idemOn = !!idemHeader && input.idempotencyKey.trim();
  const fingerprint = `${e.id}|${input.body.replace(/\s+/g, "")}`;
  if (idemOn) {
    const prev = store.get(input.idempotencyKey);
    if (prev) {
      if (prev.fingerprint !== fingerprint) return done(err(409, "idempotency_conflict", "The Idempotency-Key was used with different parameters."));
      return { ...prev.result, headers: [...prev.result.headers, ["Idempotent-Replayed", "true"]] };
    }
  }

  const result = done(run(e, body));
  if (idemOn && result.status < 400) store.set(input.idempotencyKey, { fingerprint, result });
  return result;
}

function run(e: Endpoint, body: Record<string, unknown>): Sim {
  const headers: [string, string][] = [["Content-Type", "application/json"], ["Tefo-Simulated", "true"]];
  const resp = JSON.parse(JSON.stringify(e.response));
  const amount = typeof body.amount === "number" ? { amount: body.amount } : {};
  const reference = typeof body.reference === "string" ? { reference: body.reference } : {};
  const event = (final: { status: string }) => ({ id: "evt_sim", object: "event", type: final.status === "failed" ? "collection.failed" : "collection.recorded", livemode: false, data: { object: final } });

  if (e.id === "simulate-payment") {
    const f = FAIL[String(body.scenario ?? "success")];
    const pending = body.scenario === "timeout";
    const final = { ...resp, ...amount, ...reference, status: f ? "failed" : pending ? "pending" : "succeeded", receipt: f || pending ? null : resp.receipt, failure: f ?? null };
    return { status: 201, body: final, headers, latencyMs: 0, ...(pending ? {} : { webhook: event(final) }) };
  }
  if (e.id === "create-payment-request") {
    const phone = String((body.customer as { phone?: string } | undefined)?.phone ?? "");
    const outcome = phone.endsWith("0001") ? "failed" : phone.endsWith("0002") ? "pending" : "succeeded";
    const collection = { ...resp.collection, ...amount, ...reference, status: outcome, receipt: outcome === "succeeded" ? "SBX8F3K2Q" : null, failure: outcome === "failed" ? PHONE_FAIL : null };
    const out = { ...resp, ...amount, status: outcome === "pending" ? "sent" : outcome, collection };
    return { status: 201, body: out, headers, latencyMs: 0, ...(outcome === "pending" ? {} : { webhook: event(collection) }) };
  }
  return { status: e.status, body: resp, headers, latencyMs: 0 };
}
