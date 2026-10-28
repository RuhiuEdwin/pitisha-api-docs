export interface Field {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  values?: string[];
}

export interface Endpoint {
  id: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  title: string;
  summary: string;
  description?: string;
  pathParams?: Field[];
  query?: Field[];
  body?: Field[];
  bodyExample?: unknown;
  status: number;
  response: unknown;
  list?: boolean;
  errors?: string[];
  sandboxOnly?: boolean;
  headers?: Field[];
}

export interface ApiObject {
  name: string;
  description: string;
  fields: Field[];
  example: unknown;
}

export interface Resource {
  id: string;
  title: string;
  blurb: string;
  object?: ApiObject;
  endpoints: Endpoint[];
}

const created = "2026-10-28T11:20:04+03:00";
const wrap = (item: unknown) => ({ object: "list", data: [item], has_more: true, next_cursor: "cur_9fK2mQ" });

const collection = {
  id: "col_8f3k2q",
  object: "collection",
  status: "succeeded",
  amount: 250000,
  currency: "KES",
  source: "paybill",
  reference: "INV-204117",
  description: "Order 1042",
  customer: { phone: "+254712000000" },
  wallet_id: "wal_main",
  shortcode_id: "sc_4012345",
  match: { state: "matched", sale_id: "sale_1042" },
  routing: { gateway: "daraja", attempts: 2, failed_over: true },
  failure: null,
  metadata: { order_id: "1042" },
  livemode: false,
  created_at: created,
};

const payout = {
  id: "pay_2xk9d7",
  object: "payout",
  status: "sent",
  amount: 1200000,
  currency: "KES",
  destination: { type: "phone", phone: "+254722000000" },
  wallet_id: "wal_payroll",
  reference: "SALARY-OCT-0007",
  reason: "salary",
  fee: 2000,
  failure: null,
  metadata: {},
  livemode: false,
  created_at: created,
};

const settlement = {
  id: "set_5m2c8v",
  object: "settlement",
  status: "landed",
  amount: 48250000,
  currency: "KES",
  wallet_id: "wal_main",
  destination: { type: "bank_account", account_last4: "2291", bank_code: "01" },
  day: "2026-10-27",
  collections: 412,
  receipt_url: "https://portal.example.com/receipts/set_5m2c8v",
  livemode: false,
  created_at: "2026-10-28T06:00:00+03:00",
};

const wallet = {
  id: "wal_main",
  object: "wallet",
  name: "Main collections",
  currency: "KES",
  balance: 128450000,
  pending: 4230000,
  frozen: false,
  shortcode_ids: ["sc_4012345", "sc_5567890"],
  livemode: false,
  created_at: "2026-06-12T09:00:00+03:00",
};

const shortcode = {
  id: "sc_4012345",
  object: "shortcode",
  type: "paybill",
  number: "4012345",
  name: "Main paybill",
  status: "active",
  wallet_id: "wal_main",
  callback_url: "https://api.example.com/pitisha/callback",
  validation: true,
  account_format: "Invoice number, 6 digits",
  livemode: false,
  created_at: "2026-06-12T09:30:00+03:00",
};

const endpoint = {
  id: "we_71c2xk",
  object: "webhook_endpoint",
  url: "https://api.example.com/pitisha/webhooks",
  events: ["collection.recorded", "collection.failed", "payout.sent", "settlement.landed"],
  status: "enabled",
  secret_last4: "71c2",
  livemode: false,
  created_at: "2026-06-12T10:00:00+03:00",
};

const event = {
  id: "evt_6h2p0q",
  object: "event",
  type: "collection.recorded",
  created_at: created,
  livemode: false,
  data: { object: collection },
};

const idem: Field = { name: "Idempotency-Key", type: "string", description: "A unique value per logical request, up to 255 characters. Retrying with the same key returns the original result instead of creating a second one." };
const pageQ: Field[] = [
  { name: "limit", type: "integer", description: "How many items to return, from 1 to 100. Defaults to 20." },
  { name: "starting_after", type: "string", description: "A cursor from a previous response's next_cursor. Returns the next page." },
];

