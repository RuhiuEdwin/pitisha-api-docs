import { llmsTxt } from "@/lib/llm";

export const dynamic = "force-static";
export const GET = () => new Response(llmsTxt(), { headers: { "content-type": "text/plain; charset=utf-8" } });
