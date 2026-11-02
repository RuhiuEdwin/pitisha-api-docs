/** The proposed webhook signature scheme v1: HMAC-SHA256 over "<t>.<raw body>", hex, header "t=<unix>,v1=<hex>". Works in the browser (Web Crypto) and in Node. */
export const TOLERANCE_SECONDS = 300;

export function parseHeader(header: string): { t: string; v1: string } | null {
  const parts: Record<string, string> = {};
  for (const p of header.trim().split(",")) {
    const i = p.indexOf("=");
    if (i > 0) parts[p.slice(0, i).trim()] = p.slice(i + 1).trim();
  }
  return parts.t && parts.v1 ? { t: parts.t, v1: parts.v1 } : null;
}

const hex = (b: ArrayBuffer) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join("");

export async function sign(secret: string, t: string | number, rawBody: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${rawBody}`)));
}

/** Compare without stopping at the first difference. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export type Verdict =
  | { ok: true; expected: string; ageSeconds: number }
  | { ok: false; reason: "bad_header" | "no_secret" | "mismatch" | "too_old"; expected?: string; ageSeconds?: number };

export async function verify(rawBody: string, header: string, secret: string, nowSeconds = Date.now() / 1000): Promise<Verdict> {
  const h = parseHeader(header);
  if (!h) return { ok: false, reason: "bad_header" };
  if (!secret) return { ok: false, reason: "no_secret" };
  const expected = await sign(secret, h.t, rawBody);
  const ageSeconds = nowSeconds - Number(h.t);
  if (!safeEqual(expected, h.v1)) return { ok: false, reason: "mismatch", expected, ageSeconds };
  if (!(Math.abs(ageSeconds) < TOLERANCE_SECONDS)) return { ok: false, reason: "too_old", expected, ageSeconds };
  return { ok: true, expected, ageSeconds };
}