export const RESOURCES: Resource[] = [
  {
    id: "collections",
    title: "Collections",
    blurb: "Take a payment from any source. The customer pays, Pitisha records it and matches it to the sale.",
    object: {
      name: "Collection",
      description: "A payment from a customer into one of your wallets. It starts pending and settles to succeeded or failed. Money goes straight into your own till, so a collection is a record of that payment, not funds held by Pitisha.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier, starting col_." },
        { name: "status", type: "string", values: ["pending", "succeeded", "failed", "reversed"], description: "Where the payment is." },
        { name: "amount", type: "integer", description: "Amount in the smallest unit. 250000 is KES 2,500.00." },
        { name: "currency", type: "string", description: "Always KES." },
        { name: "source", type: "string", values: ["till", "paybill", "qr", "bank", "airtel"], description: "How the customer paid." },
        { name: "reference", type: "string | null", description: "Your reference, for example an invoice or account number." },
        { name: "customer", type: "object", description: "Who paid: a phone number for mobile money, or account details for bank transfers." },
        { name: "wallet_id", type: "string", description: "The wallet the payment landed in." },
        { name: "shortcode_id", type: "string | null", description: "The paybill or till it was paid to." },
        { name: "match", type: "object | null", description: "How the payment matched your sales. match.state is matched, pile or no_match. See Matching." },
        { name: "routing", type: "object", description: "Which gateway took the payment, how many attempts it needed, and whether the smart switch failed over. See Gateways and failover." },
        { name: "failure", type: "object | null", description: "Present when status is failed: a code and a message." },
        { name: "metadata", type: "object", description: "Up to 20 key-value pairs of your own." },
        { name: "livemode", type: "boolean", description: "false in the sandbox." },
        { name: "created_at", type: "string", description: "ISO 8601 timestamp." },
      ],
      example: collection,
    },
    endpoints: [
      {
        id: "create-collection", method: "POST", path: "/v1/collections", title: "Create a collection", summary: "Ask a customer to pay and record the result.",
        description: "For till, paybill and QR sources this sends a payment request to the customer's phone. Pitisha routes it through a healthy gateway and, if that gateway fails, moves it to the next one without you retrying. The response is pending until the customer approves; you learn the outcome from the collection.recorded or collection.failed webhook.",
        headers: [idem, { name: "Pitisha-Sandbox-Scenario", type: "string", description: "Sandbox only. Force an outcome: success, insufficient_funds, customer_cancelled or no_response." }],
        body: [
          { name: "amount", type: "integer", required: true, description: "Amount in the smallest unit." },
          { name: "currency", type: "string", required: true, description: "Always KES.", values: ["KES"] },
          { name: "source", type: "string", required: true, description: "How the customer pays.", values: ["till", "paybill", "qr", "bank", "airtel"] },
          { name: "customer", type: "object", required: true, description: "For mobile money, { phone } in international format." },
          { name: "shortcode_id", type: "string", description: "Which shortcode to collect on. Defaults to your primary one for the source." },
          { name: "reference", type: "string", description: "Your reference. Shown to the customer on a paybill." },
          { name: "description", type: "string", description: "Shown in your portal." },
          { name: "metadata", type: "object", description: "Your own key-value pairs." },
        ],
        bodyExample: { amount: 250000, currency: "KES", source: "paybill", customer: { phone: "+254712000000" }, reference: "INV-204117", description: "Order 1042", metadata: { order_id: "1042" } },
        status: 201, response: { ...collection, status: "pending", match: null, routing: { gateway: "daraja", attempts: 1, failed_over: false } },
        errors: ["invalid_request", "authentication_failed", "shortcode_inactive", "wallet_frozen", "idempotency_conflict", "rate_limited"],
      },
      { id: "retrieve-collection", method: "GET", path: "/v1/collections/{id}", title: "Retrieve a collection", summary: "Fetch one collection by id.", pathParams: [{ name: "id", type: "string", required: true, description: "The collection id." }], status: 200, response: collection, errors: ["not_found", "authentication_failed"] },
      {
        id: "list-collections", method: "GET", path: "/v1/collections", title: "List collections", summary: "Newest first, with filters.", list: true,
        query: [
          { name: "status", type: "string", description: "Filter by status.", values: ["pending", "succeeded", "failed", "reversed"] },
          { name: "source", type: "string", description: "Filter by source.", values: ["till", "paybill", "qr", "bank", "airtel"] },
          { name: "match_state", type: "string", description: "Filter by how it matched.", values: ["matched", "pile", "no_match"] },
          { name: "wallet_id", type: "string", description: "Only payments into this wallet." },
          { name: "created_gte", type: "string", description: "ISO 8601. Created on or after." },
          { name: "created_lte", type: "string", description: "ISO 8601. Created on or before." },
          ...pageQ,
        ],
        status: 200, response: wrap(collection), errors: ["authentication_failed", "invalid_request"],
      },
      {
        id: "resolve-match", method: "POST", path: "/v1/collections/{id}/match", title: "Resolve a payment in the pile", summary: "Choose which sale a pile payment belongs to.",
        description: "A collection lands in the pile when more than one sale could fit it. Send the sale it belongs to and it becomes matched. A collection with no match can be matched the same way once you find the sale.",
        pathParams: [{ name: "id", type: "string", required: true, description: "The collection id." }],
        headers: [idem], body: [{ name: "sale_id", type: "string", required: true, description: "The sale this payment paid for." }], bodyExample: { sale_id: "sale_1042" },
        status: 200, response: collection, errors: ["not_found", "invalid_request", "idempotency_conflict"],
      },
    ],
  },
  {
    id: "payouts",
    title: "Payouts",
    blurb: "Send money to a phone or a bank account from a wallet.",
    object: {
      name: "Payout",
      description: "Money sent out from one of your wallets. Payouts cannot be recalled once they are sent.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier, starting pay_." },
        { name: "status", type: "string", values: ["pending", "sent", "failed", "canceled"], description: "Where the payout is." },
        { name: "amount", type: "integer", description: "Amount in the smallest unit." },
        { name: "currency", type: "string", description: "Always KES." },
        { name: "destination", type: "object", description: "A phone number or a bank account." },
        { name: "wallet_id", type: "string", description: "The wallet the money came from." },
        { name: "reference", type: "string | null", description: "Your reference." },
        { name: "fee", type: "integer", description: "The fee charged for this payout, in the smallest unit." },
        { name: "failure", type: "object | null", description: "A code and message when status is failed." },
        { name: "livemode", type: "boolean", description: "false in the sandbox." },
        { name: "created_at", type: "string", description: "ISO 8601 timestamp." },
      ],
      example: payout,
    },
    endpoints: [
      {
        id: "create-payout", method: "POST", path: "/v1/payouts", title: "Create a payout", summary: "Send money from a wallet.",
        description: "The wallet must hold enough balance for the amount plus the fee. Use an Idempotency-Key so a retry after a network error cannot pay twice.",
        headers: [idem],
        body: [
          { name: "amount", type: "integer", required: true, description: "Amount in the smallest unit." },
          { name: "currency", type: "string", required: true, description: "Always KES.", values: ["KES"] },
          { name: "wallet_id", type: "string", required: true, description: "The wallet to pay from." },
          { name: "destination", type: "object", required: true, description: "{ type: \"phone\", phone } or { type: \"bank_account\", account_number, bank_code }." },
          { name: "reference", type: "string", description: "Your reference." },
          { name: "reason", type: "string", description: "For example salary, refund or supplier." },
        ],
        bodyExample: { amount: 1200000, currency: "KES", wallet_id: "wal_payroll", destination: { type: "phone", phone: "+254722000000" }, reference: "SALARY-OCT-0007", reason: "salary" },
        status: 201, response: { ...payout, status: "pending" }, errors: ["invalid_request", "insufficient_funds", "wallet_frozen", "idempotency_conflict", "authentication_failed"],
      },
      { id: "retrieve-payout", method: "GET", path: "/v1/payouts/{id}", title: "Retrieve a payout", summary: "Fetch one payout by id.", pathParams: [{ name: "id", type: "string", required: true, description: "The payout id." }], status: 200, response: payout, errors: ["not_found"] },
      { id: "list-payouts", method: "GET", path: "/v1/payouts", title: "List payouts", summary: "Newest first.", list: true, query: [{ name: "status", type: "string", description: "Filter by status.", values: ["pending", "sent", "failed", "canceled"] }, { name: "wallet_id", type: "string", description: "Only payouts from this wallet." }, ...pageQ], status: 200, response: wrap(payout), errors: ["authentication_failed"] },
      { id: "cancel-payout", method: "POST", path: "/v1/payouts/{id}/cancel", title: "Cancel a payout", summary: "Stop a payout that has not been sent.", description: "Only a payout that is still pending can be canceled. Once it is sent it cannot be recalled.", pathParams: [{ name: "id", type: "string", required: true, description: "The payout id." }], status: 200, response: { ...payout, status: "canceled" }, errors: ["not_found", "invalid_request"] },
    ],
  },
  {
    id: "settlements",
    title: "Settlements",
    blurb: "Where your day's money landed, and one record you can export.",
    object: {
      name: "Settlement",
      description: "A record that money landed in your own till or account. Pitisha reads settlements from each source and closes the day on one record.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier, starting set_." },
        { name: "status", type: "string", values: ["pending", "landed"], description: "Whether the money has landed." },
        { name: "amount", type: "integer", description: "Amount in the smallest unit." },
        { name: "wallet_id", type: "string", description: "The wallet this settlement belongs to." },
        { name: "destination", type: "object", description: "Where it landed." },
        { name: "day", type: "string", description: "The trading day, YYYY-MM-DD." },
        { name: "collections", type: "integer", description: "How many collections it covers." },
        { name: "receipt_url", type: "string", description: "A link to the receipt in your portal." },
        { name: "created_at", type: "string", description: "ISO 8601 timestamp." },
      ],
      example: settlement,
    },
    endpoints: [
      { id: "list-settlements", method: "GET", path: "/v1/settlements", title: "List settlements", summary: "Newest first.", list: true, query: [{ name: "wallet_id", type: "string", description: "Only this wallet." }, { name: "day", type: "string", description: "A trading day, YYYY-MM-DD." }, ...pageQ], status: 200, response: wrap(settlement), errors: ["authentication_failed"] },
      { id: "retrieve-settlement", method: "GET", path: "/v1/settlements/{id}", title: "Retrieve a settlement", summary: "Fetch one settlement.", pathParams: [{ name: "id", type: "string", required: true, description: "The settlement id." }], status: 200, response: settlement, errors: ["not_found"] },
      {
        id: "retrieve-day-close", method: "GET", path: "/v1/day-closes/{day}", title: "Retrieve a day close", summary: "One record for a whole trading day.",
        description: "Totals for the day, how many payments matched, how many are in the pile and how many have no match, and a link to export the record as CSV for your accountant.",
        pathParams: [{ name: "day", type: "string", required: true, description: "The trading day, YYYY-MM-DD." }],
        status: 200, response: { object: "day_close", day: "2026-10-27", collected: 48250000, paid_out: 12000000, fees: 579000, matched: 398, pile: 9, no_match: 5, export_url: "https://portal.example.com/exports/2026-10-27.csv", livemode: false }, errors: ["not_found"],
      },
    ],
  },
  {
    id: "wallets",
    title: "Wallets",
    blurb: "Where your money sits. Assign shortcodes to a wallet and payments to them land there.",
    object: {
      name: "Wallet",
      description: "A balance in KES that collections land in and payouts leave from. You can have as many as you need, for example one per shop or a separate payroll float.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier, starting wal_." },
        { name: "name", type: "string", description: "A name you choose." },
        { name: "balance", type: "integer", description: "Available balance in the smallest unit." },
        { name: "pending", type: "integer", description: "Pending in, not yet available." },
        { name: "frozen", type: "boolean", description: "A frozen wallet takes no payments and sends no payouts." },
        { name: "shortcode_ids", type: "string[]", description: "Shortcodes assigned to this wallet." },
        { name: "created_at", type: "string", description: "ISO 8601 timestamp." },
      ],
      example: wallet,
    },
    endpoints: [
      { id: "create-wallet", method: "POST", path: "/v1/wallets", title: "Create a wallet", summary: "Add a wallet.", headers: [idem], body: [{ name: "name", type: "string", required: true, description: "A name you choose." }, { name: "currency", type: "string", description: "Always KES.", values: ["KES"] }], bodyExample: { name: "Online shop", currency: "KES" }, status: 201, response: { ...wallet, name: "Online shop", balance: 0, pending: 0, shortcode_ids: [] }, errors: ["invalid_request", "permission_denied"] },
      { id: "list-wallets", method: "GET", path: "/v1/wallets", title: "List wallets", summary: "All wallets in this mode.", list: true, query: pageQ, status: 200, response: wrap(wallet), errors: ["authentication_failed"] },
      { id: "retrieve-wallet", method: "GET", path: "/v1/wallets/{id}", title: "Retrieve a wallet", summary: "Fetch one wallet and its balance.", pathParams: [{ name: "id", type: "string", required: true, description: "The wallet id." }], status: 200, response: wallet, errors: ["not_found"] },
      { id: "update-wallet", method: "PATCH", path: "/v1/wallets/{id}", title: "Update a wallet", summary: "Rename or freeze a wallet.", pathParams: [{ name: "id", type: "string", required: true, description: "The wallet id." }], body: [{ name: "name", type: "string", description: "A new name." }, { name: "frozen", type: "boolean", description: "Freeze or unfreeze." }], bodyExample: { frozen: true }, status: 200, response: { ...wallet, frozen: true }, errors: ["not_found", "permission_denied"] },
    ],
  },
  {
    id: "shortcodes",
    title: "Shortcodes",
    blurb: "Your paybills and tills. View them, configure them and assign them to wallets.",
    object: {
      name: "Shortcode",
      description: "A paybill or till number. Each one settles to the wallet you assign. A paybill can validate account numbers before the customer is charged.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier, starting sc_." },
        { name: "type", type: "string", values: ["paybill", "till"], description: "Paybill or till." },
        { name: "number", type: "string", description: "The number customers pay." },
        { name: "name", type: "string", description: "A name you choose." },
        { name: "status", type: "string", values: ["active", "pending", "suspended"], description: "Whether it takes payments." },
        { name: "wallet_id", type: "string | null", description: "The wallet payments to this shortcode land in." },
        { name: "callback_url", type: "string", description: "Where Pitisha sends each payment as a signed webhook." },
        { name: "validation", type: "boolean", description: "Paybills only. Reject payments whose account number does not fit account_format." },
        { name: "account_format", type: "string", description: "The account number rule." },
      ],
      example: shortcode,
    },
    endpoints: [
      { id: "list-shortcodes", method: "GET", path: "/v1/shortcodes", title: "List shortcodes", summary: "All shortcodes in this mode.", list: true, query: [{ name: "wallet_id", type: "string", description: "Only shortcodes on this wallet." }, ...pageQ], status: 200, response: wrap(shortcode), errors: ["authentication_failed"] },
      { id: "retrieve-shortcode", method: "GET", path: "/v1/shortcodes/{id}", title: "Retrieve a shortcode", summary: "Fetch one shortcode.", pathParams: [{ name: "id", type: "string", required: true, description: "The shortcode id." }], status: 200, response: shortcode, errors: ["not_found"] },
      { id: "update-shortcode", method: "PATCH", path: "/v1/shortcodes/{id}", title: "Configure a shortcode", summary: "Assign it to a wallet and set how it validates.", description: "Setting wallet_id is how you assign a shortcode to a wallet. From then on, every payment to it lands there.", pathParams: [{ name: "id", type: "string", required: true, description: "The shortcode id." }], body: [{ name: "wallet_id", type: "string | null", description: "The wallet to settle to, or null to unassign." }, { name: "name", type: "string", description: "A new name." }, { name: "callback_url", type: "string", description: "A new callback URL." }, { name: "validation", type: "boolean", description: "Paybills only." }, { name: "account_format", type: "string", description: "The account number rule." }], bodyExample: { wallet_id: "wal_shop", validation: true }, status: 200, response: { ...shortcode, wallet_id: "wal_shop" }, errors: ["not_found", "invalid_request", "permission_denied"] },
    ],
  },
  {
    id: "webhooks",
    title: "Webhook endpoints",
    blurb: "Tell Pitisha where to send events, and look back at what was sent.",
    object: {
      name: "Webhook endpoint",
      description: "An HTTPS URL on your server that receives signed events. See the Webhooks guide for the signature scheme.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier, starting we_." },
        { name: "url", type: "string", description: "Your HTTPS endpoint." },
        { name: "events", type: "string[]", description: "Which event types to send." },
        { name: "status", type: "string", values: ["enabled", "disabled"], description: "Whether events are being sent." },
        { name: "secret_last4", type: "string", description: "The last four characters of the signing secret. The full secret is shown once when you create the endpoint." },
      ],
      example: endpoint,
    },
    endpoints: [
      { id: "create-webhook-endpoint", method: "POST", path: "/v1/webhook_endpoints", title: "Create a webhook endpoint", summary: "Start receiving events.", description: "The response includes a secret field with the full signing secret. It is shown once. Store it on your server.", body: [{ name: "url", type: "string", required: true, description: "An HTTPS URL." }, { name: "events", type: "string[]", description: "Event types to send. Defaults to all." }], bodyExample: { url: "https://api.example.com/pitisha/webhooks", events: ["collection.recorded", "collection.failed"] }, status: 201, response: { ...endpoint, secret: "whsec_REPLACE_WITH_REAL_SECRET" }, errors: ["invalid_request", "permission_denied"] },
      { id: "list-webhook-endpoints", method: "GET", path: "/v1/webhook_endpoints", title: "List webhook endpoints", summary: "All endpoints in this mode.", list: true, query: pageQ, status: 200, response: wrap(endpoint), errors: ["authentication_failed"] },
      { id: "delete-webhook-endpoint", method: "DELETE", path: "/v1/webhook_endpoints/{id}", title: "Delete a webhook endpoint", summary: "Stop sending to it.", pathParams: [{ name: "id", type: "string", required: true, description: "The endpoint id." }], status: 200, response: { id: "we_71c2xk", object: "webhook_endpoint", deleted: true }, errors: ["not_found"] },
      { id: "list-events", method: "GET", path: "/v1/events", title: "List events", summary: "Everything Pitisha has sent you.", list: true, query: [{ name: "type", type: "string", description: "Filter by event type." }, ...pageQ], status: 200, response: wrap(event), errors: ["authentication_failed"] },
      { id: "redeliver-event", method: "POST", path: "/v1/events/{id}/redeliver", title: "Redeliver an event", summary: "Send an event to your endpoint again.", description: "Useful after you fix an outage on your side. The same event id is sent, so make your handler idempotent.", pathParams: [{ name: "id", type: "string", required: true, description: "The event id." }], status: 200, response: event, errors: ["not_found"] },
    ],
  },
  {
    id: "sandbox",
    title: "Sandbox tools",
    blurb: "Simulate customers paying so you can test your integration end to end. Sandbox keys only.",
    endpoints: [
      {
        id: "simulate-payment", method: "POST", path: "/v1/sandbox/shortcodes/{id}/simulate_payment", title: "Simulate a customer paying", summary: "Pay one of your sandbox shortcodes as a customer.", sandboxOnly: true,
        description: "Creates a collection as if a customer had paid your sandbox paybill or till, then sends the webhooks. Use scenario to test failures.",
        pathParams: [{ name: "id", type: "string", required: true, description: "A sandbox shortcode id." }],
        body: [{ name: "amount", type: "integer", required: true, description: "Amount in the smallest unit." }, { name: "reference", type: "string", description: "The account number the customer types on a paybill." }, { name: "scenario", type: "string", description: "The outcome to simulate.", values: ["success", "insufficient_funds", "customer_cancelled", "no_response"] }],
        bodyExample: { amount: 150000, reference: "INV-204117", scenario: "success" }, status: 201, response: collection, errors: ["not_found", "invalid_request", "permission_denied"],
      },
    ],
  },
];

