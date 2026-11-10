import { describe, expect, it } from "vitest";
import { ENUM_MEANINGS, ERRORS, EVENTS, RESOURCES, allEndpoints, enumMeanings, eventPayload } from "@/content/api";
import { CURRENT_VERSION } from "@/content/changelog";
import { API_VERSION } from "@/content/config";
import { ALL_CHECK_ITEMS } from "@/content/golive";
import { QUICKSTART, RECIPES } from "@/content/walkthroughs";
import { NAV, PAGES, evId, guideBody, objectKey, pageByHref, tocFor } from "@/lib/docs";
import { llmsFull, llmsTxt, pageMarkdown } from "@/lib/llm";
import { buildOpenApi } from "@/lib/openapi";
import { buildPostman } from "@/lib/postman";
import { buildSearchIndex } from "@/lib/search-index";

describe("single source of truth", () => {
  it("keeps the API version in step with the changelog", () => expect(API_VERSION).toBe(CURRENT_VERSION));

  it("explains every enum value", () => {
    const missing: string[] = [];
    for (const r of RESOURCES) {
      const fields = [...(r.object?.fields ?? []), ...r.endpoints.flatMap((e) => [...(e.body ?? []), ...(e.query ?? []), ...(e.headers ?? [])])];
      for (const f of fields.filter((x) => x.values)) {
        const m = enumMeanings(objectKey(r), f);
        for (const v of f.values!) if (!m?.[v]) missing.push(`${r.id}.${f.name}=${v}`);
      }
    }
    expect(missing).toEqual([]);
  });
  it("has no meaning for a value that does not exist", () => {
    const all = new Set(RESOURCES.flatMap((r) => [...(r.object?.fields ?? []), ...r.endpoints.flatMap((e) => [...(e.body ?? []), ...(e.query ?? [])])]).flatMap((f) => f.values ?? []));
    for (const [k, m] of Object.entries(ENUM_MEANINGS)) for (const v of Object.keys(m)) expect(all.has(v), `${k}.${v}`).toBe(true);
  });
  it("flags money fields as cents", () => {
    const money = RESOURCES.flatMap((r) => r.object?.fields ?? []).filter((f) => f.money).map((f) => f.name);
    expect(money).toEqual(expect.arrayContaining(["amount", "balance", "fee", "held"]));
    for (const { endpoint: e } of allEndpoints()) for (const f of e.body ?? []) if (f.name === "amount") expect(f.money, e.id).toBe(true);
  });
  it("only names errors that exist, and every error is returned somewhere", () => {
    const codes = new Set(ERRORS.map((e) => e.code));
    for (const { endpoint: e } of allEndpoints()) for (const c of e.errors ?? []) expect(codes.has(c), `${e.id}:${c}`).toBe(true);
    for (const e of ERRORS) { expect(e.cause.length).toBeGreaterThan(10); expect(e.fix.length).toBeGreaterThan(5); }
  });
  it("has a payload for every documented event", () => {
    for (const ev of EVENTS) { const p = eventPayload(ev) as { type: string }; expect(p.type).toBe(ev.type); }
    expect(new Set(EVENTS.map((e) => e.type)).size).toBe(EVENTS.length);
  });
  it("gives OpenAPI and Postman every endpoint", () => {
    const n = allEndpoints().length;
    const oa = buildOpenApi();
    expect(Object.values(oa.paths).reduce((a, p) => a + Object.keys(p).length, 0)).toBe(n);
    expect(oa.info.version).toBe(API_VERSION);
    expect(buildPostman().item.reduce((a, g) => a + g.item.length, 0)).toBe(n);
  });
});

