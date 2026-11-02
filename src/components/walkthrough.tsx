import { Clock, Flag } from "lucide-react";
import Link from "next/link";
import { FixedCode, LangCode, RequestCode } from "@/components/code";
import { Markdown } from "@/components/markdown";
import { ProgressBar, StepShell, Tracker } from "@/components/tracker";
import type { Walkthrough } from "@/content/walkthroughs";

/** Quickstart and recipes: an outcome, then numbered steps with code in four languages and what you should see. */
export async function WalkthroughView({ w, storageKey }: { w: Walkthrough; storageKey: string }) {
  return (
    <Tracker storageKey={storageKey} steps={w.steps.map((s) => ({ id: s.id, title: s.title }))}>
      <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[14px] text-fg-muted"><span className="inline-flex items-center gap-1.5"><Clock size={14} aria-hidden="true" />About {w.minutes} minutes</span><span className="inline-flex items-center gap-1.5"><Flag size={14} aria-hidden="true" />{w.steps.length} steps</span></p>
      <p className="mt-3 max-w-[68ch] text-[16px]"><strong>At the end:</strong> {w.outcome}</p>
      <ProgressBar />
      {await Promise.all(w.steps.map(async (s, i) => (
        <StepShell key={s.id} id={s.id} index={i + 1} title={s.title}>
          <Markdown>{s.body}</Markdown>
          {s.shared && <FixedCode code={s.shared.code} lang={s.shared.lang} title={s.shared.title} />}
          {s.req && <RequestCode req={s.req} />}
          {s.code && <LangCode code={s.code} />}
          {s.expect && <div><p className="mb-1 text-[13px] font-medium">You should see</p><FixedCode code={s.expect.code} lang={s.expect.lang === "json" ? "json" : "text"} title={s.expect.lang === "json" ? "Response" : "Expected"} /></div>}
        </StepShell>
      )))}
      <section aria-label="What next" className="border-t border-edge pt-6">
        <h2 className="pd-h3">What next</h2>
        <ul className="mt-3 flex flex-wrap gap-2">{w.related.map((r) => <li key={r.href}><Link href={r.href} className="inline-flex min-h-11 items-center rounded-[var(--pd-radius-sm)] border border-edge-strong px-4 text-[14px] hover:bg-sunken">{r.label}</Link></li>)}</ul>
      </section>
    </Tracker>
  );
}
