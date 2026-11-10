import { API_VERSION } from "./config";

export type ChangeKind = "new" | "changed" | "breaking";
export interface Release { version: string; title: string; changes: { kind: ChangeKind; text: string }[] }

/** Newest first. The newest version here is the current API version. */
export const RELEASES: Release[] = [
  {
    version: "2026-11-10.1",
    title: "Idempotency-Key required, clearer validation, and the docs matched to the live API",
    changes: [
      { kind: "breaking", text: "An API key must send an Idempotency-Key header on POST /v1/payment_requests, /v1/payouts, /v1/wallets, /v1/payment_links, /v1/transfers and /v1/collections/{id}/refund. Without it the request is refused with 400 invalid_request and nothing is created. A replay carries Idempotent-Replayed: true." },
      { kind: "changed", text: "A wrong password when you confirm a sensitive change (PIN, two-step, password) returns 403 password_incorrect, not 401, so the signed-in session stays valid." },
      { kind: "changed", text: "Validation messages read \"field: Required.\", \"Must be a whole number.\" and \"Use at most N characters.\". Names (wallets, apps, shortcodes) are trimmed, and a name that is empty after trimming is refused." },
      { kind: "changed", text: "Payout amounts for M-Pesa to a phone are KES 10 to 150,000, in whole shillings. Paybill, till and bank payouts are KES 10 to 250,000." },
      { kind: "changed", text: "A payout that went through has status succeeded, not sent. The event is still payout.sent. A pending payout has not failed." },
      { kind: "changed", text: "Collections are created with POST /v1/payment_requests. The docs showed POST /v1/collections, which does not exist. The id of a payment request is the id of its collection." },
      { kind: "changed", text: "A failed delivery is retried six times, after 1 minute, 5 minutes, 30 minutes, 2 hours, 6 hours and 24 hours, then stops. Webhook headers are Tefo-Signature, Tefo-Event and Tefo-Delivery." },
      { kind: "changed", text: "The sandbox decides by the customer's phone number (ending 0001 fails, 0002 stays pending) and simulate_payment takes success, insufficient, cancelled or timeout. There is no Tefo-Sandbox-Scenario header. Failure codes are M-Pesa result codes such as 1 and 1032." },
      { kind: "changed", text: "Cancelling a payout works only while it waits for approval. Creating a webhook endpoint in live needs a signed-in person and a second person's approval; an API key gets 403." },
      { kind: "new", text: "POST /v1/shortcodes (request a paybill or till) and POST /v1/sandbox/reset in the reference. New fields: wallet number, locked and last_activity_at; shortcode connection; payment link hits; statement totals and the refund kind." },
      { kind: "new", text: "Error codes idempotency_in_progress, pin_incorrect, password_incorrect and product_not_offered in the error table." },
      { kind: "breaking", text: "Removed from the reference because the API has no such routes: settlements, day closes, bulk payout batches (a portal feature that needs a signed-in person), the settlement.landed and day.closed events, and the pk_ publishable key." },
    ],
  },
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
