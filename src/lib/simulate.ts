import type { Endpoint } from "@/content/api";

export interface Sim { status: number; body: unknown; webhook?: unknown }

const FAIL: Record<string, { code: string; message: string }> = {
  insufficient_funds: { code: "insufficient_funds", message: "The customer does not have enough money." },
  customer_cancelled: { code: "customer_cancelled", message: "The customer cancelled the request on their phone." },
  no_response: { code: "no_response", message: "The customer did not respond in time." },
};

export function simulate(e: Endpoint, bodyText: string, scenario: string): Sim {
  let body: Record<string, unknown> = {};
  if (e.body) {
    try { body = JSON.parse(bodyText || "{}"); } catch { return { status: 400, body: { error: { code: "invalid_request", message: "The request body is not valid JSON.", request_id: "req_sim" } } }; }
    for (const f of e.body.filter((x) => x.required)) {
      if (body[f.name] === undefined || body[f.name] === null || body[f.name] === "") return { status: 400, body: { error: { code: "invalid_request", message: `${f.name} is required.`, param: f.name, request_id: "req_sim" } } };
    }
    if ("amount" in body && !(Number.isInteger(body.amount) && (body.amount as number) > 0)) return { status: 400, body: { error: { code: "invalid_request", message: "amount must be a positive integer in the smallest unit.", param: "amount", request_id: "req_sim" } } };
    if (e.body.find((x) => x.name === "currency") && body.currency && body.currency !== "KES") return { status: 400, body: { error: { code: "invalid_request", message: "currency must be KES.", param: "currency", request_id: "req_sim" } } };
  }
  const resp = JSON.parse(JSON.stringify(e.response));
  if (e.id === "create-collection" || e.id === "simulate-payment") {
    const f = FAIL[scenario];
    const base = { ...resp, ...(typeof body.amount === "number" ? { amount: body.amount } : {}), ...(typeof body.reference === "string" ? { reference: body.reference } : {}) };
    if (e.id === "simulate-payment") {
      const done = { ...base, status: f ? "failed" : "succeeded", failure: f ?? null, match: f ? null : { state: "matched", sale_id: "sale_1042" } };
      return { status: 201, body: done, webhook: { id: "evt_sim", object: "event", type: f ? "collection.failed" : "collection.recorded", livemode: false, data: { object: done } } };
    }
    const pending = { ...base, status: "pending", match: null, failure: null };
    const done = { ...base, status: f ? "failed" : "succeeded", failure: f ?? null, match: f ? null : { state: "matched", sale_id: "sale_1042" } };
    return { status: 201, body: pending, webhook: { id: "evt_sim", object: "event", type: f ? "collection.failed" : "collection.recorded", livemode: false, data: { object: done } } };
  }
  return { status: e.status, body: resp };
}
