import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Icon, type IconName } from "./icons";

export interface EmptyStateProps {
  title: string;
  /** What is going on and what happens next. */
  description?: ReactNode;
  icon?: IconName;
  /** The next step as a <Button />. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon = "inbox", action, className }: EmptyStateProps) {
  return (
    <div className={cx("pd-empty", className)}>
      <span className="pd-empty-icon"><Icon name={icon} size={24} /></span>
      <h3 className="pd-h3">{title}</h3>
      {description ? <p className="pd-empty-text">{description}</p> : null}
      {action ? <div className="pd-empty-action">{action}</div> : null}
    </div>
  );
}
