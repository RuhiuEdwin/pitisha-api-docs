import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { parseHeader, safeEqual, sign, verify } from "@/lib/signature";

const secret = "whsec_test";
const body = '{"id":"evt_1","type":"collection.recorded"}';
const now = 1_761_639_700;

describe("webhook signature (proposed scheme v1)", () => {
  it("matches Node's HMAC-SHA256 over '<t>.<body>'", async () => {
    const t = 1_761_639_604;
    expect(await sign(secret, t, body)).toBe(createHmac("sha256", secret).update(`${t}.${body}`).digest("hex"));
  });
  it("accepts a fresh, correct signature", async () => {
    const t = now - 30;
    const v = await verify(body, `t=${t},v1=${await sign(secret, t, body)}`, secret, now);
    expect(v.ok).toBe(true);
  });
  it("rejects a changed body", async () => {
    const t = now - 30;
    const v = await verify(body + " ", `t=${t},v1=${await sign(secret, t, body)}`, secret, now);
    expect(v).toMatchObject({ ok: false, reason: "mismatch" });
  });
  it("rejects the wrong secret", async () => {
    const t = now - 30;
    expect(await verify(body, `t=${t},v1=${await sign("other", t, body)}`, secret, now)).toMatchObject({ ok: false, reason: "mismatch" });
  });
  it("rejects a valid but old signature (replay)", async () => {
    const t = now - 301;
    expect(await verify(body, `t=${t},v1=${await sign(secret, t, body)}`, secret, now)).toMatchObject({ ok: false, reason: "too_old" });
  });
  it("rejects a bad header and an empty secret", async () => {
    expect(await verify(body, "nonsense", secret, now)).toMatchObject({ reason: "bad_header" });
    expect(await verify(body, "t=1,v1=ab", "", now)).toMatchObject({ reason: "no_secret" });
  });
  it("parses the header and compares without early exit", () => {
    expect(parseHeader("t=1, v1=abc")).toEqual({ t: "1", v1: "abc" });
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "ab")).toBe(false);
  });
});
