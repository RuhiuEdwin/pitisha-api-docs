import type { Field } from "@/content/api";

export function Params({ title, fields }: { title: string; fields?: Field[] }) {
  if (!fields?.length) return null;
  return (
    <section className="mt-6">
      <h4 className="mb-2 text-[13px] font-medium">{title}</h4>
      <ul className="divide-y divide-line rounded-xl border border-line">
        {fields.map((f) => (
          <li key={f.name} className="px-4 py-3 text-[13.5px]">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <code className="font-mono text-[13px] font-medium">{f.name}</code>
              <span className="font-mono text-xs text-muted">{f.type}</span>
              {f.required && <span className="text-xs font-medium text-err">required</span>}
            </div>
            <p className="mt-1 text-muted">{f.description}</p>
            {f.values && <p className="mt-1 text-xs text-muted">One of {f.values.map((v, i) => <span key={v}>{i > 0 && ", "}<code className="rounded bg-ivory px-1 font-mono">{v}</code></span>)}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
