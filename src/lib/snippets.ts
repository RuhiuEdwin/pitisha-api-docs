import type { Endpoint } from "@/content/api";

export type Lang = "curl" | "javascript" | "python" | "php";
export const LANGS: { id: Lang; label: string; shiki: string }[] = [
  { id: "curl", label: "cURL", shiki: "bash" },
  { id: "javascript", label: "JavaScript", shiki: "javascript" },
  { id: "python", label: "Python", shiki: "python" },
  { id: "php", label: "PHP", shiki: "php" },
];

/** A request described once, rendered in every language. Quickstart, recipes and the reference all use it. */
export interface Req {
  method: string;
  path: string;
  headers?: [string, string][];
  body?: unknown;
}

const SAMPLE: Record<string, string> = { id: "ID_FROM_RESPONSE", day: "2026-10-27" };
export const samplePath = (p: string) => p.replace(/\{(\w+)\}/g, (_, k) => SAMPLE[k] ?? k.toUpperCase());

export function reqOf(e: Endpoint): Req {
  const headers: [string, string][] = [];
  if (e.body) headers.push(["Content-Type", "application/json"]);
  if (e.headers?.some((x) => x.name === "Idempotency-Key")) headers.push(["Idempotency-Key", `${e.id}-1`]);
  const required = (e.query ?? []).filter((q) => q.required).map((q) => `${q.name}=${q.example ?? q.name.toUpperCase()}`);
  return { method: e.method, path: samplePath(e.path) + (required.length ? `?${required.join("&")}` : ""), headers, body: e.bodyExample };
}

const json = (v: unknown) => JSON.stringify(v, null, 2);

function phpValue(v: unknown, depth = 1): string {
  const pad = "  ".repeat(depth);
  const end = "  ".repeat(depth - 1);
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return `'${v.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  if (Array.isArray(v)) return v.length ? `[\n${v.map((x) => `${pad}${phpValue(x, depth + 1)},`).join("\n")}\n${end}]` : "[]";
  const o = v as Record<string, unknown>;
  const k = Object.keys(o);
  return k.length ? `[\n${k.map((key) => `${pad}'${key}' => ${phpValue(o[key], depth + 1)},`).join("\n")}\n${end}]` : "[]";
}

const pyValue = (v: unknown) => json(v).replace(/\btrue\b/g, "True").replace(/\bfalse\b/g, "False").replace(/\bnull\b/g, "None");

export function render(r: Req, lang: Lang): string {
  const h: [string, string][] = [["Authorization", "Bearer $TEFO_SECRET_KEY"], ...(r.headers ?? [])];
  const hasBody = r.body !== undefined;
  if (lang === "curl") {
    const lines = [`curl -X ${r.method} "$TEFO_API${r.path}"`, ...h.map(([k, v]) => `  -H "${k}: ${v}"`)];
    if (hasBody) lines.push(`  -d '${json(r.body).replace(/\n/g, "\n  ")}'`);
    return lines.join(" \\\n");
  }
  if (lang === "javascript") {
    const hs = h.map(([k, v]) => `    "${k}": ${v.includes("$") ? "`Bearer ${process.env.TEFO_SECRET_KEY}`" : `"${v}"`},`).join("\n");
    return `const res = await fetch(\`\${process.env.TEFO_API}${r.path}\`, {\n  method: "${r.method}",\n  headers: {\n${hs}\n  },${hasBody ? `\n  body: JSON.stringify(${json(r.body).replace(/\n/g, "\n  ")}),` : ""}\n});\n\nif (!res.ok) throw new Error(\`Tefo \${res.status}: \${await res.text()}\`);\nconst data = await res.json();`;
  }
  if (lang === "python") {
    const hs = h.map(([k, v]) => `        "${k}": ${v.includes("$") ? 'f"Bearer {os.environ[\'TEFO_SECRET_KEY\']}"' : `"${v}"`},`).join("\n");
    return `import os\nimport requests\n\nres = requests.request(\n    "${r.method}",\n    f"{os.environ['TEFO_API']}${r.path}",\n    headers={\n${hs}\n    },${hasBody ? `\n    json=${pyValue(r.body).replace(/\n/g, "\n    ")},` : ""}\n)\nres.raise_for_status()\ndata = res.json()`;
  }
  const hs = h.map(([k, v]) => `    '${k}: ${v.includes("$") ? "Bearer ' . getenv('TEFO_SECRET_KEY') . '" : v}',`).join("\n");
  return `<?php\n$ch = curl_init(getenv('TEFO_API') . '${r.path}');\ncurl_setopt_array($ch, [\n  CURLOPT_CUSTOMREQUEST => '${r.method}',\n  CURLOPT_RETURNTRANSFER => true,\n  CURLOPT_HTTPHEADER => [\n${hs}\n  ],${hasBody ? `\n  CURLOPT_POSTFIELDS => json_encode(${phpValue(r.body, 2)}),` : ""}\n]);\n\n$body = curl_exec($ch);\n$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);\nif ($status >= 400) throw new RuntimeException("Tefo $status: $body");\n$data = json_decode($body, true);`;
}

export const snippet = (e: Endpoint, lang: Lang) => render(reqOf(e), lang);
export const pretty = (v: unknown) => JSON.stringify(v, null, 2);

/** A runnable cURL for what the person typed into Try it. Uses the real base URL if one is configured, else the variable. */
export function curlFor(opts: { method: string; path: string; body?: string; headers: [string, string][]; base: string | null; key: string }): string {
  const q = (s: string) => s.replace(/'/g, `'\\''`);
  const url = `${opts.base ?? "$TEFO_API"}${opts.path}`;
  const lines = [`curl -X ${opts.method} '${q(url)}'`, `  -H 'Authorization: Bearer ${opts.key ? q(opts.key) : "$TEFO_SECRET_KEY"}'`];
  for (const [k, v] of opts.headers) lines.push(`  -H '${q(k)}: ${q(v)}'`);
  if (opts.body && opts.body.trim()) lines.push(`  -d '${q(opts.body.trim())}'`);
  return lines.join(" \\\n");
}
