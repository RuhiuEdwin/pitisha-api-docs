import type { Metadata } from "next";
import Link from "next/link";
import { FixedCode } from "@/components/code";
import { PageFrame } from "@/components/page-frame";
import { ProposedNote } from "@/components/callouts";
import { WebhookVerifier } from "@/components/webhook-verifier";
import { EVENTS, eventPayload } from "@/content/api";
import { evId, pageBySlug } from "@/lib/docs";
import { pageMeta } from "@/lib/meta";
import { pretty } from "@/lib/snippets";

const page = pageBySlug("webhook-events")!;
export const metadata: Metadata = pageMeta(page);

export default async function WebhookEvents() {
  return (
    <PageFrame page={page}>
      <ProposedNote what="The webhook signature scheme and the event list" />
      <p className="max-w-[68ch]">Each delivery is an HTTP <code className="font-mono">POST</code> with a JSON event and a <code className="font-mono">Tefo-Signature</code> header. See <Link href="/docs/webhooks/" className="underline">Webhooks</Link> for setup, retries and responding fast, and <Link href="/docs/recipes/verify-webhook/" className="underline">the recipe</Link> for code in four languages.</p>
      <div className="my-6"><WebhookVerifier /></div>
      <h2 className="pd-h2 mt-10">Events</h2>
      <div className="table-wrap mt-3" role="region" aria-label="Event list, scrolls sideways" tabIndex={0}>
        <table className="w-full min-w-[34rem] border-collapse text-[14px]"><thead><tr className="text-left"><th scope="col" className="border-b border-edge py-2 pr-4">Event</th><th scope="col" className="border-b border-edge py-2 pr-4">data.object</th><th scope="col" className="border-b border-edge py-2">When</th></tr></thead>
          <tbody>{EVENTS.map((e) => <tr key={e.type}><td className="border-b border-edge py-2 pr-4 align-top"><a href={`#${evId(e.type)}`} className="font-mono underline">{e.type}</a></td><td className="border-b border-edge py-2 pr-4 align-top font-mono text-fg-muted">{e.object}</td><td className="border-b border-edge py-2 align-top text-fg-muted">{e.when}{e.note && <span className="mt-1 block text-[12.5px]">{e.note}</span>}</td></tr>)}</tbody></table>
      </div>
      <div className="mt-8 grid gap-8">
        {await Promise.all(EVENTS.map(async (e) => (
          <section key={e.type} id={evId(e.type)} aria-labelledby={`${evId(e.type)}-h`} className="scroll-mt-24 border-t border-edge pt-6">
            <h3 id={`${evId(e.type)}-h`} className="font-mono text-[17px] font-medium">{e.type}</h3>
            <p className="mt-1 max-w-[68ch] text-fg-muted">{e.when}</p>
            {e.note && <p className="mt-1 text-[13px] text-fg-muted">{e.note}</p>}
            <div className="mt-3"><FixedCode code={pretty(eventPayload(e))} lang="json" title="Payload example" /></div>
          </section>
        )))}
      </div>
    </PageFrame>
  );
}
