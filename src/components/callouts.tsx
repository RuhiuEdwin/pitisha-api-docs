import { AlertTriangle, Coins, FlaskConical, Info, OctagonAlert, Repeat } from "lucide-react";
import type { ReactNode } from "react";
import { IconTile } from "pitisha-design";
import { cn } from "@/lib/cn";

type Tone = "note" | "money" | "proposed" | "sim" | "error" | "idempotency";
type TileTone = "neutral" | "money" | "rail" | "ok" | "sun";
const TONES: Record<Tone, { icon: typeof Info; label: string; tile: TileTone; err?: boolean }> = {
  note: { icon: Info, label: "Note", tile: "rail" },
  money: { icon: Coins, label: "Amounts are in cents", tile: "money" },
  proposed: { icon: AlertTriangle, label: "Proposed", tile: "sun" },
  sim: { icon: FlaskConical, label: "Simulated", tile: "rail" },
  error: { icon: OctagonAlert, label: "Error", tile: "neutral", err: true },
  idempotency: { icon: Repeat, label: "Idempotency", tile: "sun" },
};

/** White, borderless panel with a small icon tile. Meaning is in the tile and the title word, never in an edge. */
export function Callout({ tone = "note", title, children, className }: { tone?: Tone; title?: string; children: ReactNode; className?: string }) {
  const t = TONES[tone];
  return (
    <aside role="note" aria-label={title ?? t.label} className={cn("my-4 flex gap-3 rounded-[var(--pd-radius-lg)] bg-surface p-4 text-[14px] shadow-pd-sm", className)}>
      <IconTile tone={t.tile} className={t.err ? "callout-err-tile" : undefined}><t.icon aria-hidden="true" /></IconTile>
      <div className="min-w-0"><p className="pt-1 font-medium">{title ?? t.label}</p><div className="mt-1 text-fg-muted [&_a]:underline [&_code]:font-mono [&_code]:text-[0.9em]">{children}</div></div>
    </aside>
  );
}

/** The proposal notice lives in the one strip at the top of the shell, so pages render nothing here. */
export function ProposedNote(_props: { what?: string }) {
  void _props;
  return null;
}

export function MoneyNote() {
  return <Callout tone="money">Every money field is an integer in cents. <code>250000</code> is KES 2,500.00, and <code>100</code> is KES 1.00. Never send decimals.</Callout>;
}

