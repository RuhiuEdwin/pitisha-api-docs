import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { GUIDE_ORDER, getGuide } from "@/lib/docs";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDE_ORDER.map((slug) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const g = getGuide(slug);
  if (!g) return {};
  const url = `/docs/${slug}/`;
  return { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { type: "article", title: g.title, description: g.description, url, siteName: "Pitisha API", images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Pitisha API documentation" }] }, twitter: { card: "summary_large_image", title: g.title, description: g.description, images: ["/opengraph-image.png"] } };
}

export default async function Guide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const i = GUIDE_ORDER.indexOf(slug);
  const prev = i > 0 ? getGuide(GUIDE_ORDER[i - 1]) : null;
  const next = i < GUIDE_ORDER.length - 1 ? getGuide(GUIDE_ORDER[i + 1]) : null;
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-light tracking-tight">{g.title}</h1>
      <p className="mb-8 mt-2 text-[17px] text-muted">{g.description}</p>
      <Markdown>{g.body}</Markdown>
      <nav aria-label="Pagination" className="mt-14 grid grid-cols-2 gap-4 border-t border-line pt-6 text-[14px]">
        <div>{prev && <Link href={`/docs/${prev.slug}/`} className="block rounded-xl border border-line p-4 hover:border-ink"><span className="text-xs text-muted">Previous</span><br />{prev.title}</Link>}</div>
        <div>{next && <Link href={`/docs/${next.slug}/`} className="block rounded-xl border border-line p-4 text-right hover:border-ink"><span className="text-xs text-muted">Next</span><br />{next.title}</Link>}</div>
      </nav>
    </article>
  );
}
