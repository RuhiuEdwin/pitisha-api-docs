import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { RESOURCES } from "@/content/api";

const dir = path.join(process.cwd(), "src/content/guides");

export interface Guide { slug: string; title: string; description: string; body: string }

export const GUIDE_ORDER = ["introduction", "quickstart", "authentication", "environments", "idempotency", "errors", "pagination", "webhooks", "sandbox", "matching", "gateways", "go-live", "changelog"];

export function getGuide(slug: string): Guide | null {
  const file = path.join(dir, slug + ".md");
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { slug, title: String(data.title), description: String(data.description ?? ""), body: content };
}

export const allGuides = () => GUIDE_ORDER.map((s) => getGuide(s)).filter(Boolean) as Guide[];

export const NAV = [
  { group: "Get started", items: allGuides().filter((g) => ["introduction", "quickstart", "authentication", "environments", "go-live"].includes(g.slug)).map((g) => ({ href: `/docs/${g.slug}/`, label: g.title })) },
  { group: "Concepts", items: allGuides().filter((g) => ["idempotency", "errors", "pagination", "webhooks", "sandbox", "matching", "gateways", "approvals", "fees"].includes(g.slug)).map((g) => ({ href: `/docs/${g.slug}/`, label: g.title })) },
  ...RESOURCES.map((r) => ({ group: r.title, items: [{ href: `/docs/reference/${r.id}/`, label: `${r.title} overview` }, ...r.endpoints.map((e) => ({ href: `/docs/reference/${r.id}/#${e.id}`, label: e.title, method: e.method }))] })),
  { group: "More", items: [{ href: "/docs/changelog/", label: "Changelog" }, { href: "/openapi.json", label: "OpenAPI file" }] },
];

export function searchIndex() {
  const out: { title: string; href: string; kind: string; text: string }[] = [];
  for (const g of allGuides()) out.push({ title: g.title, href: `/docs/${g.slug}/`, kind: "Guide", text: g.description + " " + g.body.replace(/[#*`|\-]/g, " ").slice(0, 4000) });
  for (const r of RESOURCES) {
    out.push({ title: r.title, href: `/docs/reference/${r.id}/`, kind: "Resource", text: r.blurb });
    for (const e of r.endpoints) out.push({ title: e.title, href: `/docs/reference/${r.id}/#${e.id}`, kind: `${e.method} ${e.path}`, text: e.summary + " " + (e.description ?? "") });
  }
  return out;
}
