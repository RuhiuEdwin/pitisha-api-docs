import { describe, expect, it } from "vitest";
import { allEndpoints } from "@/content/api";
import { simulate, type IdemStore } from "@/lib/simulate";

const ep = (id: string) => allEndpoints().find((x) => x.endpoint.id === id)!.endpoint;
const base = { scenario: "success", key: "sk_test_abc", idempotencyKey: "k1" };
const body = JSON.stringify({ amount: 250000, currency: "KES", source: "paybill", customer: { phone: "+254712000000" } });

describe("simulated sandbox", () => {
  it("needs a test key and never accepts a live one", () => {
    expect(simulate(ep("create-collection"), { ...base, key: "", body }).status).toBe(401);
    const live = simulate(ep("create-collection"), { ...base, key: "sk_live_x", body });
    expect(live.status).toBe(401);
    expect(JSON.stringify(live.body)).toContain("never sends live requests");
  });
  it("checks required fields, cents and allowed values", () => {
    const c = ep("create-collection");
    expect(simulate(c, { ...base, body: "{" }).status).toBe(400);
    expect(simulate(c, { ...base, body: JSON.stringify({ currency: "KES" }) }).body).toMatchObject({ error: { param: "amount" } });
    expect(simulate(c, { ...base, body: JSON.stringify({ ...JSON.parse(body), amount: 25.5 }) }).body).toMatchObject({ error: { param: "amount" } });
    expect(simulate(c, { ...base, body: JSON.stringify({ ...JSON.parse(body), source: "cash" }) }).body).toMatchObject({ error: { param: "source" } });
  });
  it("makes payouts whole shillings", () => {
    const p = ep("create-payout");
    const ok = { amount: 1200000, currency: "KES", wallet_id: "w", destination: { type: "phone", phone: "+254722000000" } };
    expect(simulate(p, { ...base, body: JSON.stringify(ok) }).status).toBe(201);
    expect(simulate(p, { ...base, body: JSON.stringify({ ...ok, amount: 1200050 }) }).status).toBe(400);
  });
  it("plays the scenarios and the webhook that follows", () => {
    const c = ep("create-collection");
    const okSim = simulate(c, { ...base, body });
    expect(okSim.status).toBe(201);
    expect(okSim.body).toMatchObject({ status: "pending" });
    expect(okSim.webhook).toMatchObject({ type: "collection.recorded" });
    const fail = simulate(c, { ...base, scenario: "insufficient_funds", idempotencyKey: "k2", body });
    expect(fail.webhook).toMatchObject({ type: "collection.failed", data: { object: { failure: { code: "insufficient_funds" } } } });
  });
  it("replays on the same key and body, conflicts on a different body", () => {
    const c = ep("create-collection");
    const store: IdemStore = new Map();
    simulate(c, { ...base, body }, store);
    const again = simulate(c, { ...base, body }, store);
    expect(again.headers).toContainEqual(["Idempotent-Replayed", "true"]);
    const other = simulate(c, { ...base, body: JSON.stringify({ ...JSON.parse(body), amount: 1 }) }, store);
    expect(other).toMatchObject({ status: 409, body: { error: { code: "idempotency_conflict" } } });
  });
  it("labels every response simulated and gives a stable latency", () => {
    const a = simulate(ep("create-collection"), { ...base, body });
    expect(a.headers).toContainEqual(["Pitisha-Simulated", "true"]);
    expect(simulate(ep("create-collection"), { ...base, body, idempotencyKey: "z" }).latencyMs).toBe(a.latencyMs);
  });
});
