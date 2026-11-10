/** The statuses a payment can show. Names and meanings come from tefo-backend docs (API.md, DARAJA.md). */
export type Status = "matched" | "pile" | "no_match" | "pending" | "failed";

export interface StatusMeta {
  label: string;
  /** What it means, in plain words. */
  meaning: string;
  /** What a person can do about it. */
  next: string;
  tone: "ok" | "info" | "warn" | "neutral" | "err";
}

export const STATUS: Record<Status, StatusMeta> = {
  matched: { label: "Matched", meaning: "The reference fits your sales format, so this payment is tied to a sale.", next: "Nothing to do.", tone: "ok" },
  pile: { label: "In the pile", meaning: "The payment arrived with a reference that does not fit your sales format.", next: "Resolve it by linking it to a sale.", tone: "warn" },
  no_match: { label: "No match", meaning: "The payment arrived without a reference, so it could not be tied to a sale.", next: "Check the customer details and resolve it.", tone: "warn" },
  pending: { label: "Pending", meaning: "The payment has started and is not confirmed yet.", next: "Wait for confirmation, or query its status.", tone: "info" },
  failed: { label: "Failed", meaning: "The payment did not go through.", next: "Read the reason, then retry or contact the customer.", tone: "err" },
};

export const STATUS_ORDER: Status[] = ["matched", "pile", "no_match", "pending", "failed"];
