import { describe, expect, it } from "vitest";
import { allEndpoints } from "@/content/api";
import { simulate, type IdemStore } from "@/lib/simulate";

const ep = (id: string) => allEndpoints().find((x) => x.endpoint.id === id)!.endpoint;
const base = { key: "sk_test_abc", idempotencyKey: "k1" };
const pay = (phone: string, extra: object = {}) => JSON.stringify({ amount: 250000, wallet_id: "wal_main", customer: { phone }, ...extra });
const body = pay("+254712000000");

describe("simulated sandbox", () => {
  it("needs a test key and never accepts a live one", () => {
    expect(simulate(ep("create-payment-request"), { ...base, key: "", body }).status).toBe(401);
    const live = simulate(ep("create-payment-request"), { ...base, key: "sk_live_x", body });
    expect(live.status).toBe(401);
    expect(JSON.stringify(live.body)).toContain("never sends live requests");
  });
  it("checks required fields, whole shillings and allowed values", () => {
    const c = ep("create-payment-request");
    expect(simulate(c, { ...base, body: "{" }).status).toBe(400);
    expect(simulate(c, { ...base, body: JSON.stringify({ wallet_id: "w" }) }).body).toMatchObject({ error: { param: "amount" } });
    expect(simulate(c, { ...base, body: pay("0712000000", { amount: 25.5 }) }).body).toMatchObject({ error: { param: "amount" } });
    expect(simulate(c, { ...base, body: pay("0712000000", { amount: 250050 }) }).body).toMatchObject({ error: { param: "amount" } });
    expect(simulate(c, { ...base, body: pay("0712000000", { rail: "cash" }) }).body).toMatchObject({ error: { param: "rail" } });
  });
  it("refuses a money request without an Idempotency-Key, like an API key does", () => {
    expect(simulate(ep("create-payment-request"), { ...base, idempotencyKey: " ", body })).toMatchObject({ status: 400, body: { error: { code: "invalid_request" } } });
  });
  it("makes payouts whole shillings", () => {
    const p = ep("create-payout");
    const ok = { amount: 1200000, wallet_id: "w", destination: { type: "phone", phone: "+254722000000" } };
    expect(simulate(p, { ...base, body: JSON.stringify(ok) }).status).toBe(201);
    expect(simulate(p, { ...base, body: JSON.stringify({ ...ok, amount: 1200050 }) }).status).toBe(400);
  });
  it("decides by the phone number and sends the webhook that follows", () => {
    const c = ep("create-payment-request");
    const okSim = simulate(c, { ...base, body });
    expect(okSim.status).toBe(201);
    expect(okSim.body).toMatchObject({ status: "succeeded", collection: { status: "succeeded" } });
    expect(okSim.webhook).toMatchObject({ type: "collection.recorded" });
    const fail = simulate(c, { ...base, idempotencyKey: "k2", body: pay("+254712000001") });
    expect(fail.webhook).toMatchObject({ type: "collection.failed", data: { object: { failure: { code: "1032" } } } });
    const pending = simulate(c, { ...base, idempotencyKey: "k3", body: pay("+254712000002") });
    expect(pending.body).toMatchObject({ status: "sent", collection: { status: "pending" } });
    expect(pending.webhook).toBeUndefined();
  });
  it("plays the simulate_payment scenarios", () => {
    const s = ep("simulate-payment");
    const run = (scenario: string) => simulate(s, { ...base, body: JSON.stringify({ amount: 150000, scenario }) });
    expect(run("insufficient").webhook).toMatchObject({ type: "collection.failed", data: { object: { failure: { code: "1" } } } });
    expect(run("timeout")).toMatchObject({ body: { status: "pending" } });
    expect(run("success").webhook).toMatchObject({ type: "collection.recorded" });
  });
  it("replays on the same key and body, conflicts on a different body", () => {
    const c = ep("create-payment-request");
    const store: IdemStore = new Map();
    simulate(c, { ...base, body }, store);
    const again = simulate(c, { ...base, body }, store);
    expect(again.headers).toContainEqual(["Idempotent-Replayed", "true"]);
    const other = simulate(c, { ...base, body: pay("+254712000000", { amount: 100 }) }, store);
    expect(other).toMatchObject({ status: 409, body: { error: { code: "idempotency_conflict" } } });
  });
  it("labels every response simulated and gives a stable latency", () => {
    const a = simulate(ep("create-payment-request"), { ...base, body });
    expect(a.headers).toContainEqual(["Tefo-Simulated", "true"]);
    expect(simulate(ep("create-payment-request"), { ...base, body, idempotencyKey: "z" }).latencyMs).toBe(a.latencyMs);
  });
});
