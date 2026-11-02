import { RESOURCES } from "@/content/api";
import { API_VERSION } from "@/content/config";
import { reqOf } from "@/lib/snippets";

/** Postman Collection v2.1, built from the same endpoints as the reference and the OpenAPI file. */
export function buildPostman() {
  return {
    info: {
      name: "Tefo API (proposed)",
      description: `Version ${API_VERSION}. Set the variables baseUrl and secretKey. Amounts are integers in cents: 250000 is KES 2,500.00. The endpoints and webhook scheme are a proposal until the backend matches.`,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    auth: { type: "bearer", bearer: [{ key: "token", value: "{{secretKey}}", type: "string" }] },
    variable: [{ key: "baseUrl", value: "https://YOUR-BASE-URL" }, { key: "secretKey", value: "sk_test_..." }],
    item: RESOURCES.map((r) => ({
      name: r.title,
      item: r.endpoints.map((e) => {
        const req = reqOf(e);
        const [pathOnly, qs] = e.path.split("?");
        const path = pathOnly.replace(/\{(\w+)\}/g, ":$1").split("/").filter(Boolean);
        return {
          name: e.title,
          request: {
            method: e.method,
            header: [...(req.headers ?? []), ...(e.headers ?? []).filter((h) => h.name !== "Idempotency-Key").map((h) => [h.name, ""] as [string, string])].map(([key, value]) => ({ key, value })),
            url: {
              raw: `{{baseUrl}}${e.path.replace(/\{(\w+)\}/g, ":$1")}${qs ?? ""}`,
              host: ["{{baseUrl}}"],
              path,
              variable: (e.pathParams ?? []).map((p) => ({ key: p.name, value: "", description: p.description })),
              query: (e.query ?? []).map((q) => ({ key: q.name, value: "", description: q.description, disabled: true })),
            },
            ...(e.bodyExample !== undefined ? { body: { mode: "raw", raw: JSON.stringify(e.bodyExample, null, 2), options: { raw: { language: "json" } } } } : {}),
            description: [e.summary, e.description].filter(Boolean).join("\n\n"),
          },
        };
      }),
    })),
  };
}
