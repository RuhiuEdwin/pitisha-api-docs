import { API_VERSION } from "./config";

export type ChangeKind = "new" | "changed" | "breaking";
export interface Release { version: string; title: string; changes: { kind: ChangeKind; text: string }[] }

/** Newest first. The newest version here is the current API version. */
export const RELEASES: Release[] = [
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
      { kind: "new", text: "Matching states matched, pile and no_match, and the routing object on collections." },
    ],
  },
];

export const CURRENT_VERSION = RELEASES[0].version;
if (CURRENT_VERSION !== API_VERSION) throw new Error(`config API_VERSION ${API_VERSION} must equal the newest release ${CURRENT_VERSION}`);

export const KIND_LABEL: Record<ChangeKind, string> = { new: "New", changed: "Changed", breaking: "Breaking" };

export const changelogMarkdown = () =>
  RELEASES.map((r) => `## ${r.version}\n\n${r.title}.\n\n${r.changes.map((c) => `- **${KIND_LABEL[c.kind]}:** ${c.text}`).join("\n")}`).join("\n\n");
