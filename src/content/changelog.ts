import { API_VERSION } from "./config";

export type ChangeKind = "new" | "changed" | "breaking";
export interface Release { version: string; title: string; changes: { kind: ChangeKind; text: string }[] }

/** Newest first. The newest version here is the current API version. */
export const RELEASES: Release[] = [
  {
    version: "2026-11-10",
    title: "Payment rails, wallet transfers, app security, card refunds",
    changes: [
      { kind: "changed", text: "A collection is simply pending, succeeded or failed. Anything beyond that has been removed from the collection object, its filters and its events." },
      { kind: "new", text: "A rail field on collections and payouts: mpesa, airtel_money, card (hosted checkout, with return_url and cancel_url) and pesalink (bank payouts and payment_instructions). Everything except M-Pesa is not yet verified with its provider and works only where Tefo enabled it. GET /v1/rails lists what your business can use." },
      { kind: "new", text: "result_url on collections, an app default callback URL, an IP allowlist per app and the ip_not_allowed error." },
      { kind: "new", text: "Wallet-to-wallet transfers: GET /v1/wallets/lookup, POST /v1/transfers, GET /v1/transfers and four transfer events." },
      { kind: "new", text: "POST /v1/collections/{id}/refund for card payments and POST /v1/rails/pesalink/validate_account." },
      { kind: "new", text: "Collections gain fee and receipt. Errors rail_not_enabled, recipient_not_found and recipient_unavailable." },
      { kind: "new", text: "Guides: Payment rails, Wallet transfers, App security. Recipes: Collect on a paybill, Take a card payment, Move money between wallets." },
    ],
  },
  {
    version: "2026-10-29",
    title: "Approvals, payment requests and links, bulk payouts, statements and fees",
    changes: [
      { kind: "new", text: "Payouts can be pending_approval or rejected, hold money on the wallet, and carry an approval object. New events payout.approval_required, payout.approved, payout.rejected." },
      { kind: "changed", text: "Wallets gain held and status." },
      { kind: "new", text: "Payment requests, payment links, bulk payouts, /v1/statement, /v1/fees and POST /v1/collections/{id}/query." },
      { kind: "new", text: "Errors verification_required and service_stopped." },
      { kind: "new", text: "Guides: Approvals and holds, Fees and statements." },
    ],
  },
  {
    version: "2026-10-28",
    title: "First version of the documentation",
    changes: [
      { kind: "new", text: "Collections, payouts, settlements, wallets, shortcodes, webhook endpoints, events and sandbox tools." },
      { kind: "new", text: "Webhook signature scheme v1 (HMAC-SHA256 over the timestamp and the raw body)." },
      { kind: "new", text: "The routing object on collections." },
    ],
  },
];

export const CURRENT_VERSION = RELEASES[0].version;
if (CURRENT_VERSION !== API_VERSION) throw new Error(`config API_VERSION ${API_VERSION} must equal the newest release ${CURRENT_VERSION}`);

export const KIND_LABEL: Record<ChangeKind, string> = { new: "New", changed: "Changed", breaking: "Breaking" };

export const changelogMarkdown = () =>
  RELEASES.map((r) => `## ${r.version}\n\n${r.title}.\n\n${r.changes.map((c) => `- **${KIND_LABEL[c.kind]}:** ${c.text}`).join("\n")}`).join("\n\n");