describe("pages", () => {
  it("resolves every navigation link to a page, an endpoint or a file", () => {
    const bad: string[] = [];
    for (const g of NAV) for (const i of g.items) {
      if (i.external) continue;
      const p = pageByHref(i.href);
      if (!p) { bad.push(i.href); continue; }
      const hash = i.href.split("#")[1];
      if (hash && !tocFor(p).some((h) => h.id === hash)) bad.push(i.href);
    }
    expect(bad).toEqual([]);
  });
  it("links only to pages that exist from guides, recipes and the quickstart", () => {
    const text = [...PAGES.filter((p) => p.kind === "guide").map((p) => guideBody(p.slug)), ...[QUICKSTART, ...RECIPES].flatMap((w) => w.steps.map((s) => s.body))].join("\n");
    const bad = [...text.matchAll(/\]\((\/docs\/[^)#\s]*)(#[^)]*)?\)/g)].map((m) => m[1]).filter((h) => !pageByHref(h));
    expect(bad).toEqual([]);
  });
  it("keeps step and checklist ids unique", () => {
    for (const w of [QUICKSTART, ...RECIPES]) expect(new Set(w.steps.map((s) => s.id)).size).toBe(w.steps.length);
    expect(new Set(ALL_CHECK_ITEMS.map((i) => i.id)).size).toBe(ALL_CHECK_ITEMS.length);
  });
  it("makes every page available as Markdown and in llms.txt", () => {
    const txt = llmsTxt();
    for (const p of PAGES) { expect(pageMarkdown(p).length, p.slug).toBeGreaterThan(50); expect(txt, p.slug).toContain(`${p.href}index.md`); }
    expect(llmsFull()).toContain("# Webhook events");
  });
  it("never claims to be live, licensed or to hold money", () => {
    const all = llmsFull().toLowerCase();
    expect(all).not.toMatch(/we are (now )?live|is now live|licensed by|we hold your (money|funds)|tefo holds your/);
  });
  it("has no matching, pile or reconciliation concept", () => {
    expect(llmsFull()).not.toMatch(/no_match|match_state|collection\.matched|\bthe pile\b|\bpile\b|reconcil|matched to (a|the) sale/i);
    expect(JSON.stringify(buildOpenApi())).not.toMatch(/\/match|match_state|no_match/);
    expect(PAGES.some((p) => p.slug === "matching")).toBe(false);
  });
  it("marks every non-M-Pesa rail as not yet verified", () => {
    const rails = pageMarkdown(PAGES.find((p) => p.slug === "rails")!);
    expect(rails).toMatch(/Not yet verified/);
    for (const r of ["airtel_money", "card", "pesalink"]) expect(ENUM_MEANINGS.rail[r], r).toMatch(/Not yet verified/);
  });
  it("marks the webhook scheme as proposed on its pages", () => {
    expect(pageMarkdown(PAGES.find((p) => p.slug === "webhook-events")!)).toMatch(/Proposed/);
    expect(pageMarkdown(PAGES.find((p) => p.slug === "webhooks")!)).toMatch(/Proposed/);
  });
});

describe("search index", () => {
  const idx = buildSearchIndex();
  it("covers every endpoint, error and event", () => {
    for (const { endpoint: e } of allEndpoints()) expect(idx.some((d) => d.kind === "Endpoint" && d.title === e.title), e.id).toBe(true);
    for (const e of ERRORS) expect(idx.some((d) => d.kind === "Error" && d.title === e.code), e.code).toBe(true);
    for (const e of EVENTS) expect(idx.some((d) => d.kind === "Event" && d.href.endsWith(evId(e.type))), e.type).toBe(true);
  });
  it("covers guides, recipes and fields", () => {
    expect(idx.some((d) => d.kind === "Recipe" && d.title === "Verify a webhook signature")).toBe(true);
    expect(idx.some((d) => d.kind === "Guide" && d.hint === "Idempotency")).toBe(true);
    expect(idx.some((d) => d.kind === "Field" && d.title === "Collection.amount" && /cents/.test(d.text))).toBe(true);
  });
  it("points every result at a real page", () => { for (const d of idx) expect(pageByHref(d.href), d.href).not.toBeNull(); });
});
