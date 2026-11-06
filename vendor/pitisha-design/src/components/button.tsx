import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";

type Common = {
  variant?: "primary" | "accent" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
};
export type ButtonProps = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined };
export type ButtonLinkProps = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & { href: string };

/** Primary is ink (light) or gold (dark). Accent is always gold. Danger is red and for destructive or failure actions only. */
export function Button(props: ButtonProps | ButtonLinkProps) {
  const { variant = "primary", size = "md", loading, iconStart, iconEnd, children, className, ...rest } = props;
  const cls = cx("pd-btn", className);
  const inner = (
    <>
      {loading ? <span className="pd-spinner" aria-hidden="true" /> : iconStart}
      {children}
      {iconEnd}
    </>
  );
  if ("href" in props && props.href !== undefined) {
    const { href, ...a } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return <a {...a} href={href} className={cls} data-variant={variant} data-size={size}>{inner}</a>;
  }
  const { type = "button", disabled, ...b } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...b} type={type} className={cls} data-variant={variant} data-size={size} disabled={disabled} aria-busy={loading || undefined} aria-disabled={loading || undefined} onClick={loading ? undefined : b.onClick}>
      {inner}
    </button>
  );
}
