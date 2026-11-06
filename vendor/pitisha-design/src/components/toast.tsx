"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./icons";

export type ToastTone = "neutral" | "ok" | "warn" | "err";
export interface ToastInput {
  title: string;
  description?: ReactNode;
  tone?: ToastTone;
  /** ms before it goes away. 0 keeps it until dismissed. Failures default to 0 so they are never missed. */
  duration?: number;
}
interface ToastItem extends ToastInput { id: number }
interface ToastApi { push: (t: ToastInput) => number; dismiss: (id: number) => void }

const Ctx = createContext<ToastApi | null>(null);
const ICON: Record<ToastTone, IconName> = { neutral: "info", ok: "check-circle", warn: "alert-triangle", err: "x-octagon" };

export function useToast(): ToastApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useToast must be used inside <ToastProvider>");
  return v;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const next = useRef(1);
  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const push = useCallback((t: ToastInput) => {
    const id = next.current++;
    setItems((l) => [...l.slice(-3), { ...t, id }]);
    return id;
  }, []);
  const api = useMemo(() => ({ push, dismiss }), [push, dismiss]);
  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="pd-toasts" role="region" aria-label="Notifications">
        {items.map((t) => (
          <ToastView key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const tone = item.tone ?? "neutral";
  const duration = item.duration ?? (tone === "err" ? 0 : 8000);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!duration || paused) return;
    const h = setTimeout(onDismiss, duration);
    return () => clearTimeout(h);
  }, [duration, paused, onDismiss]);
  return (
    <div
      className="pd-toast"
      data-tone={tone}
      role={tone === "err" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon name={ICON[tone]} size={18} />
      <div className="pd-toast-body">
        <p className="pd-toast-title">{item.title}</p>
        {item.description ? <p className="pd-toast-desc">{item.description}</p> : null}
      </div>
      <button type="button" className="pd-icon-btn" onClick={onDismiss} aria-label={`Dismiss: ${item.title}`}>
        <Icon name="x" />
      </button>
    </div>
  );
}
