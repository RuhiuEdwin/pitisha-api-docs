import { GUIDE_SLUGS, pageBySlug } from "@/lib/docs";
import { pageMarkdown } from "@/lib/llm";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => GUIDE_SLUGS.map((slug) => ({ slug }));

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const p = pageBySlug((await params).slug);
  return new Response(p ? pageMarkdown(p) : "Not found", { status: p ? 200 : 404, headers: { "content-type": "text/markdown; charset=utf-8" } });
}
