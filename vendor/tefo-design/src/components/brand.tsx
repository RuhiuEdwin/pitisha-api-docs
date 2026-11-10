import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export interface BrandProps {
  /** The lockup: an <img> or svg. Two images, one per theme, if the lockup differs. */
  logo: ReactNode;
  /** "Partners", or "Admin" with `internal`. */
  chip?: string;
  className?: string;
}

/** Sidebar head: the Tefo lockup plus a small role chip. Pass as AppShell's `brand`. */
export function Brand({ logo, chip, className }: BrandProps) {
  return <span className={cx("pd-brand", className)}>{logo}{chip ? <span className="pd-brand-chip">{chip}</span> : null}</span>;
}
