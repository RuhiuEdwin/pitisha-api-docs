import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Callout, MoneyNote, ProposedNote } from "@/components/callouts";
import { FixedCode, RequestCode } from "@/components/code";
import { PageFrame } from "@/components/page-frame";
import { Params } from "@/components/params";
import { TryIt } from "@/components/try-it";
import { ERRORS, RESOURCES, type Field } from "@/content/api";
import { PROPOSED } from "@/content/config";
import { objectKey, pageBySlug } from "@/lib/docs";
import { pageMeta } from "@/lib/meta";
import { pretty, reqOf } from "@/lib/snippets";
import { cn } from "@/lib/cn";

export const dynamicParams = false;
export const generateStaticParams = () => RESOURCES.map((r) => ({ resource: r.id }));

export async function generateMetadata({ params }: { params: Promise<{ resource: string }> }): Promise<Metadata> {
  const p = pageBySlug(`reference/${(await params).resource}`);
  return p ? pageMeta(p) : {};
}

const MC: Record<string, string> = { GET: "bg-ok-bg text-ok", POST: "bg-sunken text-accent-text", PATCH: "bg-info-bg text-info", DELETE: "bg-err-bg text-err" };
const hasMoney = (fs?: Field[]) => !!fs?.some((f) => f.money);

export default async function Reference({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const r = RESOURCES.find((x) => x.id === resource);
  const page = pageBySlug(`reference/${resource}`);
  if (!r || !page) notFound();
  const key = objectKey(r);
  const money = hasMoney(r.object?.fields) || r.endpoints.some((e) => hasMoney(e.body) || hasMoney(e.query));
  return (
    <PageFrame page={page}>
      {PROPOSED && <ProposedNote />}
      {money && <MoneyNote />}

      {r.object && (
        <section id="object" aria-labelledby="object-h" className="scroll-mt-24 border-t border-edge py-8">
          <h2 id="object-h" className="pd-h2">The {r.object.name} object</h2>
          <p className="mt-2 max-w-[68ch] text-fg-muted">{r.object.description}</p>
          <Params title="Attributes" fields={r.object.fields} scope="attr" resourceKey={key} />
          <div className="mt-5"><FixedCode code={pretty(r.object.example)} lang="json" title="Example object" /></div>
        </section>
      )}

      {await Promise.all(r.endpoints.map(async (e) => (
        <section key={e.id} id={e.id} aria-labelledby={`${e.id}-h`} className="scroll-mt-24 border-t border-edge py-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-md px-2 py-0.5 font-mono text-xs font-medium", MC[e.method])}>{e.method}</span>
            <code className="font-mono text-[13px] text-fg-muted">{e.path}</code>
            {e.sandboxOnly && <span className="rounded-full border border-[var(--pd-info)] bg-info-bg px-2.5 py-0.5 text-[11px] font-medium">Sandbox only</span>}
          </div>
          <h2 id={`${e.id}-h`} className="pd-h2 mt-3">{e.title}</h2>
          <p className="mt-2 max-w-[68ch] text-[16px] text-fg-muted">{e.summary}</p>
          {e.description && <p className="mt-3 max-w-[68ch]">{e.description}</p>}
          <div className="grid gap-x-8 lg:grid-cols-2">
            <div>
              <Params title="Path parameters" fields={e.pathParams} scope={`${e.id}-path`} resourceKey={key} />
              <Params title="Headers" fields={e.headers} scope={`${e.id}-hdr`} resourceKey={key} />
              <Params title="Query parameters" fields={e.query} scope={`${e.id}-q`} resourceKey={key} />
              <Params title="Body parameters" fields={e.body} scope={`${e.id}-body`} resourceKey={key} />
              {e.errors && (
                <section className="mt-6" aria-label="Errors"><h4 className="mb-2 text-[13px] font-medium">Errors this can return</h4>
                  <ul className="flex flex-wrap gap-2">{e.errors.map((c) => { const er = ERRORS.find((x) => x.code === c)!; return <li key={c}><Link href={`/docs/errors/#err-${c}`} title={er.meaning} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-edge px-2 font-mono text-xs hover:border-fg"><span className="text-fg-muted">{er.status}</span> {c}</Link></li>; })}</ul>
                </section>
              )}
            </div>
            <div className="mt-6 grid content-start gap-4 lg:mt-0">
              <RequestCode req={reqOf(e)} />
              <div><p className="mb-1 text-[13px] font-medium">Response <span className="font-mono text-fg-muted">{e.status}</span></p><FixedCode code={pretty(e.response)} lang="json" title="Example response" /></div>
              {e.method !== "DELETE" ? <TryIt endpoint={e} /> : <Callout tone="note" title="Not in Try it">Deleting is not offered in the simulated sandbox.</Callout>}
            </div>
          </div>
        </section>
      )))}
    </PageFrame>
  );
}
