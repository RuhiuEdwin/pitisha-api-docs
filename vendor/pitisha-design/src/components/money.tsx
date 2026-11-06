import type { HTMLAttributes } from "react";
import { cx } from "../lib/cx";
import { formatMoney, type Cents, type FormatOptions } from "../lib/money";

export interface MoneyProps extends FormatOptions, Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Whole cents. KES 1,500.00 is 150000. */
  cents: Cents;
  /** Colour the sign: money in reads ok, money out reads normal. Never red; red is for failures. */
  signed?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

/** The one way to show an amount. Tabular figures so columns line up. */
export function Money({ cents, symbol, trimZeros, showPlus, currency, signed, size = "md", className, ...rest }: MoneyProps) {
  const text = formatMoney(cents, { symbol, trimZeros, showPlus, currency });
  return (
    <span {...rest} className={cx("pd-money pd-num", className)} data-size={size} data-sign={signed ? (text.startsWith("-") ? "out" : "in") : undefined}>
      {text}
    </span>
  );
}
