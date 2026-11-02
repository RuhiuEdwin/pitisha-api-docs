import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/config";
import { PAGES } from "@/lib/docs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-01");
  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    ...PAGES.map((p) => ({ url: `${SITE_URL}${p.href}`, lastModified: now, priority: p.kind === "reference" ? 0.7 : 0.8 })),
    { url: `${SITE_URL}/openapi.json`, lastModified: now, priority: 0.5 },
    { url: `${SITE_URL}/llms.txt`, lastModified: now, priority: 0.4 },
  ];
}
