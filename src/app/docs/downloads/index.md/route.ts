import { pageBySlug } from "@/lib/docs";
import { pageMarkdown } from "@/lib/llm";

export const dynamic = "force-static";

export function GET() {
  const p = pageBySlug("downloads")!;
  return new Response(pageMarkdown(p), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
