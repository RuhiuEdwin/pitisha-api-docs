import { ERRORS, EVENTS, RESOURCES, enumMeanings, eventPayload, type Field, type Resource } from "@/content/api";
import { changelogMarkdown } from "@/content/changelog";
import { API_VERSION, PROPOSED, SITE_URL } from "@/content/config";
import { goLiveMarkdown } from "@/content/golive";
import { QUICKSTART, RECIPES, type Walkthrough } from "@/content/walkthroughs";
import { PAGES, guideBody, objectKey, type DocPage } from "@/lib/docs";
import { LANGS, pretty, render, snippet } from "@/lib/snippets";

const PROPOSED_NOTE = "> **Proposed.** The endpoints and the webhook scheme are a proposal until the backend matches them. Nothing here says Tefo is live, licensed or holds your money.\n\n";

function fieldTable(r: { object?: { name: string }; id: string }, fields?: Field[]): string {
  if (!fields?.length) return "";
  const rows = fields.map((f) => {
    const m = enumMeanings(objectKey(r), f);
    const vals = f.values ? ` One of: ${f.values.map((v) => `\`${v}\`${m?.[v] ? ` (${m[v]})` : ""}`).join("; ")}.` : "";
    const cents = f.money ? " **In cents:** 250000 is KES 2,500.00." : "";
    return `| \`${f.name}\` | ${f.type}${f.required ? ", required" : ""} | ${f.description}${cents}${vals} |`;
  });
  return `| Name | Type | Description |\n| --- | --- | --- |\n${rows.join("\n")}\n\n`;
}

function walkthroughMarkdown(w: Walkthrough, langs: string[]): string {
  let out = `${w.outcome}\n\n`;
  w.steps.forEach((s, i) => {
    out += `## ${i + 1}. ${s.title}\n\n${s.body}\n\n`;
    if (s.shared) out += `\`\`\`${s.shared.lang}\n${s.shared.code}\n\`\`\`\n\n`;
    if (s.req) for (const l of LANGS.filter((x) => langs.includes(x.id))) out += `${l.label}:\n\n\`\`\`${l.shiki}\n${render(s.req, l.id)}\n\`\`\`\n\n`;
    if (s.code) for (const l of LANGS) if (langs.includes(l.id) && s.code[l.id]) out += `${l.label}:\n\n\`\`\`${l.shiki}\n${s.code[l.id]}\n\`\`\`\n\n`;
    if (s.expect) out += `You should see:\n\n\`\`\`${s.expect.lang === "json" ? "json" : "text"}\n${s.expect.code}\n\`\`\`\n\n`;
  });
  return out;
}

function referenceMarkdown(r: Resource): string {
  let out = `${r.blurb}\n\n${PROPOSED ? PROPOSED_NOTE : ""}Amounts are integers in cents: 250000 is KES 2,500.00.\n\n`;
  if (r.object) out += `## The ${r.object.name} object\n\n${r.object.description}\n\n${fieldTable(r, r.object.fields)}\`\`\`json\n${pretty(r.object.example)}\n\`\`\`\n\n`;
  for (const e of r.endpoints) {
    out += `## ${e.title}\n\n\`${e.method} ${e.path}\`${e.sandboxOnly ? " (sandbox only)" : ""}\n\n${e.summary}\n\n${e.description ? e.description + "\n\n" : ""}`;
    for (const [t, f] of [["Path parameters", e.pathParams], ["Headers", e.headers], ["Query parameters", e.query], ["Body parameters", e.body]] as const) if (f?.length) out += `### ${t}\n\n${fieldTable(r, f)}`;
    out += `### Example\n\n\`\`\`bash\n${snippet(e, "curl")}\n\`\`\`\n\nResponse \`${e.status}\`:\n\n\`\`\`json\n${pretty(e.response)}\n\`\`\`\n\n`;
    if (e.errors?.length) out += `Errors: ${e.errors.join(", ")}\n\n`;
  }
  return out;
}

const webhookEventsMarkdown = () =>
  `${PROPOSED_NOTE}Every request carries \`Tefo-Signature: t=<unix seconds>,v1=<hex>\`. The signature is HMAC-SHA256 of \`<t>.<raw body>\` with your signing secret, as hex.\n\n` +
  EVENTS.map((e) => `## ${e.type}\n\n${e.when}${e.note ? ` (${e.note})` : ""}\n\n\`\`\`json\n${pretty(eventPayload(e))}\n\`\`\`\n`).join("\n");

const errorsExtra = () => `\n## Error explorer\n\n| Code | Status | Meaning | What to do |\n| --- | --- | --- | --- |\n${ERRORS.map((e) => `| \`${e.code}\` | ${e.status} | ${e.meaning} | ${e.fix} |`).join("\n")}\n`;

const downloadsMarkdown = () => `- OpenAPI 3.1: ${SITE_URL}/openapi.json\n- Postman collection v2.1: ${SITE_URL}/postman_collection.json\n\nBoth are generated from the same data as this reference, so they cannot drift.\n`;

/** The Markdown version of a page, for /docs/<slug>/index.md and llms-full.txt. */
export function pageMarkdown(p: DocPage): string {
  const head = `# ${p.title}\n\n${p.description}\n\n`;
  switch (p.kind) {
    case "guide": {
      const extra = p.slug === "errors" ? errorsExtra() : p.slug === "webhooks" ? `\n## Event catalogue\n\nSee ${SITE_URL}/docs/webhook-events/index.md\n` : "";
      return head + (p.slug === "webhooks" && PROPOSED ? PROPOSED_NOTE : "") + guideBody(p.slug) + extra;
    }
    case "quickstart": return head + walkthroughMarkdown(QUICKSTART, ["curl", "javascript", "python", "php"]);
    case "recipe": return head + walkthroughMarkdown(RECIPES.find((r) => `recipes/${r.id}` === p.slug)!, ["curl", "javascript", "python", "php"]);
    case "recipes": return head + RECIPES.map((r) => `- [${r.title}](${SITE_URL}/docs/recipes/${r.id}/index.md): ${r.summary}`).join("\n") + "\n";
    case "go-live": return head + goLiveMarkdown();
    case "changelog": return head + changelogMarkdown() + "\n";
    case "webhook-events": return head + webhookEventsMarkdown();
    case "downloads": return head + downloadsMarkdown();
    case "reference": return head + referenceMarkdown(RESOURCES.find((r) => `reference/${r.id}` === p.slug)!);
  }
}

export function llmsTxt(): string {
  const sections = [...new Set(PAGES.map((p) => p.section))];
  return `# Tefo API\n\n> Take and send M-Pesa payments through one API, and match each payment to its sale by reference. API version ${API_VERSION}.${PROPOSED ? " The endpoints and the webhook scheme are a proposal until the backend matches." : ""} Amounts are integers in cents (250000 is KES 2,500.00).\n\n` +
    sections.map((s) => `## ${s}\n\n${PAGES.filter((p) => p.section === s).map((p) => `- [${p.title}](${SITE_URL}${p.href}index.md): ${p.description}`).join("\n")}\n`).join("\n") +
    `\n## Machine-readable\n\n- [OpenAPI 3.1](${SITE_URL}/openapi.json)\n- [Postman collection](${SITE_URL}/postman_collection.json)\n- [All pages in one file](${SITE_URL}/llms-full.txt)\n`;
}

export const llmsFull = () => llmsTxt() + "\n---\n\n" + PAGES.map((p) => pageMarkdown(p)).join("\n\n---\n\n");
