import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export interface PageHeaderProps {
  title: ReactNode;
  /** One plain sentence. */
  sub?: ReactNode;
  /** Right-aligned controls: a range select, a primary button. */
  actions?: ReactNode;
  className?: string;
}

/** Serif title, one plain sentence, actions on the right. No banner. */
export function PageHeader({ title, sub, actions, className }: PageHeaderProps) {
  return (
    <div className={cx("pd-page-header", className)}>
      <div>
        <h1 className="pd-page-title">{title}</h1>
        {sub ? <p className="pd-page-sub">{sub}</p> : null}
      </div>
      {actions ? <div className="pd-page-actions">{actions}</div> : null}
    </div>
  );
}
