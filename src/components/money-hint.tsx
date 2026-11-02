"use client";

import { useId, useState } from "react";
import { formatMoney } from "pitisha-design";

/** A tiny converter next to money fields: type cents, see shillings. */
export function MoneyHint({ example = 250000 }: { example?: number }) {
  const id = useId();
  const [v, setV] = useState(String(example));
  const ok = /^\d{1,13}$/.test(v);
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[var(--pd-radius-xs)] bg-sunken px-3 py-2 text-[13px]">
      <label htmlFor={id} className="font-medium">Cents</label>
      <input id={id} inputMode="numeric" value={v} onChange={(e) => setV(e.target.value.trim())} aria-invalid={!ok} aria-describedby={`${id}-o`} className="h-9 w-32 rounded-[var(--pd-radius-xs)] border border-edge bg-surface px-2 font-mono text-[13px]" />
      <span id={`${id}-o`} className="pd-num" role="status">{ok ? <>= <strong>{formatMoney(BigInt(v))}</strong></> : "Digits only: whole cents."}</span>
    </div>
  );
}