export const ERRORS: { code: string; status: number; meaning: string; fix: string }[] = [
  { code: "invalid_request", status: 400, meaning: "A parameter is missing or the wrong shape.", fix: "Read error.param and fix that field." },
  { code: "authentication_failed", status: 401, meaning: "The API key is missing, wrong or revoked.", fix: "Check you send Authorization: Bearer and use the key for the right mode." },
  { code: "permission_denied", status: 403, meaning: "Your key or role cannot do this.", fix: "Use a key with the access you need, or ask an owner." },
  { code: "not_found", status: 404, meaning: "The object does not exist in this mode.", fix: "Check the id, and that you are not mixing sandbox and live ids." },
  { code: "idempotency_conflict", status: 409, meaning: "The Idempotency-Key was used with different parameters.", fix: "Use a new key for a different request." },
  { code: "insufficient_funds", status: 422, meaning: "The wallet cannot cover the amount plus the fee.", fix: "Top up the wallet or lower the amount." },
  { code: "wallet_frozen", status: 422, meaning: "The wallet is frozen.", fix: "Unfreeze it in the portal or with PATCH /v1/wallets/{id}." },
  { code: "shortcode_inactive", status: 422, meaning: "The shortcode is pending or suspended.", fix: "Wait for it to become active, or use another shortcode." },
  { code: "rate_limited", status: 429, meaning: "Too many requests.", fix: "Wait for the number of seconds in the Retry-After header." },
  { code: "api_error", status: 500, meaning: "Something went wrong on our side.", fix: "Retry with the same Idempotency-Key. If it persists, contact support with the request id." },
];

export const EVENTS: { type: string; when: string }[] = [
  { type: "collection.recorded", when: "A collection succeeded and was recorded. data.object.match tells you how it matched." },
  { type: "collection.failed", when: "A collection failed. data.object.failure has the reason." },
  { type: "collection.matched", when: "A payment in the pile or with no match was matched to a sale." },
  { type: "payout.sent", when: "A payout was sent." },
  { type: "payout.failed", when: "A payout failed." },
  { type: "settlement.landed", when: "A settlement landed in your till or account." },
  { type: "day.closed", when: "A trading day was closed and its record is ready to export." },
];

export const allEndpoints = () => RESOURCES.flatMap((r) => r.endpoints.map((e) => ({ resource: r, endpoint: e })));
