import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodePanel } from "@/components/code-panel";
import { Params } from "@/components/params";
import { ERRORS, RESOURCES } from "@/content/api";
import { hl } from "@/lib/highlight";
import { LANGS, pretty, snippet } from "@/lib/snippets";
import { cn } from "@/lib/cn";

export const dynamicParams = false;
export const generateStaticParams = () => RESOURCES.map((r) => ({ resource: r.id }));

export async function generateMetadata({ params }: { params: Promise<{ resource: string }> }): Promise<Metadata> {
  const { resource } = await params;
  const r = RESOURCES.find((x) => x.id === resource);
  if (!r) return {};
  const title = `${r.title} API reference`;
  const url = `/docs/reference/${r.id}/`;
  return { title, description: r.blurb, alternates: { canonical: url }, openGraph: { type: "article", title, description: r.blurb, url, siteName: "Pitisha API", images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Pitisha API documentation" }] }, twitter: { card: "summary_large_image", title, description: r.blurb } };
}

const MC: Record<string, string> = { GET: "bg-ok/10 text-ok", POST: "bg-gold/30 text-gold-d", PATCH: "bg-sky/30 text-ink", DELETE: "bg-err/10 text-err" };

export default async function Reference({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const r = RESOURCES.find((x) => x.id === resource);
  if (!r) notFound();
  const objHtml = r.object ? await hl(pretty(r.object.example), "json") : "";
  const eps = await Promise.all(r.endpoints.map(async (e) => ({
    e,
    samples: await Promise.all(LANGS.map(async (l) => { const raw = snippet(e, l.id); return { lang: l.id, label: l.label, raw, html: await hl(raw, l.id) }; })),
    resp: await hl(pretty(e.response), "json"),
  })));
  return (
    <div className="mx-auto max-w-[1180px]">
      <p className="text-[13px] text-muted"><Link href="/docs/introduction/" className="hover:underline">Docs</Link> / API reference</p>
      <h1 className="mt-1 text-4xl font-light tracking-tight">{r.title}</h1>
      <p className="mb-8 mt-2 max-w-2xl text-[17px] text-muted">{r.blurb}</p>

      {r.object && (
        <section className="grid gap-6 border-t border-line py-8 xl:grid-cols-2" aria-labelledby="object">
          <div>
            <h2 id="object" className="text-2xl font-light tracking-tight">The {r.object.name} object</h2>
            <p className="mt-2 text-muted">{r.object.description}</p>
            <Params title="Attributes" fields={r.object.fields} />
          </div>
          <div className="xl:sticky xl:top-24 xl:self-start"><div className="overflow-hidden rounded-2xl bg-deep"><p className="border-b border-ivory/10 px-4 py-2 text-xs text-ivory/60">Example object</p><div className="code-dark max-h-[520px] overflow-auto" dangerouslySetInnerHTML={{ __html: objHtml }} /></div></div>
        </section>
      )}

      {eps.map(({ e, samples, resp }) => (
        <section key={e.id} id={e.id} className="grid scroll-mt-24 gap-6 border-t border-line py-8 xl:grid-cols-2" aria-labelledby={e.id + "-h"}>
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className={cn("rounded-md px-2 py-0.5 font-mono text-xs font-medium", MC[e.method])}>{e.method}</span><code className="font-mono text-[13px] text-muted">{e.path}</code>{e.sandboxOnly && <span className="rounded-md bg-night px-2 py-0.5 text-[11px] font-medium text-gold">Sandbox only</span>}</div>
            <h2 id={e.id + "-h"} className="mt-3 text-2xl font-light tracking-tight">{e.title}</h2>
            <p className="mt-2 text-muted">{e.summary}</p>
            {e.description && <p className="mt-3">{e.description}</p>}
            <Params title="Path parameters" fields={e.pathParams} />
            <Params title="Headers" fields={e.headers} />
            <Params title="Query parameters" fields={e.query} />
            <Params title="Body parameters" fields={e.body} />
            {e.errors && (
              <section className="mt-6"><h4 className="mb-2 text-[13px] font-medium">Errors</h4>
                <ul className="flex flex-wrap gap-2">{e.errors.map((c) => { const er = ERRORS.find((x) => x.code === c)!; return <li key={c} title={er.meaning} className="rounded-md border border-line px-2 py-1 font-mono text-xs"><span className="text-muted">{er.status}</span> {c}</li>; })}</ul>
                <p className="mt-2 text-xs text-muted">See <Link href="/docs/errors/" className="underline">Errors</Link> for what each means.</p>
              </section>
            )}
          </div>
          <div className="xl:sticky xl:top-24 xl:self-start"><CodePanel endpoint={e} samples={samples} responseHtml={resp} /></div>
        </section>
      ))}
    </div>
  );
}
