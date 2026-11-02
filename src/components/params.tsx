import { CircleAlert } from "lucide-react";
import { MoneyHint } from "@/components/money-hint";
import { enumMeanings, type Field } from "@/content/api";

/** Fields with their units and values explained: money says it is cents, enums get a table of meanings. */
export function Params({ title, fields, scope, resourceKey }: { title: string; fields?: Field[]; scope: string; resourceKey: string }) {
  if (!fields?.length) return null;
  const firstMoney = fields.find((f) => f.money)?.name;
  return (
    <section className="mt-6" aria-label={title}>
      <h4 className="mb-2 text-[13px] font-medium">{title}</h4>
      <ul className="divide-y divide-edge rounded-[var(--pd-radius-sm)] border border-edge bg-surface">
        {fields.map((f) => {
          const meanings = f.values ? enumMeanings(resourceKey, f) : undefined;
          return (
            <li key={f.name} id={`${scope}-${f.name}`} className="scroll-mt-24 px-4 py-3 text-[14px]">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <code className="font-mono text-[13px] font-medium">{f.name}</code>
                <span className="font-mono text-xs text-fg-muted">{f.type}</span>
                {f.required && <span className="inline-flex items-center gap-1 text-xs font-medium text-err"><CircleAlert size={12} aria-hidden="true" />Required</span>}
                {f.money && <span className="rounded-full border border-[var(--pd-accent-text)] px-2 text-[11px] font-medium text-accent-text">Cents</span>}
              </div>
              <p className="mt-1 text-fg-muted">{f.description}</p>
              {f.money && (
                <>
                  <p className="mt-1 text-[13px]"><strong>In cents, not shillings.</strong> <code className="font-mono">250000</code> is KES 2,500.00.</p>
                  {f.name === firstMoney && <MoneyHint />}
                </>
              )}
              {f.values && (
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full min-w-[18rem] border-collapse text-[13px]">
                    <caption className="pd-vh">Allowed values for {f.name}</caption>
                    <thead><tr className="text-left text-fg-muted"><th scope="col" className="border-b border-edge py-1 pr-4 font-medium">Value</th>{meanings && <th scope="col" className="border-b border-edge py-1 font-medium">Meaning</th>}</tr></thead>
                    <tbody>{f.values.map((v) => <tr key={v}><td className="border-b border-edge py-1.5 pr-4 align-top"><code className="font-mono">{v}</code></td>{meanings && <td className="border-b border-edge py-1.5 align-top text-fg-muted">{meanings[v] ?? ""}</td>}</tr>)}</tbody>
                  </table>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
