import { cloneElement, isValidElement, useId, type InputHTMLAttributes, type ReactElement, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cx } from "../lib/cx";

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  /** A message that says what is wrong and how to fix it. */
  error?: ReactNode;
  required?: boolean;
  className?: string;
  /** One control. Its id, aria-describedby and aria-invalid are filled in for you. */
  children: ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean; required?: boolean }>;
}

export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  const control = isValidElement(children)
    ? cloneElement(children, { id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined, required: required || undefined })
    : children;
  return (
    <div className={cx("pd-field", className)} data-invalid={error ? "" : undefined}>
      <label className="pd-field-label" htmlFor={id}>
        {label}
        {required ? <span className="pd-field-req"> (required)</span> : null}
      </label>
      {hint ? <p className="pd-field-hint" id={hintId}>{hint}</p> : null}
      {control}
      {error ? <p className="pd-field-error" id={errId}>{error}</p> : null}
    </div>
  );
}

export const Input = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cx("pd-input", className)} />;
export const Textarea = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cx("pd-input pd-textarea", className)} />;
export const Select = ({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cx("pd-input pd-select", className)}>{children}</select>;
