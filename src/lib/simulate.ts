import type { Endpoint } from "@/content/api";

export interface SimInput {
  body: string;
  scenario: string;
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
/** Remembers idempotency keys for one visit, like the real API would for 24 hours. */
export type IdemStore = Map<string, { fingerprint: string; result: Sim }>;

const FAIL: Record<string, { code: string; message: string }> = {
  insufficient_funds: { code: "insufficient_funds", message: "The customer does not have enough money." },
  customer_cancelled: { code: "customer_cancelled", message: "The customer cancelled the request on their phone." },
  no_response: { code: "no_response", message: "The customer did not respond in time." },
};

const err = (status: number, code: string, message: string, param?: string): Sim => ({
  status,
  body: { error: { code, message, ...(param ? { param } : {}), request_id: "req_sim" } },
  headers: [["Content-Type", "application/json"], ["Tefo-Simulated", "true"]],
  latencyMs: 0,
});

export const latencyFor = (seed: string) => {
  let h = 7;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return 60 + (h % 180);
};

export function simulate(e: Endpoint, input: SimInput, store: IdemStore = new Map()): Sim {
  const done = (s: Sim): Sim => ({ ...s, latencyMs: latencyFor(e.id + input.body + input.scenario), headers: s.headers.length ? s.headers : [["Content-Type", "application/json"], ["Tefo-Simulated", "true"]] });

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
    if (e.id === "create-payout" && (body.amount as number) % 100 !== 0) return done(err(400, "invalid_request", "Payouts must be whole shillings: amount must be a multiple of 100.", "amount"));
    if (e.body.find((x) => x.name === "currency") && body.currency && body.currency !== "KES") return done(err(400, "invalid_request", "currency must be KES.", "currency"));
    const bad = e.body.find((f) => f.values && body[f.name] !== undefined && !f.values.includes(String(body[f.name])));
    if (bad) return done(err(400, "invalid_request", `${bad.name} must be one of: ${bad.values!.join(", ")}.`, bad.name));
  }

  const idemOn = e.headers?.some((h) => h.name === "Idempotency-Key") && input.idempotencyKey.trim();
  const fingerprint = `${e.id}|${input.body.replace(/\s+/g, "")}|${input.scenario}`;
  if (idemOn) {
    const prev = store.get(input.idempotencyKey);
    if (prev) {
      if (prev.fingerprint !== fingerprint) return done(err(409, "idempotency_conflict", "The Idempotency-Key was used with different parameters."));
      return { ...prev.result, headers: [...prev.result.headers, ["Idempotent-Replayed", "true"]] };
    }
  }

  const result = done(run(e, body, input.scenario));
  if (idemOn && result.status < 400) store.set(input.idempotencyKey, { fingerprint, result });
  return result;
}

function run(e: Endpoint, body: Record<string, unknown>, scenario: string): Sim {
  const headers: [string, string][] = [["Content-Type", "application/json"], ["Tefo-Simulated", "true"]];
  const resp = JSON.parse(JSON.stringify(e.response));
  if (e.id === "create-collection" || e.id === "simulate-payment") {
    const f = FAIL[scenario];
    const base = { ...resp, ...(typeof body.amount === "number" ? { amount: body.amount } : {}), ...(typeof body.reference === "string" ? { reference: body.reference } : {}) };
    const final = { ...base, status: f ? "failed" : "succeeded", failure: f ?? null, match: f ? null : { state: "matched", sale_id: "sale_1042" } };
    const webhook = { id: "evt_sim", object: "event", type: f ? "collection.failed" : "collection.recorded", livemode: false, data: { object: final } };
    if (e.id === "simulate-payment") return { status: 201, body: final, headers, latencyMs: 0, webhook };
    return { status: 201, body: { ...base, status: "pending", match: null, failure: null }, headers, latencyMs: 0, webhook };
  }
  return { status: e.status, body: resp, headers, latencyMs: 0 };
}
