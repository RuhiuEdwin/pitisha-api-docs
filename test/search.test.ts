import { describe, expect, it } from "vitest";
import { highlight, search, words, type SearchDoc } from "@/lib/search";

const docs: SearchDoc[] = [
  { title: "idempotency_conflict", href: "/e1", kind: "Error", hint: "409 The Idempotency-Key was used with different parameters", text: "Use a new key" },
  { title: "Idempotency", href: "/g1", kind: "Guide", hint: "Retry safely", text: "Send an Idempotency-Key header" },
  { title: "Create a collection", href: "/ep1", kind: "Endpoint", hint: "POST /v1/collections", text: "Ask a customer to pay" },
  { title: "collection.recorded", href: "/ev1", kind: "Event", hint: "A collection succeeded", text: "" },
];

describe("search", () => {
  it("splits code-like words", () => expect(words("idempotency_conflict /v1/collections")).toEqual(["idempotency", "conflict", "v1", "collections"]));
  it("needs every word to match somewhere", () => {
    expect(search(docs, "idempotency conflict").map((h) => h.doc.href)).toEqual(["/e1"]);
    expect(search(docs, "idempotency zebra")).toEqual([]);
  });
  it("ranks a title match above a body match", () => expect(search(docs, "idempotency")[0].doc.kind).toBe("Guide"));
  it("finds an endpoint by its path", () => expect(search(docs, "post v1 collections")[0].doc.href).toBe("/ep1"));
  it("finds an event by its dotted name", () => expect(search(docs, "collection.recorded")[0].doc.href).toBe("/ev1"));
  it("filters by kind", () => expect(search(docs, "collection", { kinds: ["Event"] }).map((h) => h.doc.kind)).toEqual(["Event"]));
  it("returns nothing for an empty query", () => expect(search(docs, "  ")).toEqual([]));
  it("marks the matched words", () => expect(highlight("Create a collection", ["collection"])).toEqual([{ text: "Create a ", hit: false }, { text: "collection", hit: true }]));
});
