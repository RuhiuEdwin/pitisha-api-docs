import { describe, expect, it } from "vitest";
import { LANGS, curlFor, render, type Req } from "@/lib/snippets";

const req: Req = { method: "POST", path: "/v1/payment_requests", headers: [["Content-Type", "application/json"], ["Idempotency-Key", "k-1"]], body: { amount: 250000, ok: true, note: "it's", none: null, list: [1] } };

describe("snippets", () => {
  it("renders every language from one request", () => {
    for (const l of LANGS) {
      const code = render(req, l.id);
      expect(code, l.id).toContain("/v1/payment_requests");
      expect(code, l.id).toContain("250000");
      expect(code, l.id).toContain("Idempotency-Key");
      expect(code, l.id).toContain("TEFO_SECRET_KEY");
    }
  });
  it("converts JSON to Python and PHP literals", () => {
    expect(render(req, "python")).toContain("True");
    expect(render(req, "python")).toContain("None");
    const php = render(req, "php");
    expect(php).toContain("'amount' => 250000");
    expect(php).toContain("'it\\'s'");
    expect(php).toContain("true");
  });
  it("never inlines a secret", () => { for (const l of LANGS) expect(render(req, l.id)).not.toMatch(/sk_(test|live)_/); });
  it("builds a runnable cURL for Try it, quoting single quotes", () => {
    const c = curlFor({ method: "POST", path: "/v1/x", body: `{"a":"it's"}`, headers: [["Idempotency-Key", "k"]], base: null, key: "" });
    expect(c).toContain("$TEFO_API/v1/x");
    expect(c).toContain("Bearer $TEFO_SECRET_KEY");
    expect(c).toContain(`'{"a":"it'\\''s"}'`);
    expect(curlFor({ method: "GET", path: "/v1/y", headers: [], base: "https://api.test", key: "sk_test_1" })).toContain("https://api.test/v1/y");
  });
});
