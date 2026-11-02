import { CircleAlert, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { CURRENT_VERSION, KIND_LABEL, RELEASES, type ChangeKind } from "@/content/changelog";

const ICON: Record<ChangeKind, typeof Plus> = { new: Plus, changed: RefreshCw, breaking: CircleAlert };

export function ChangelogView() {
  return (
    <div>
      <p className="max-w-[68ch]">The current version is <strong className="font-mono">{CURRENT_VERSION}</strong>. Versions are named by date. See <Link href="/docs/versioning/" className="underline">Versioning</Link> for what counts as a breaking change.</p>
      <ol className="mt-6 grid gap-8">
        {RELEASES.map((r) => (
          <li key={r.version} id={`v-${r.version}`} className="scroll-mt-24 border-t border-edge pt-6">
            <h2 className="flex flex-wrap items-baseline gap-x-3"><span className="font-mono text-[20px]">{r.version}</span>{r.version === CURRENT_VERSION && <span className="rounded-full border border-[var(--pd-accent-text)] px-2 text-[12px] text-accent-text">Current</span>}</h2>
            <p className="mt-1 text-fg-muted">{r.title}</p>
            <ul className="mt-3 grid gap-2">
              {r.changes.map((c, i) => { const I = ICON[c.kind]; return <li key={i} className="flex items-start gap-3 text-[14.5px]"><span className="mt-0.5 inline-flex w-24 shrink-0 items-center gap-1.5 text-[12px] font-medium"><I size={13} aria-hidden="true" />{KIND_LABEL[c.kind]}</span><span className="max-w-[62ch]">{c.text}</span></li>; })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
