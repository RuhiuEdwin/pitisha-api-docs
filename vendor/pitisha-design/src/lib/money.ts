/** Money is always whole minor units (cents). KES 1,500.00 is 150000. Nothing here uses floating point for the amount. */
export type Cents = number | bigint | string;

const toBig = (c: Cents): bigint => {
  if (typeof c === "bigint") return c;
  if (typeof c === "number") {
    if (!Number.isFinite(c) || !Number.isInteger(c)) throw new RangeError(`Money must be whole cents, got ${c}`);
    return BigInt(c);
  }
  if (!/^-?\d+$/.test(c.trim())) throw new RangeError(`Money must be whole cents, got "${c}"`);
  return BigInt(c.trim());
};

const group = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export interface FormatOptions {
  /** "KES" prefix. Default true. */
  symbol?: boolean;
  /** Drop ".00" when the amount is whole shillings. Default false, so columns stay aligned. */
  trimZeros?: boolean;
  /** Prefix positive amounts with "+". Default false. */
  showPlus?: boolean;
  currency?: string;
}

/** 150000 -> "KES 1,500.00". Negative -> "-KES 1,500.00". Accepts number, bigint or a digit string. */
export function formatMoney(cents: Cents, o: FormatOptions = {}): string {
  const n = toBig(cents);
  const neg = n < 0n;
  const abs = neg ? -n : n;
  const major = abs / 100n;
  const minor = (abs % 100n).toString().padStart(2, "0");
  const body = `${group(major.toString())}${o.trimZeros && minor === "00" ? "" : `.${minor}`}`;
  const sign = neg ? "-" : o.showPlus && n > 0n ? "+" : "";
  return `${sign}${o.symbol === false ? "" : `${o.currency ?? "KES"} `}${body}`;
}

/** Plain decimal string for CSV and forms: 150000 -> "1500.00". */
export function majorString(cents: Cents): string {
  return formatMoney(cents, { symbol: false }).replace(/,/g, "");
}

/** Parse what a person typed ("1,500", "1500.5") into cents. Returns null if it is not a valid positive-or-zero amount. */
export function parseKes(text: string): number | null {
  const t = text.trim().replace(/,/g, "").replace(/^KES\s*/i, "");
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  const [w = "0", f = ""] = t.split(".");
  return Number(w) * 100 + Number(f.padEnd(2, "0"));
}
