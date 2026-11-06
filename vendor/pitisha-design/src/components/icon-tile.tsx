import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type IconTileTone = "neutral" | "money" | "rail" | "ok" | "sun";

export interface IconTileProps {
  /** An svg icon, 16px. Decorative: the label next to it carries the meaning. */
  children: ReactNode;
  tone?: IconTileTone;
  className?: string;
}

/** Meaning in colour without framing a card: aqua money in, teal money out, green matched, Sun needs a look. */
export function IconTile({ children, tone = "neutral", className }: IconTileProps) {
  return <span className={cx("pd-icon-tile", className)} data-tone={tone} aria-hidden="true">{children}</span>;
}
