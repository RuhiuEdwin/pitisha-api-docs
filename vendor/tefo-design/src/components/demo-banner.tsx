import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Icon } from "./icons";

export interface DemoBannerProps {
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Always visible, never dismissible: people must not mistake sample data for real money. */
export function DemoBanner({ children = "Demo data. Nothing here is real money.", action, className }: DemoBannerProps) {
  return (
    <div className={cx("pd-demo", className)} role="note" aria-label="Demo notice">
      <Icon name="info" size={16} />
      <p className="pd-demo-text">{children}</p>
      {action ? <div className="pd-demo-action">{action}</div> : null}
    </div>
  );
}
