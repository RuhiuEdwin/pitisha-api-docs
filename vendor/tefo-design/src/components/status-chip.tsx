import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";

export type StatusChipTone = "neutral" | "ok" | "warn" | "sun" | "info" | "err" | "aqua";

export interface StatusChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  tone?: StatusChipTone;
  /** Required: status is always an icon plus a word. */
  icon: ReactNode;
  children: ReactNode;
}

/** Generic chip for any status in a table or list. `err` is for failure only. For the five payment statuses use StatusPill. */
export function StatusChip({ tone = "neutral", icon, children, className, ...rest }: StatusChipProps) {
  return <span {...rest} className={cx("pd-chip", className)} data-tone={tone}>{icon}<span>{children}</span></span>;
}
