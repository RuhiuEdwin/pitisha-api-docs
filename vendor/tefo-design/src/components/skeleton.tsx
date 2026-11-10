import { cx } from "../lib/cx";

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  /** Render this many text-height lines. */
  lines?: number;
  className?: string;
}

/** A placeholder while data loads. Hidden from assistive tech; announce loading on the region that owns it (aria-busy). */
export function Skeleton({ width = "100%", height = "1em", lines = 1, className }: SkeletonProps) {
  return (
    <span className={cx("pd-skeleton-wrap", className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="pd-skeleton" style={{ width: lines > 1 && i === lines - 1 ? "60%" : width, height }} />
      ))}
    </span>
  );
}
