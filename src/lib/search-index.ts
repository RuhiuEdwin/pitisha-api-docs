import { ERRORS, EVENTS, RESOURCES, enumMeanings } from "@/content/api";
import { QUICKSTART, RECIPES } from "@/content/walkthroughs";
import { GOLIVE } from "@/content/golive";
import { RELEASES } from "@/content/changelog";
import { PAGES, evId, guideBody, objectKey } from "@/lib/docs";
import { headingsOf } from "@/lib/docs";
import type { SearchDoc } from "@/lib/search";

const plain = (s: string) => s.replace(/```[a-z]*\n?/g, " ").replace(/\[(.+?)\]\(.*?\)/g, "$1").replace(/[#*>|`]/g, " ").replace(/\s+/g, " ").trim();

export function buildSearchIndex(): SearchDoc[] {
  const out: SearchDoc[] = [];
  for (const p of PAGES) {
    if (p.kind === "guide") {
      const body = guideBody(p.slug);
      out.push({ title: p.title, href: p.href, kind: "Guide", hint: p.description, text: plain(body).slice(0, 600) });
      const hs = headingsOf(body, 2, 2);
      const lines = body.split("\n");
      for (const h of hs) {
        const at = lines.findIndex((l) => /^##\s/.test(l) && l.replace(/^##\s+/, "").replace(/[`*_]/g, "").startsWith(h.text.slice(0, 12)));
        const rest = lines.slice(at + 1);
        const stop = rest.findIndex((l) => /^##\s/.test(l));
        out.push({ title: h.text, href: `${p.href}#${h.id}`, kind: "Guide", hint: p.title, text: plain(rest.slice(0, stop < 0 ? undefined : stop).join("\n")).slice(0, 500) });
      }
    } else if (p.kind === "quickstart") {
      out.push({ title: p.title, href: p.href, kind: "Guide", hint: p.description, text: QUICKSTART.outcome });
      for (const s of QUICKSTART.steps) out.push({ title: s.title, href: `${p.href}#${s.id}`, kind: "Guide", hint: "Quickstart", text: plain(s.body) });
    } else if (p.kind === "go-live") {
      out.push({ title: p.title, href: p.href, kind: "Guide", hint: p.description, text: GOLIVE.flatMap((g) => g.items.map((i) => i.text)).join(" ") });
    } else if (p.kind === "changelog") {
      out.push({ title: p.title, href: p.href, kind: "Guide", hint: p.description, text: RELEASES.map((r) => `${r.version} ${r.title}`).join(" ") });
    } else if (p.kind === "recipes") {
      out.push({ title: p.title, href: p.href, kind: "Recipe", hint: p.description, text: "" });
    } else if (p.kind === "downloads") {
      out.push({ title: p.title, href: p.href, kind: "Guide", hint: p.description, text: "OpenAPI Postman collection download json import" });
    }
  }
  for (const r of RECIPES) {
    out.push({ title: r.title, href: `/docs/recipes/${r.id}/`, kind: "Recipe", hint: r.summary, text: `${r.outcome} ${r.steps.map((s) => `${s.title} ${plain(s.body)}`).join(" ")}` });
  }
  for (const r of RESOURCES) {
    out.push({ title: `${r.title} overview`, href: `/docs/reference/${r.id}/`, kind: "Guide", hint: "API reference", text: r.blurb });
    for (const e of r.endpoints) {
      out.push({ title: e.title, href: `/docs/reference/${r.id}/#${e.id}`, kind: "Endpoint", hint: `${e.method} ${e.path}`, text: [e.summary, e.description, ...[...(e.body ?? []), ...(e.query ?? [])].map((f) => `${f.name} ${f.description}`)].filter(Boolean).join(" ") });
    }
    for (const f of r.object?.fields ?? []) {
      const m = enumMeanings(objectKey(r), f);
      out.push({ title: `${r.object!.name}.${f.name}`, href: `/docs/reference/${r.id}/#object`, kind: "Field", hint: `${f.type}${f.money ? " · cents" : ""}`, text: `${f.description} ${m ? Object.entries(m).map(([k, v]) => `${k} ${v}`).join(" ") : ""}${f.money ? " amount in cents 250000 is KES 2,500.00" : ""}` });
    }
  }
  for (const e of ERRORS) out.push({ title: e.code, href: `/docs/errors/#err-${e.code}`, kind: "Error", hint: `${e.status} · ${e.meaning}`, text: `${e.meaning} ${e.fix}` });
  for (const ev of EVENTS) out.push({ title: ev.type, href: `/docs/webhook-events/#${evId(ev.type)}`, kind: "Event", hint: ev.when, text: `${ev.when} ${ev.note ?? ""}` });
  return out;
}
