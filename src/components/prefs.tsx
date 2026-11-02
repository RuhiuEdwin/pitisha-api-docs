"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { EnvId } from "@/content/config";
import type { Lang } from "@/lib/snippets";

export type Theme = "light" | "dark";
interface Prefs { theme: Theme; setTheme: (t: Theme) => void; env: EnvId; setEnv: (e: EnvId) => void; lang: Lang; setLang: (l: Lang) => void }

const Ctx = createContext<Prefs | null>(null);

const read = (k: string): string | null => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage can be blocked */ } };

/** Theme, environment and language are remembered on this device. Storage can be blocked, so every read and write is guarded. */
export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [env, setEnvState] = useState<EnvId>("sandbox");
  const [lang, setLangState] = useState<Lang>("curl");

  useEffect(() => {
    const t = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const e = read("pitisha-docs-env");
    const l = read("pitisha-docs-lang");
    // Restoring saved choices after hydration, so the server HTML and the first client render match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(t);
    if (e === "sandbox" || e === "live") setEnvState(e);
    if (l === "curl" || l === "javascript" || l === "python" || l === "php") setLangState(l);
  }, []);

  const setTheme = useCallback((t: Theme) => { setThemeState(t); document.documentElement.dataset.theme = t; write("pitisha-docs-theme", t); }, []);
  const setEnv = useCallback((e: EnvId) => { setEnvState(e); write("pitisha-docs-env", e); }, []);
  const setLang = useCallback((l: Lang) => { setLangState(l); write("pitisha-docs-lang", l); }, []);
  const value = useMemo(() => ({ theme, setTheme, env, setEnv, lang, setLang }), [theme, setTheme, env, setEnv, lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs(): Prefs {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePrefs needs PrefsProvider");
  return c;
}

/** Saved on this device only: used by checklists, quickstart progress and feedback. */
export function useLocal<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    const raw = read(key);
    if (raw !== null) { try { // eslint-disable-next-line react-hooks/set-state-in-effect
      setV(JSON.parse(raw) as T); } catch { /* ignore a corrupt value */ } }
  }, [key]);
  const set = useCallback((n: T) => { setV(n); write(key, JSON.stringify(n)); }, [key]);
  return [v, set];
}
