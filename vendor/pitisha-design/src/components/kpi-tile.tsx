import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Icon } from "./icons";

export interface KpiTileProps {
  label: string;
  /** The number. Use <Money /> for money. */
  value: ReactNode;
  /** One plain sentence: what this number is and how it is worked out. */
  explain: ReactNode;
  /** Change since the previous period. Shown with an arrow and a word, never colour alone. */
  trend?: { direction: "up" | "down" | "flat"; text: string; /** Does this direction help the business? Default true for up. */ good?: boolean };
  /** A <Sparkline />. */
  chart?: ReactNode;
  /** What to do next, if anything. */
  action?: ReactNode;
  className?: string;
}

export function KpiTile({ label, value, explain, trend, chart, action, className }: KpiTileProps) {
  const good = trend ? (trend.good ?? trend.direction !== "down") : true;
  return (
    <section className={cx("pd-kpi", className)} aria-label={label}>
      <h3 className="pd-kpi-label">{label}</h3>
      <p className="pd-kpi-value pd-num">{value}</p>
      {trend ? (
        <p className="pd-kpi-trend" data-good={good ? "" : undefined}>
          <Icon name={trend.direction === "up" ? "trend-up" : trend.direction === "down" ? "trend-down" : "minus"} size={14} />
          <span>{trend.text}</span>
        </p>
      ) : null}
      {chart ? <div className="pd-kpi-chart">{chart}</div> : null}
      <p className="pd-kpi-explain">{explain}</p>
      {action ? <div className="pd-kpi-action">{action}</div> : null}
    </section>
  );
}
