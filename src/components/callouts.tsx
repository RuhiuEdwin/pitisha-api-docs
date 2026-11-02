import { AlertTriangle, Coins, FlaskConical, Info } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "note" | "money" | "proposed" | "sim";
const TONES: Record<Tone, { icon: typeof Info; label: string; cls: string }> = {
  note: { icon: Info, label: "Note", cls: "border-[var(--pd-info)] bg-info-bg" },
  money: { icon: Coins, label: "Amounts are in cents", cls: "border-[var(--pd-accent-text)] bg-sunken" },
  proposed: { icon: AlertTriangle, label: "Proposed", cls: "border-[var(--pd-warn)] bg-warn-bg" },
  sim: { icon: FlaskConical, label: "Simulated", cls: "border-[var(--pd-info)] bg-info-bg" },
};

/** Icon plus a word, never colour alone. */
export function Callout({ tone = "note", title, children, className }: { tone?: Tone; title?: string; children: ReactNode; className?: string }) {
  const t = TONES[tone];
  return (
    <aside role="note" aria-label={title ?? t.label} className={cn("my-4 flex gap-3 rounded-[var(--pd-radius-sm)] border-l-4 p-4 text-[14px]", t.cls, className)}>
      <t.icon size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
      <div className="min-w-0"><p className="font-medium">{title ?? t.label}</p><div className="mt-1 text-fg-muted [&_a]:underline [&_code]:font-mono [&_code]:text-[0.9em]">{children}</div></div>
    </aside>
  );
}

export function ProposedNote({ what = "The endpoints and the webhook scheme" }: { what?: string }) {
  return <Callout tone="proposed" title="Proposed">{what} on this site are a proposal. They are written to be complete and consistent, and the backend is meant to match them. Check the <Link href="/docs/versioning/">versioning page</Link> before you build on anything that is not yet in the sandbox. Nothing here says Tefo is live.</Callout>;
}

export function MoneyNote() {
  return <Callout tone="money">Every money field is an integer in cents. <code>250000</code> is KES 2,500.00, and <code>100</code> is KES 1.00. Never send decimals.</Callout>;
}
