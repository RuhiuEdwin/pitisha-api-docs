import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export interface DemoStripProps {
  /** One sentence. */
  children: ReactNode;
  /** Links or buttons on the right. */
  actions?: ReactNode;
  /** Sun for demo and sandbox, warn for a notice, err for offline. Default Sun. */
  tone?: "sun" | "warn" | "err";
  className?: string;
}

/** The one slim strip above the top bar. Only ever render one: pick the most important message. */
export function DemoStrip({ children, actions, tone = "sun", className }: DemoStripProps) {
  return (
    <div className={cx("pd-strip", className)} role={tone === "err" ? "alert" : "note"} data-tone={tone === "sun" ? undefined : tone}>
      <p>{children}</p>
      {actions ? <div className="pd-strip-actions">{actions}</div> : null}
    </div>
  );
}
