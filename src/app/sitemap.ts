import type { MetadataRoute } from "next";
import { RESOURCES } from "@/content/api";
import { GUIDE_ORDER } from "@/lib/docs";

export const dynamic = "force-static";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pitisha-api-docs.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-10-29");
  return [
    { url: `${SITE}/`, lastModified: now, priority: 1 },
    ...GUIDE_ORDER.map((s) => ({ url: `${SITE}/docs/${s}/`, lastModified: now, priority: 0.8 })),
    ...RESOURCES.map((r) => ({ url: `${SITE}/docs/reference/${r.id}/`, lastModified: now, priority: 0.7 })),
    { url: `${SITE}/openapi.json`, lastModified: now, priority: 0.5 },
  ];
}
