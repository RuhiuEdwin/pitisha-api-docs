import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { EVENTS, RESOURCES } from "@/content/api";
import { ALL_CHECK_ITEMS, GOLIVE } from "@/content/golive";
import { RECIPES, QUICKSTART } from "@/content/walkthroughs";
import { REPO_BRANCH, REPO_URL } from "@/content/config";

const dir = path.join(process.cwd(), "src/content/guides");

export type PageKind = "guide" | "quickstart" | "recipes" | "recipe" | "webhook-events" | "go-live" | "changelog" | "downloads" | "reference";

export interface DocPage {
  /** URL path under /docs/, no slashes at the ends. */
  slug: string;
  href: string;
  title: string;
  description: string;
  section: string;
  kind: PageKind;
  /** Where the words live in the repo, for "Edit this page". */
  source: string;
}

export interface Heading { id: string; text: string; depth: number }

function guideFile(slug: string) {
  const file = path.join(dir, slug + ".md");
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { title: String(data.title), description: String(data.description ?? ""), body: content };
}

export const guideBody = (slug: string) => guideFile(slug)?.body ?? "";

const md = (slug: string, section: string): DocPage => {
  const g = guideFile(slug);
  if (!g) throw new Error(`Missing guide ${slug}.md`);
  return { slug, href: `/docs/${slug}/`, title: g.title, description: g.description, section, kind: "guide", source: `src/content/guides/${slug}.md` };
};
const virtual = (slug: string, title: string, description: string, section: string, kind: PageKind, source: string): DocPage => ({ slug, href: `/docs/${slug}/`, title, description, section, kind, source });

export const SECTION_TITLES = { start: "Get started", recipes: "Recipes", concepts: "Concepts", reference: "API reference", more: "More" } as const;

export const PAGES: DocPage[] = [
  md("introduction", SECTION_TITLES.start),
  virtual("quickstart", QUICKSTART.title, QUICKSTART.summary, SECTION_TITLES.start, "quickstart", "src/content/walkthroughs.ts"),
  md("authentication", SECTION_TITLES.start),
  md("environments", SECTION_TITLES.start),
  virtual("go-live", "Go-live checklist", "Everything to finish before you take real payments, in the order the partners portal asks for it.", SECTION_TITLES.start, "go-live", "src/content/golive.ts"),
  virtual("recipes", "Recipes", "Short, guided jobs: accept a payment, reconcile one, retry safely, verify a webhook, go live.", SECTION_TITLES.recipes, "recipes", "src/content/walkthroughs.ts"),
  ...RECIPES.map((r) => virtual(`recipes/${r.id}`, r.title, r.summary, SECTION_TITLES.recipes, "recipe", "src/content/walkthroughs.ts")),
  md("idempotency", SECTION_TITLES.concepts),
  md("errors", SECTION_TITLES.concepts),
  md("pagination", SECTION_TITLES.concepts),
  md("webhooks", SECTION_TITLES.concepts),
  virtual("webhook-events", "Webhook events", "Every event, with a payload example, and a verifier for the signature.", SECTION_TITLES.concepts, "webhook-events", "src/content/api.ts"),
  md("sandbox", SECTION_TITLES.concepts),
  md("matching", SECTION_TITLES.concepts),
  md("gateways", SECTION_TITLES.concepts),
  md("approvals", SECTION_TITLES.concepts),
  md("fees", SECTION_TITLES.concepts),
  ...RESOURCES.map((r) => virtual(`reference/${r.id}`, r.title, r.blurb, SECTION_TITLES.reference, "reference", "src/content/api.ts")),
  virtual("changelog", "Changelog", "What changed in the API, newest first.", SECTION_TITLES.more, "changelog", "src/content/changelog.ts"),
  md("versioning", SECTION_TITLES.more),
  md("status", SECTION_TITLES.more),
  virtual("downloads", "OpenAPI and Postman", "Download the API description for Postman, Insomnia or a code generator.", SECTION_TITLES.more, "downloads", "src/lib/openapi.ts"),
];

export const pageBySlug = (slug: string) => PAGES.find((p) => p.slug === slug) ?? null;
export const pageByHref = (href: string) => PAGES.find((p) => p.href === href.split("#")[0]) ?? null;
/** Pages whose route is a plain [slug] guide page. */
export const GUIDE_SLUGS = PAGES.filter((p) => p.kind === "guide" || p.kind === "go-live" || p.kind === "changelog").map((p) => p.slug);

