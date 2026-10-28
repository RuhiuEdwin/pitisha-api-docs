import { ERRORS, RESOURCES, type Field } from "@/content/api";

const typeOf = (t: string): Record<string, unknown> => {
  const base = t.replace(" | null", "");
  const nullable = t.includes("null");
  const m: Record<string, Record<string, unknown>> = { string: { type: "string" }, integer: { type: "integer" }, boolean: { type: "boolean" }, object: { type: "object" }, "string[]": { type: "array", items: { type: "string" } } };
  const o = { ...(m[base] ?? { type: "string" }) };
  return nullable ? { ...o, nullable: true } : o;
};
const schemaOf = (fs: Field[]) => ({
  type: "object",
  required: fs.filter((f) => f.required).map((f) => f.name),
  properties: Object.fromEntries(fs.map((f) => [f.name, { ...typeOf(f.type), description: f.description, ...(f.values ? { enum: f.values } : {}) }])),
});

export function buildOpenApi() {
  const paths: Record<string, Record<string, unknown>> = {};
  for (const r of RESOURCES) {
    for (const e of r.endpoints) {
      const params = [
        ...(e.pathParams ?? []).map((p) => ({ name: p.name, in: "path", required: true, description: p.description, schema: typeOf(p.type) })),
        ...(e.query ?? []).map((p) => ({ name: p.name, in: "query", description: p.description, schema: { ...typeOf(p.type), ...(p.values ? { enum: p.values } : {}) } })),
        ...(e.headers ?? []).map((p) => ({ name: p.name, in: "header", description: p.description, schema: { type: "string" } })),
      ];
      const op: Record<string, unknown> = {
        operationId: e.id.replace(/-/g, "_"),
        tags: [r.title],
        summary: e.title,
        description: [e.summary, e.description].filter(Boolean).join("\n\n"),
        parameters: params,
        responses: {
          [String(e.status)]: { description: "Success", content: { "application/json": { example: e.response } } },
          ...Object.fromEntries((e.errors ?? []).map((c) => { const er = ERRORS.find((x) => x.code === c)!; return [String(er.status), { description: er.meaning, content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }]; })),
        },
      };
      if (e.body) op.requestBody = { required: true, content: { "application/json": { schema: schemaOf(e.body), ...(e.bodyExample ? { example: e.bodyExample } : {}) } } };
      (paths[e.path] ??= {})[e.method.toLowerCase()] = op;
    }
  }
  return {
    openapi: "3.1.0",
    info: { title: "Pitisha API", version: "2026-10-28", description: "One integration for every way Kenyans pay, and one record of every shilling, in and out. Amounts are integers in the smallest unit (250000 is KES 2,500.00). Money goes straight into your own till." },
    servers: [{ url: "{baseUrl}", description: "Your sandbox or live base URL from the portal", variables: { baseUrl: { default: "https://YOUR-BASE-URL" } } }],
    security: [{ bearer: [] }],
    tags: RESOURCES.map((r) => ({ name: r.title, description: r.blurb })),
    paths,
    components: {
      securitySchemes: { bearer: { type: "http", scheme: "bearer", description: "Send your secret key: Authorization: Bearer sk_test_..." } },
      schemas: {
        Error: { type: "object", properties: { error: { type: "object", properties: { code: { type: "string", enum: ERRORS.map((e) => e.code) }, message: { type: "string" }, param: { type: "string" }, request_id: { type: "string" } } } } },
        ...Object.fromEntries(RESOURCES.filter((r) => r.object).map((r) => [r.object!.name.replace(/ /g, ""), { ...schemaOf(r.object!.fields), example: r.object!.example }])),
      },
    },
  };
}
