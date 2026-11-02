import { MarkdownAsync } from "react-markdown";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import Link from "next/link";

/** Markdown with highlighted code, linked headings and tables that scroll on their own instead of the page. */
export async function Markdown({ children }: { children: string }) {
  return (
    <div className="prose pd-prose">
      <MarkdownAsync
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeShiki, { theme: "github-dark-default" }]]}
        components={{
          a: ({ href = "", children }) => (href.startsWith("/") && !href.endsWith(".json") && !href.endsWith(".txt") ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a>),
          table: ({ children }) => <div className="table-wrap" tabIndex={0} role="region" aria-label="Table, scrolls sideways"><table>{children}</table></div>,
          h2: ({ id, children }) => <h2 id={id}>{children}{id && <a className="anchor" href={`#${id}`} aria-label="Link to this section">#</a>}</h2>,
          h3: ({ id, children }) => <h3 id={id}>{children}{id && <a className="anchor" href={`#${id}`} aria-label="Link to this section">#</a>}</h3>,
        }}
      >
        {children}
      </MarkdownAsync>
    </div>
  );
}
