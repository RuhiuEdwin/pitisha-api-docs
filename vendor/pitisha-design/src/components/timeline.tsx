import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Icon, type IconName } from "./icons";

export type TimelineState = "done" | "current" | "pending" | "failed";
export interface TimelineItem {
  id: string;
  title: ReactNode;
  /** When it happened. Pre-formatted by the app so dates stay consistent there. */
  time?: ReactNode;
  detail?: ReactNode;
  state?: TimelineState;
}

const ICON: Record<TimelineState, IconName> = { done: "check-circle", current: "clock", pending: "minus", failed: "x-octagon" };
const WORD: Record<TimelineState, string> = { done: "Done", current: "In progress", pending: "Waiting", failed: "Failed" };

export function Timeline({ items, className, label = "Timeline" }: { items: readonly TimelineItem[]; className?: string; label?: string }) {
  return (
    <ol className={cx("pd-timeline", className)} aria-label={label}>
      {items.map((it) => {
        const s = it.state ?? "done";
        return (
          <li key={it.id} className="pd-tl-item" data-state={s}>
            <span className="pd-tl-mark"><Icon name={ICON[s]} size={16} /></span>
            <div className="pd-tl-body">
              <p className="pd-tl-title">
                {it.title} <span className="pd-tl-word">{WORD[s]}</span>
              </p>
              {it.time ? <p className="pd-tl-time pd-num">{it.time}</p> : null}
              {it.detail ? <div className="pd-tl-detail">{it.detail}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
