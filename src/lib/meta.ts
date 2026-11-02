import type { Metadata } from "next";
import type { DocPage } from "@/lib/docs";

export function pageMeta(p: DocPage): Metadata {
  const title = p.kind === "reference" ? `${p.title} API reference` : p.title;
  return {
    title,
    description: p.description,
    alternates: { canonical: p.href, types: { "text/markdown": `${p.href}index.md` } },
    openGraph: { type: "article", title, description: p.description, url: p.href, siteName: "Tefo API docs", images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Tefo API documentation" }] },
    twitter: { card: "summary_large_image", title, description: p.description, images: ["/opengraph-image.png"] },
  };
}
