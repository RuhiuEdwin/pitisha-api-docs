import type { HTMLAttributes } from "react";
import { cx } from "../lib/cx";
import { STATUS, type Status } from "../lib/status";
import { Icon, type IconName } from "./icons";

const ICON: Record<Status, IconName> = { matched: "check-circle", pile: "layers", no_match: "help-circle", pending: "clock", failed: "x-octagon" };

export interface StatusPillProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  status: Status;
  /** Show the next step under the pill's label as a tooltip-free hint line (use in drawers and detail views). */
  showNext?: boolean;
}

/** Icon plus word, always. Colour only reinforces it. Red is used for `failed` only. */
export function StatusPill({ status, showNext, className, ...rest }: StatusPillProps) {
  const m = STATUS[status];
  return (
    <span {...rest} className={cx("pd-pill", className)} data-status={status} data-tone={m.tone}>
      <Icon name={ICON[status]} size={14} />
      <span>{m.label}</span>
      {showNext ? <span className="pd-vh">. {m.next}</span> : null}
    </span>
  );
}
