"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { Icon } from "./icons";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** `drawer` slides from the right (detail views) or from the left with `side="start"` (mobile nav). */
  variant?: "dialog" | "drawer";
  side?: "start" | "end";
  size?: "sm" | "md" | "lg";
  /** Hide the visible title (it stays as the accessible name). */
  hideTitle?: boolean;
  className?: string;
}

/** Built on the native <dialog>: focus is trapped, Escape closes, and focus returns to what opened it. */
export function Dialog({ open, onClose, title, description, children, footer, variant = "dialog", side = "end", size = "md", hideTitle, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    // The backdrop click is a convenience; Escape and the Close button are the keyboard routes.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      className={cx("pd-dialog", className)}
      data-variant={variant}
      data-side={side}
      data-size={size}
      aria-labelledby={`${id}-t`}
      aria-describedby={description ? `${id}-d` : undefined}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="pd-dialog-panel">
        <header className="pd-dialog-head">
          <h2 id={`${id}-t`} className={cx("pd-h3", hideTitle && "pd-vh")}>{title}</h2>
          <button type="button" className="pd-icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="x" />
          </button>
        </header>
        {description ? <p id={`${id}-d`} className="pd-dialog-desc">{description}</p> : null}
        <div className="pd-dialog-body">{children}</div>
        {footer ? <footer className="pd-dialog-foot">{footer}</footer> : null}
      </div>
    </dialog>
  );
}
