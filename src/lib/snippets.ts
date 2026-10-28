import type { Endpoint } from "@/content/api";

export type Lang = "curl" | "javascript" | "python";
export const LANGS: { id: Lang; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
];

const SAMPLE: Record<string, string> = { id: "ID_FROM_RESPONSE", day: "2026-10-27" };

export const samplePath = (e: Endpoint) => e.path.replace(/\{(\w+)\}/g, (_, k) => SAMPLE[k] ?? k.toUpperCase());

function headers(e: Endpoint) {
  const h: [string, string][] = [["Authorization", "Bearer $PITISHA_SECRET_KEY"]];
  if (e.body) h.push(["Content-Type", "application/json"]);
  if (e.headers?.some((x) => x.name === "Idempotency-Key")) h.push(["Idempotency-Key", "order-1042-attempt-1"]);
  return h;
}

export function snippet(e: Endpoint, lang: Lang): string {
  const path = samplePath(e);
  const h = headers(e);
  const body = e.bodyExample !== undefined ? JSON.stringify(e.bodyExample, null, 2) : null;
  if (lang === "curl") {
    const lines = [`curl -X ${e.method} "$PITISHA_API${path}"`, ...h.map(([k, v]) => `  -H "${k}: ${v}"`)];
    if (body) lines.push(`  -d '${body.replace(/\n/g, "\n  ")}'`);
    return lines.join(" \\\n");
  }
  if (lang === "javascript") {
    const hs = h.map(([k, v]) => `    "${k}": ${v.includes("$") ? "`Bearer ${process.env.PITISHA_SECRET_KEY}`" : `"${v}"`},`).join("\n");
    return `const res = await fetch(\`\${process.env.PITISHA_API}${path}\`, {\n  method: "${e.method}",\n  headers: {\n${hs}\n  },${body ? `\n  body: JSON.stringify(${body.replace(/\n/g, "\n  ")}),` : ""}\n});\n\nif (!res.ok) throw new Error(\`Pitisha \${res.status}: \${await res.text()}\`);\nconst data = await res.json();`;
  }
  const hs = h.map(([k, v]) => `        "${k}": ${v.includes("$") ? 'f"Bearer {os.environ[\'PITISHA_SECRET_KEY\']}"' : `"${v}"`},`).join("\n");
  const py = body ? body.replace(/true/g, "True").replace(/false/g, "False").replace(/null/g, "None") : "";
  return `import os\nimport requests\n\nres = requests.request(\n    "${e.method}",\n    f"{os.environ['PITISHA_API']}${path}",\n    headers={\n${hs}\n    },${body ? `\n    json=${py.replace(/\n/g, "\n    ")},` : ""}\n)\nres.raise_for_status()\ndata = res.json()`;
}

export const pretty = (v: unknown) => JSON.stringify(v, null, 2);
