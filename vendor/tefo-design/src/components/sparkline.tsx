import { useId } from "react";
import { cx } from "../lib/cx";
import { sparkGeometry } from "../lib/spark";

export interface SparklineProps {
  values: readonly number[];
  /** What the line shows, e.g. "Collections, last 14 days". Required: it is the accessible name. */
  label: string;
  /** Formats min and max for the text alternative. */
  format?: (n: number) => string;
  tone?: "money" | "rail" | "neutral";
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({ values, label, format = String, tone = "money", width = 120, height = 32, className }: SparklineProps) {
  const id = useId();
  const g = sparkGeometry(values, width, height);
  const summary = values.length ? `${label}: ${values.length} points, low ${format(g.min)}, high ${format(g.max)}, latest ${format(values[values.length - 1]!)}.` : `${label}: no data.`;
  return (
    <svg className={cx("pd-spark", className)} data-tone={tone} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={id}>
      <title id={id}>{summary}</title>
      {g.line ? (
        <>
          <path className="pd-spark-area" d={g.area} />
          <path className="pd-spark-line" d={g.line} />
          {g.last ? <circle className="pd-spark-dot" cx={g.last.x} cy={g.last.y} r={2.5} /> : null}
        </>
      ) : (
        <line className="pd-spark-line" x1={2} x2={width - 2} y1={height / 2} y2={height / 2} strokeDasharray="3 3" />
      )}
    </svg>
  );
}
