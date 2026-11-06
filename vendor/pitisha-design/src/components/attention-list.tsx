import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export interface AttentionItem {
  id: string;
  /** A <StatusChip />. */
  chip: ReactNode;
  title: ReactNode;
  detail?: ReactNode;
  /** Pre-formatted money, for example <Money />. Shown in mono. */
  amount?: ReactNode;
  /** One button or link. */
  action: ReactNode;
}

export interface AttentionListProps {
  title?: ReactNode;
  sub?: ReactNode;
  items: readonly AttentionItem[];
  /** Shown when there is nothing to do. */
  empty?: ReactNode;
  className?: string;
}

/** "Needs your attention": a chip, one line, an amount, one action. Worst first is the caller's job. */
export function AttentionList({ title = "Needs your attention", sub, items, empty, className }: AttentionListProps) {
  return (
    <section className={cx("pd-attn", className)} aria-label={typeof title === "string" ? title : "Needs your attention"}>
      <header className="pd-attn-head">
        <h2 className="pd-attn-title">{title}</h2>
        {sub ? <p className="pd-attn-sub">{sub}</p> : null}
      </header>
      {items.length === 0 ? <div className="pd-attn-row" role="status">{empty ?? "You are all caught up."}</div> : (
        <ul className="pd-attn-list">
          {items.map((it) => (
            <li key={it.id} className="pd-attn-row">
              <div className="pd-attn-main">
                <div className="pd-attn-line">{it.chip}<span>{it.title}</span></div>
                {it.detail ? <p className="pd-attn-detail">{it.detail}</p> : null}
              </div>
              {it.amount ? <div className="pd-attn-amount">{it.amount}<small>involved</small></div> : null}
              {it.action}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
