import { RECIPES } from "@/content/walkthroughs";
import { pageBySlug } from "@/lib/docs";
import { pageMarkdown } from "@/lib/llm";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => RECIPES.map((r) => ({ id: r.id }));

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const p = pageBySlug(`recipes/${(await params).id}`);
  return new Response(p ? pageMarkdown(p) : "Not found", { status: p ? 200 : 404, headers: { "content-type": "text/markdown; charset=utf-8" } });
}