export interface NavItem { href: string; label: string; method?: string; external?: boolean }
export interface NavGroup { group: string; items: NavItem[] }

export const NAV: NavGroup[] = (() => {
  const groups: NavGroup[] = [];
  for (const p of PAGES) {
    if (p.kind === "reference") continue;
    let g = groups.find((x) => x.group === p.section);
    if (!g) groups.push((g = { group: p.section, items: [] }));
    g.items.push({ href: p.href, label: p.kind === "recipe" ? p.title.replace(/^Verify a webhook signature$/, "Verify a signature") : p.title });
  }
  const refIndex = groups.findIndex((g) => g.group === SECTION_TITLES.concepts) + 1;
  const ref: NavGroup[] = RESOURCES.map((r) => ({ group: `API: ${r.title}`, items: [{ href: `/docs/reference/${r.id}/`, label: `${r.title} overview` }, ...r.endpoints.map((e) => ({ href: `/docs/reference/${r.id}/#${e.id}`, label: e.title, method: e.method }))] }));
  groups.splice(refIndex, 0, ...ref);
  const more = groups.find((g) => g.group === SECTION_TITLES.more)!;
  more.items.push({ href: "/openapi.json", label: "openapi.json", external: true }, { href: "/llms.txt", label: "llms.txt", external: true });
  return groups;
})();

export function headingsOf(markdown: string, minDepth = 2, maxDepth = 3): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let fence = false;
  for (const line of markdown.split("\n")) {
    if (/^```/.test(line)) { fence = !fence; continue; }
    if (fence) continue;
    const m = /^(#{1,6})\s+(.+?)\s*#*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[`*_]/g, "").replace(/\[(.+?)\]\(.*?\)/g, "$1");
    const id = slugger.slug(text);
    if (m[1].length >= minDepth && m[1].length <= maxDepth) out.push({ id, text, depth: m[1].length });
  }
  return out;
}

/** The "On this page" list for any page. */
export function tocFor(p: DocPage): Heading[] {
  if (p.kind === "guide") {
    const h = headingsOf(guideBody(p.slug));
    if (p.slug === "errors") return [...h, { id: "explorer", text: "Error explorer", depth: 2 }];
    if (p.slug === "webhooks") return [...h, { id: "events", text: "Event catalogue", depth: 2 }];
    return h;
  }
  if (p.kind === "quickstart") return QUICKSTART.steps.map((s, i) => ({ id: s.id, text: `${i + 1}. ${s.title}`, depth: 2 }));
  if (p.kind === "recipe") return RECIPES.find((r) => `recipes/${r.id}` === p.slug)!.steps.map((s, i) => ({ id: s.id, text: `${i + 1}. ${s.title}`, depth: 2 }));
  if (p.kind === "go-live") return GOLIVE.map((ph) => ({ id: ph.id, text: ph.title, depth: 2 }));
  if (p.kind === "webhook-events") return [{ id: "verifier", text: "Signature verifier", depth: 2 }, ...EVENTS.map((e) => ({ id: evId(e.type), text: e.type, depth: 3 }))];
  if (p.kind === "reference") {
    const r = RESOURCES.find((x) => `reference/${x.id}` === p.slug)!;
    return [...(r.object ? [{ id: "object", text: `The ${r.object.name} object`, depth: 2 }] : []), ...r.endpoints.map((e) => ({ id: e.id, text: e.title, depth: 2 }))];
  }
  return [];
}

/** Key used in ENUM_MEANINGS for a resource: its object name in snake case. */
export const objectKey = (r: { object?: { name: string }; id: string }) => (r.object?.name ?? r.id).toLowerCase().replace(/ /g, "_");

export const evId = (type: string) => "ev-" + type.replace(/[._]/g, "-");

/** Flat reading order for previous and next. */
export function neighbours(p: DocPage) {
  const i = PAGES.findIndex((x) => x.slug === p.slug);
  return { prev: i > 0 ? PAGES[i - 1] : null, next: i < PAGES.length - 1 ? PAGES[i + 1] : null };
}

export function crumbs(p: DocPage): { label: string; href?: string }[] {
  const out: { label: string; href?: string }[] = [{ label: "Docs", href: "/docs/introduction/" }, { label: p.section }];
  if (p.kind === "recipe") out[1] = { label: "Recipes", href: "/docs/recipes/" };
  out.push({ label: p.title });
  return out;
}

export const editUrl = (p: DocPage) => `${REPO_URL}/edit/${REPO_BRANCH}/${p.source}`;
export const checkCount = ALL_CHECK_ITEMS.length;
