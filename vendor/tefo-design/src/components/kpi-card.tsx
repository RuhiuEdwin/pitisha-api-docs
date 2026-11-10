import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Icon } from "./icons";
import { IconTile, type IconTileTone } from "./icon-tile";

export interface KpiCardProps {
  label: string;
  /** The number. Shown in Plex Mono. */
  value: ReactNode;
  /** An icon for the tile. */
  icon?: ReactNode;
  tone?: IconTileTone;
  explain?: ReactNode;
  trend?: { direction: "up" | "down" | "flat"; text: string; good?: boolean };
  /** One link, for example <a href="/transactions">See the payments</a>. */
  action?: ReactNode;
  className?: string;
}

/** White, borderless, soft shadow, small icon tile, label, big mono number, one link. */
export function KpiCard({ label, value, icon, tone = "neutral", explain, trend, action, className }: KpiCardProps) {
  const good = trend ? (trend.good ?? trend.direction !== "down") : true;
  return (
    <section className={cx("pd-kpi-card", className)} aria-label={label}>
      <div className="pd-kpi-card-head">
        {icon ? <IconTile tone={tone}>{icon}</IconTile> : null}
        <h3 className="pd-kpi-card-label">{label}</h3>
      </div>
      <p className="pd-kpi-card-value">{value}</p>
      {trend ? (
        <p className="pd-kpi-card-trend" data-good={good ? "" : undefined}>
          <Icon name={trend.direction === "up" ? "trend-up" : trend.direction === "down" ? "trend-down" : "minus"} size={14} />
          <span>{trend.text}</span>
        </p>
      ) : null}
      {explain ? <p className="pd-kpi-card-explain">{explain}</p> : null}
      {action ? <div className="pd-kpi-card-action">{action}</div> : null}
    </section>
  );
}
