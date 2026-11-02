import { RESOURCES } from "@/content/api";
import { pageBySlug } from "@/lib/docs";
import { pageMarkdown } from "@/lib/llm";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => RESOURCES.map((r) => ({ resource: r.id }));

export async function GET(_: Request, { params }: { params: Promise<{ resource: string }> }) {
  const p = pageBySlug(`reference/${(await params).resource}`);
  return new Response(p ? pageMarkdown(p) : "Not found", { status: p ? 200 : 404, headers: { "content-type": "text/markdown; charset=utf-8" } });
}
