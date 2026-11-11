/** Every environment value in the docs comes from here. Set the NEXT_PUBLIC_* variables at build time. */

export type EnvId = "sandbox" | "live";

export interface EnvConfig {
  id: EnvId;
  label: string;
  /** null until a real URL is configured. The docs then show a placeholder. */
  baseUrl: string | null;
  keyPrefix: string;
  /** Whether this page can run the simulated sandbox against it. */
  simulated: boolean;
  note: string;
}

const clean = (v: string | undefined) => (v && v.trim() ? v.trim().replace(/\/+$/, "") : null);

export const ENVS: Record<EnvId, EnvConfig> = {
  sandbox: {
    id: "sandbox",
    label: "Sandbox",
    baseUrl: clean(process.env.NEXT_PUBLIC_TEFO_SANDBOX_URL),
    keyPrefix: "sk_test_",
    simulated: true,
    note: "Test keys, no real money. Try it on this site is simulated in your browser.",
  },
  live: {
    id: "live",
    label: "Live",
    baseUrl: clean(process.env.NEXT_PUBLIC_TEFO_LIVE_URL),
    keyPrefix: "sk_live_",
    simulated: false,
    note: "Real payments. Live access is requested in the partners portal and reviewed first. Nothing on this site ever sends a live request.",
  },
};

export const ENV_IDS: EnvId[] = ["sandbox", "live"];
export const PLACEHOLDER_BASE = "https://YOUR-BASE-URL";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tefo-api-docs.vercel.app";
export const STATUS_URL = clean(process.env.NEXT_PUBLIC_STATUS_URL);
export const PORTAL_URL = clean(process.env.NEXT_PUBLIC_PORTAL_URL);
export const REPO_URL = clean(process.env.NEXT_PUBLIC_DOCS_REPO_URL) ?? "https://github.com/RuhiuEdwin/tefo-api-docs";
export const REPO_BRANCH = process.env.NEXT_PUBLIC_DOCS_REPO_BRANCH ?? "main";

/** The README calls the endpoints and the webhook scheme a proposal until the backend matches. Flip this when that is no longer true. */
export const PROPOSED = true;
export const API_VERSION = "2026-11-10.1";

