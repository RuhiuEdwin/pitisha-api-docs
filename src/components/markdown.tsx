import { MarkdownAsync } from "react-markdown";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export async function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <MarkdownAsync
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeShiki, { theme: "github-dark-default" }]]}
        components={{ a: ({ href = "", children }) => (href.startsWith("/") && !href.endsWith(".json") ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a>) }}
      >
        {children}
      </MarkdownAsync>
    </div>
  );
}
