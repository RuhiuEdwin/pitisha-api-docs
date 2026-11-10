export interface Field {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  values?: string[];
  /** An integer amount of money in cents (set automatically for money-named integer fields). */
  money?: boolean;
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
  fee: 2500,
  source: "paybill",
  rail: "mpesa",
  reference: "INV-204117",
  description: "Order 1042",
  customer: { phone: "+254712000000" },
  wallet_id: "wal_main",
  shortcode_id: "sc_4012345",
  routing: { gateway: "daraja", attempts: 2, failed_over: true },
  receipt: "SJK4H2L9QX",
  failure: null,
  metadata: { order_id: "1042" },
  result_url: null,
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
  approval: null,
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
  destination: { type: "shortcode", shortcode_id: "sc_2291" },
  day: "2026-10-27",
  collections: 412,
  receipt_url: "https://portal.example.com/receipts/set_5m2c8v",
  livemode: false,
  created_at: "2026-10-28T06:00:00+03:00",
};

const transfer = {
  id: "trf_3h9v2k",
  object: "transfer",
  status: "succeeded",
  direction: "out",
  amount: 500000,
  fee: 0,
  currency: "KES",
  reference: "INV-77",
  wallet_id: "wal_main",
  approval: null,
  counterparty: { business_name: "Mama Njeri Groceries", wallet_number_masked: "******78" },
  livemode: false,
  created_at: created,
  completed_at: created,
};

const wallet = {
  id: "wal_main",
  object: "wallet",
  name: "Main collections",
  currency: "KES",
  balance: 128450000,
  pending: 4230000,
  held: 0,
  status: "active",
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
  callback_url: "https://api.example.com/tefo/callback",
  validation: true,
  account_format: "Invoice number, 6 digits",
  livemode: false,
  created_at: "2026-06-12T09:30:00+03:00",
};

const endpoint = {
  id: "we_71c2xk",
  object: "webhook_endpoint",
  url: "https://api.example.com/tefo/webhooks",
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

export const RAILS = ["mpesa", "airtel_money", "card", "pesalink"];
const RAIL_FIELD: Field = { name: "rail", type: "string", values: RAILS, description: "Which payment rail to use. Defaults to mpesa. airtel_money, card and pesalink are not yet verified with their providers and work only for businesses where Tefo enabled them: check GET /v1/rails. Otherwise the call fails with rail_not_enabled." };
const RAIL_FIELD_PAYOUT: Field = { name: "rail", type: "string", values: ["mpesa", "airtel_money", "pesalink"], description: "Which payment rail to send over. Defaults to mpesa. The others are not yet verified with their providers and work only for businesses where Tefo enabled them." };
const RETURN_URL: Field = { name: "return_url", type: "string", description: "Card only. An https URL the payer is sent back to after the hosted checkout." };
const CANCEL_URL: Field = { name: "cancel_url", type: "string", description: "Card only. An https URL the payer is sent to if they leave the hosted checkout." };
const RESULT_URL: Field = { name: "result_url", type: "string", description: "A result URL stored on the collection. If you leave it out, your app's default callback URL is used. In live it must be https and not a private address. Results reach you as webhooks either way." };
const idem: Field = { name: "Idempotency-Key", type: "string", description: "A unique value per logical request, up to 255 characters. Retrying with the same key returns the original result instead of creating a second one." };
const pageQ: Field[] = [
  { name: "limit", type: "integer", description: "How many items to return, from 1 to 100. Defaults to 20." },
  { name: "starting_after", type: "string", description: "A cursor from a previous response's next_cursor. Returns the next page." },
];

export const RESOURCES: Resource[] = [
  {
    id: "collections",
    title: "Collections",
    blurb: "Take a payment. The customer pays over M-Pesa (or Airtel Money, card or PesaLink where enabled) and a collection records the result: pending, succeeded or failed.",
    object: {
      name: "Collection",
      description: "A payment from a customer into one of your wallets. It starts pending and ends as succeeded or failed. Money goes straight into your own till, so a collection is a record of that payment, not funds held by Tefo.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier, starting col_." },
        { name: "status", type: "string", values: ["pending", "succeeded", "failed", "reversed"], description: "Where the payment is." },
        { name: "amount", type: "integer", description: "Amount in the smallest unit. 250000 is KES 2,500.00." },
        { name: "currency", type: "string", description: "Always KES." },
        { name: "fee", type: "integer", description: "The fee charged for this collection, in the smallest unit." },
        { name: "source", type: "string", values: ["paybill", "till", "stk"], description: "How the customer paid, over M-Pesa." },
        { name: "rail", type: "string", values: RAILS, description: "Which payment rail took the payment. mpesa unless you asked for another. See Payment rails." },
        { name: "reference", type: "string | null", description: "Your reference, for example an invoice or account number." },
        { name: "customer", type: "object", description: "Who paid: the M-Pesa phone number that paid." },
        { name: "wallet_id", type: "string", description: "The wallet the payment landed in." },
        { name: "shortcode_id", type: "string | null", description: "The paybill or till it was paid to." },
        { name: "routing", type: "object", description: "Which gateway took the payment, how many attempts it needed, and whether the smart switch failed over. See Gateways and failover." },
        { name: "receipt", type: "string | null", description: "The provider's receipt for the payment, for example the M-Pesa receipt, once there is one." },
        { name: "failure", type: "object | null", description: "Present when status is failed: a code and a message." },
        { name: "metadata", type: "object", description: "Up to 20 key-value pairs of your own." },
        { name: "result_url", type: "string | null", description: "The result URL stored for this collection: the one you sent, or your app's default callback URL, or null. See App security." },
        { name: "livemode", type: "boolean", description: "false in the sandbox." },
        { name: "created_at", type: "string", description: "ISO 8601 timestamp." },
      ],
      example: collection,
    },
    endpoints: [
      {
        id: "create-collection", method: "POST", path: "/v1/collections", title: "Create a collection", summary: "Ask a customer to pay and record the result.",
        description: "By default this is an M-Pesa payment: the customer is asked to pay and Tefo records the result. Send rail to use another rail (see Payment rails); every rail other than mpesa is not yet verified with its provider and is available only to businesses where Tefo has enabled it. Tefo routes it through a healthy gateway and, if that gateway fails, moves it to the next one without you retrying. The response is pending until the customer approves; you learn the outcome from the collection.recorded or collection.failed webhook.",
        headers: [idem, { name: "Tefo-Sandbox-Scenario", type: "string", description: "Sandbox only. Force an outcome: success, insufficient_funds, customer_cancelled or no_response." }],
        body: [
          { name: "amount", type: "integer", required: true, description: "Amount in the smallest unit." },
          { name: "currency", type: "string", required: true, description: "Always KES.", values: ["KES"] },
          { name: "source", type: "string", required: true, description: "How the customer pays over M-Pesa.", values: ["paybill", "till", "stk"] },
          RAIL_FIELD,
          { name: "customer", type: "object", required: true, description: "For M-Pesa and Airtel Money, { phone } in international format. For card, { email } is needed too." },
          RETURN_URL, CANCEL_URL, RESULT_URL,
          { name: "shortcode_id", type: "string", description: "Which shortcode to collect on. Defaults to your primary one for the source." },
          { name: "reference", type: "string", description: "Your reference. Shown to the customer on a paybill." },
          { name: "description", type: "string", description: "Shown in your portal." },
          { name: "metadata", type: "object", description: "Your own key-value pairs." },
        ],
        bodyExample: { amount: 250000, currency: "KES", source: "paybill", customer: { phone: "+254712000000" }, reference: "INV-204117", description: "Order 1042", metadata: { order_id: "1042" } },
        status: 201, response: { ...collection, status: "pending", receipt: null, routing: { gateway: "daraja", attempts: 1, failed_over: false } },
        errors: ["invalid_request", "authentication_failed", "shortcode_inactive", "wallet_frozen", "idempotency_conflict", "rate_limited"],
      },
      { id: "retrieve-collection", method: "GET", path: "/v1/collections/{id}", title: "Retrieve a collection", summary: "Fetch one collection by id.", pathParams: [{ name: "id", type: "string", required: true, description: "The collection id." }], status: 200, response: collection, errors: ["not_found", "authentication_failed"] },
      {
        id: "list-collections", method: "GET", path: "/v1/collections", title: "List collections", summary: "Newest first, with filters.", list: true,
        query: [
          { name: "status", type: "string", description: "Filter by status.", values: ["pending", "succeeded", "failed", "reversed"] },
          { name: "source", type: "string", description: "Filter by source.", values: ["paybill", "till", "stk"] },
          { name: "rail", type: "string", description: "Filter by payment rail.", values: RAILS },
          { name: "wallet_id", type: "string", description: "Only payments into this wallet." },
          { name: "created_gte", type: "string", description: "ISO 8601. Created on or after." },
          { name: "created_lte", type: "string", description: "ISO 8601. Created on or before." },
          ...pageQ,
        ],
        status: 200, response: wrap(collection), errors: ["authentication_failed", "invalid_request"],
      },
    ],
  },
  {
    id: "payouts",
    title: "Payouts",
    blurb: "Send money from a wallet to an M-Pesa phone number, and on other rails where enabled.",
    object: {
      name: "Payout",
      description: "Money sent out from one of your wallets. Payouts cannot be recalled once they are sent.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier, starting pay_." },
        { name: "status", type: "string", values: ["pending_approval", "pending", "sent", "failed", "canceled", "rejected"], description: "Where the payout is. pending_approval means a second person must approve it first; the money is held meanwhile." },
        { name: "amount", type: "integer", description: "Amount in the smallest unit." },
        { name: "currency", type: "string", description: "Always KES." },
        { name: "rail", type: "string", values: ["mpesa", "airtel_money", "pesalink"], description: "Which rail sent it. mpesa unless you asked for another." },
        { name: "destination", type: "object", description: "Where it went: { type: \"phone\", phone } for M-Pesa and Airtel Money, or { type: \"bank_account\", bank_code, account_number } for PesaLink." },
        { name: "wallet_id", type: "string", description: "The wallet the money came from." },
        { name: "reference", type: "string | null", description: "Your reference." },
        { name: "fee", type: "integer", description: "The fee charged for this payout, in the smallest unit." },
        { name: "approval", type: "object | null", description: "Present when the payout needed approval: { required, requested_by, decided_by, decided_at }." },
        { name: "failure", type: "object | null", description: "A code and message when status is failed." },
        { name: "livemode", type: "boolean", description: "false in the sandbox." },
        { name: "created_at", type: "string", description: "ISO 8601 timestamp." },
      ],
      example: payout,
    },
    endpoints: [
      {
        id: "create-payout", method: "POST", path: "/v1/payouts", title: "Create a payout", summary: "Send money from a wallet.",
        description: "Send rail to pay out over another rail: airtel_money with a phone destination, or pesalink with a bank_account destination (check the account first with POST /v1/rails/pesalink/validate_account). Those rails are not yet verified with their providers and work only for businesses where Tefo enabled them. The wallet must hold enough balance for the amount plus the fee. That money is held from the moment you create the payout. If the amount is above your approval threshold the payout starts as pending_approval and is only sent once a different person approves it in the portal (see the Approvals guide). Use an Idempotency-Key so a retry after a network error cannot pay twice.",
        headers: [idem],
        body: [
          { name: "amount", type: "integer", required: true, description: "Amount in the smallest unit. Payouts must be whole shillings, so a multiple of 100." },
          { name: "currency", type: "string", required: true, description: "Always KES.", values: ["KES"] },
          { name: "wallet_id", type: "string", required: true, description: "The wallet to pay from." },
          RAIL_FIELD_PAYOUT,
          { name: "destination", type: "object", required: true, description: "{ type: \"phone\", phone } for M-Pesa and Airtel Money. { type: \"bank_account\", bank_code, account_number } for PesaLink." },
          { name: "reference", type: "string", description: "Your reference." },
          { name: "reason", type: "string", description: "For example salary, refund or supplier." },
        ],
        bodyExample: { amount: 1200000, currency: "KES", wallet_id: "wal_payroll", destination: { type: "phone", phone: "+254722000000" }, reference: "SALARY-OCT-0007", reason: "salary" },
        status: 201, response: { ...payout, status: "pending" }, errors: ["invalid_request", "insufficient_funds", "wallet_frozen", "verification_required", "rail_not_enabled", "service_stopped", "idempotency_conflict", "authentication_failed"],
      },
      { id: "retrieve-payout", method: "GET", path: "/v1/payouts/{id}", title: "Retrieve a payout", summary: "Fetch one payout by id.", pathParams: [{ name: "id", type: "string", required: true, description: "The payout id." }], status: 200, response: payout, errors: ["not_found"] },
      { id: "list-payouts", method: "GET", path: "/v1/payouts", title: "List payouts", summary: "Newest first.", list: true, query: [{ name: "status", type: "string", description: "Filter by status.", values: ["pending_approval", "pending", "sent", "failed", "canceled", "rejected"] }, { name: "wallet_id", type: "string", description: "Only payouts from this wallet." }, ...pageQ], status: 200, response: wrap(payout), errors: ["authentication_failed"] },
      { id: "cancel-payout", method: "POST", path: "/v1/payouts/{id}/cancel", title: "Cancel a payout", summary: "Stop a payout that has not been sent.", description: "Only a payout that is still pending or waiting for approval can be canceled. Held money returns to the wallet. Once it is sent it cannot be recalled.", pathParams: [{ name: "id", type: "string", required: true, description: "The payout id." }], status: 200, response: { ...payout, status: "canceled" }, errors: ["not_found", "invalid_request"] },
    ],
  },
  {
    id: "settlements",
    title: "Settlements",
    blurb: "Where your day's money landed, and one record you can export.",
    object: {
      name: "Settlement",
      description: "A record that money landed in your own till or account. Tefo reads settlements from each source and closes the day on one record.",
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
        description: "Totals for the day (collected, paid out, fees) and a link to export the record as CSV for your accountant.",
        pathParams: [{ name: "day", type: "string", required: true, description: "The trading day, YYYY-MM-DD." }],
        status: 200, response: { object: "day_close", day: "2026-10-27", collected: 48250000, paid_out: 12000000, fees: 579000, export_url: "https://portal.example.com/exports/2026-10-27.csv", livemode: false }, errors: ["not_found"],
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
        { name: "held", type: "integer", description: "Reserved for payouts that are waiting for approval or still being sent. Not available to spend." },
        { name: "status", type: "string", values: ["active", "suspended", "locked", "dormant"], description: "Locked and suspended wallets cannot send payouts. Dormant wallets have had no activity for 90 days." },
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
        { name: "callback_url", type: "string", description: "Where Tefo sends each payment as a signed webhook." },
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
    blurb: "Tell Tefo where to send events, and look back at what was sent.",
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
      { id: "create-webhook-endpoint", method: "POST", path: "/v1/webhook_endpoints", title: "Create a webhook endpoint", summary: "Start receiving events.", description: "The response includes a secret field with the full signing secret. It is shown once. Store it on your server.", body: [{ name: "url", type: "string", required: true, description: "An HTTPS URL." }, { name: "events", type: "string[]", description: "Event types to send. Defaults to all." }], bodyExample: { url: "https://api.example.com/tefo/webhooks", events: ["collection.recorded", "collection.failed"] }, status: 201, response: { ...endpoint, secret: "whsec_REPLACE_WITH_REAL_SECRET" }, errors: ["invalid_request", "permission_denied"] },
      { id: "list-webhook-endpoints", method: "GET", path: "/v1/webhook_endpoints", title: "List webhook endpoints", summary: "All endpoints in this mode.", list: true, query: pageQ, status: 200, response: wrap(endpoint), errors: ["authentication_failed"] },
      { id: "delete-webhook-endpoint", method: "DELETE", path: "/v1/webhook_endpoints/{id}", title: "Delete a webhook endpoint", summary: "Stop sending to it.", pathParams: [{ name: "id", type: "string", required: true, description: "The endpoint id." }], status: 200, response: { id: "we_71c2xk", object: "webhook_endpoint", deleted: true }, errors: ["not_found"] },
      { id: "list-events", method: "GET", path: "/v1/events", title: "List events", summary: "Everything Tefo has sent you.", list: true, query: [{ name: "type", type: "string", description: "Filter by event type." }, ...pageQ], status: 200, response: wrap(event), errors: ["authentication_failed"] },
      { id: "redeliver-event", method: "POST", path: "/v1/events/{id}/redeliver", title: "Redeliver an event", summary: "Send an event to your endpoint again.", description: "Useful after you fix an outage on your side. The same event id is sent, so make your handler idempotent.", pathParams: [{ name: "id", type: "string", required: true, description: "The event id." }], status: 200, response: event, errors: ["not_found"] },
    ],
  },
  {
    id: "payment-requests",
    title: "Payment requests",
    blurb: "Ask a customer to pay (an M-Pesa prompt by default, or another rail), or share a payment link.",
    endpoints: [
      {
        id: "create-payment-request", method: "POST", path: "/v1/payment_requests", title: "Request a payment", summary: "Send a prompt to a customer's phone.",
        description: "By default the customer gets an M-Pesa prompt for the amount. You get collection.recorded when they pay, or collection.failed if they decline or time out. With rail set to card the response carries checkout.redirect_url: send the payer there to pay on a hosted page. With pesalink it carries payment_instructions: show the bank details to the payer. Tefo never receives a card number, and a request that contains one is refused. The nested collection is the same object you get from GET /v1/collections/{id}.",
        headers: [idem],
        body: [
          { name: "amount", type: "integer", required: true, description: "Amount in the smallest unit. M-Pesa and Airtel Money take whole shillings (a multiple of 100)." },
          { name: "wallet_id", type: "string", required: true, description: "The wallet the money should land in." },
          RAIL_FIELD,
          { name: "customer", type: "object", required: true, description: "{ phone } for M-Pesa and Airtel Money. For card, { email }." },
          { name: "description", type: "string", description: "Shown to the customer where the network allows." },
          { name: "reference", type: "string", description: "Your reference, up to 40 characters." },
          { name: "metadata", type: "object", description: "Your own key-value pairs." },
          RETURN_URL, CANCEL_URL, RESULT_URL,
        ],
        bodyExample: { amount: 250000, wallet_id: "wal_main", customer: { phone: "+254712000000" }, description: "Order 1042" },
        status: 201, response: { id: "pr_4n7c2x", object: "payment_request", rail: "mpesa", status: "sent", amount: 250000, currency: "KES", wallet_id: "wal_main", customer: { phone: "+254712000000" }, checkout: null, payment_instructions: null, livemode: false, created_at: created, collection: { ...collection, status: "pending", receipt: null } },
        errors: ["invalid_request", "wallet_frozen", "rail_not_enabled", "service_stopped", "idempotency_conflict"],
      },
      {
        id: "create-payment-link", method: "POST", path: "/v1/payment_links", title: "Create a payment link", summary: "A shareable page that takes payment.",
        description: "Leave amount out to let the payer choose. Disable the link with PATCH when you no longer want it used.",
        headers: [idem],
        body: [
          { name: "title", type: "string", required: true, description: "What the payer sees." },
          { name: "amount", type: "integer | null", description: "A fixed amount, or null for any amount." },
          { name: "wallet_id", type: "string", required: true, description: "Where the money lands." },
        ],
        bodyExample: { title: "School fees, Term 3", amount: null, wallet_id: "wal_main" },
        status: 201, response: { id: "pl_9k2m4d", object: "payment_link", title: "School fees, Term 3", amount: null, wallet_id: "wal_main", url: "https://pay.example.com/l/9k2m4d", active: true, livemode: false, created_at: created },
        errors: ["invalid_request", "idempotency_conflict"],
      },
    ],
  },
  {
    id: "payout-batches",
    title: "Bulk payouts",
    blurb: "Send many payments at once. One approval covers the whole batch.",
    object: {
      name: "Payout batch",
      description: "A list of payouts approved together and then sent one at a time. The total is held from the moment the batch is submitted.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier, starting pb_." },
        { name: "status", type: "string", values: ["draft", "pending_approval", "sending", "complete", "rejected"], description: "Where the batch is." },
        { name: "total", type: "integer", description: "Sum of all rows in the smallest unit." },
        { name: "counts", type: "object", description: "{ rows, sent, failed }." },
        { name: "wallet_id", type: "string", description: "The wallet the money comes from." },
      ],
      example: { id: "pb_3d8w1q", object: "payout_batch", status: "pending_approval", total: 5400000, counts: { rows: 36, sent: 0, failed: 0 }, wallet_id: "wal_payroll", livemode: false, created_at: created },
    },
    endpoints: [
      {
        id: "create-payout-batch", method: "POST", path: "/v1/payout_batches", title: "Create a bulk payout", summary: "Submit a list of payouts.",
        description: "Rows that fail validation are rejected with the row number and nothing is held. A valid batch is held and waits for approval. Each row becomes a normal payout, so you also get payout.sent or payout.failed for every row.",
        headers: [idem],
        body: [
          { name: "wallet_id", type: "string", required: true, description: "The wallet to pay from." },
          { name: "name", type: "string", description: "A label for your own records." },
          { name: "rows", type: "object[]", required: true, description: "Each row: { amount, destination, reference }." },
        ],
        bodyExample: { wallet_id: "wal_payroll", name: "October salaries", rows: [{ amount: 1200000, destination: { type: "phone", phone: "+254722000000" }, reference: "SAL-0001" }, { amount: 950000, destination: { type: "phone", phone: "+254733000000" }, reference: "SAL-0002" }] },
        status: 201, response: { id: "pb_3d8w1q", object: "payout_batch", status: "pending_approval", total: 2150000, counts: { rows: 2, sent: 0, failed: 0 }, wallet_id: "wal_payroll", livemode: false, created_at: created },
        errors: ["invalid_request", "insufficient_funds", "wallet_frozen", "verification_required", "idempotency_conflict"],
      },
      { id: "retrieve-payout-batch", method: "GET", path: "/v1/payout_batches/{id}", title: "Retrieve a bulk payout", summary: "Progress and counts.", pathParams: [{ name: "id", type: "string", required: true, description: "The batch id." }], status: 200, response: { id: "pb_3d8w1q", object: "payout_batch", status: "sending", total: 2150000, counts: { rows: 2, sent: 1, failed: 0 }, wallet_id: "wal_payroll", livemode: false, created_at: created }, errors: ["not_found"] },
    ],
  },
  {
    id: "statements",
    title: "Statements and fees",
    blurb: "Every settled movement of money as lines, and the fees we charged.",
    object: {
      name: "Statement line",
      description: "One line per movement. A collection with a fee produces two lines that share a reference: the money in and the fee out. Amounts are signed: money in is positive, money out is negative.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier, starting ln_." },
        { name: "kind", type: "string", values: ["collection", "payout", "settlement", "fee", "adjustment"], description: "What the line is." },
        { name: "amount", type: "integer", description: "Signed amount in the smallest unit." },
        { name: "wallet_id", type: "string", description: "The wallet affected." },
        { name: "reference", type: "string", description: "Shared by every line from the same transaction." },
        { name: "description", type: "string", description: "Plain-language description." },
        { name: "created_at", type: "string", description: "ISO 8601 timestamp." },
      ],
      example: { id: "ln_7b2k9x", object: "statement_line", kind: "fee", amount: -250, wallet_id: "wal_main", reference: "PTS-8F3K2Q", description: "Collection fee", livemode: false, created_at: created },
    },
    endpoints: [
      { id: "list-statement-lines", method: "GET", path: "/v1/statement", title: "List statement lines", summary: "Newest first, filtered on the server.", list: true, query: [{ name: "wallet_id", type: "string", description: "Only this wallet." }, { name: "kind", type: "string", description: "Only this kind of line.", values: ["collection", "payout", "settlement", "fee", "adjustment"] }, { name: "from", type: "string", description: "Start date, YYYY-MM-DD." }, { name: "to", type: "string", description: "End date, YYYY-MM-DD." }, ...pageQ], status: 200, response: wrap({ id: "ln_7b2k9x", object: "statement_line", kind: "fee", amount: -250, wallet_id: "wal_main", reference: "PTS-8F3K2Q", description: "Collection fee", livemode: false, created_at: created }), errors: ["authentication_failed", "invalid_request"] },
      { id: "list-fees", method: "GET", path: "/v1/fees", title: "List fees", summary: "Only the fee lines.", description: "The same as the statement filtered to kind=fee, so you can check what you were charged against your own records.", list: true, query: [{ name: "wallet_id", type: "string", description: "Only this wallet." }, { name: "from", type: "string", description: "Start date, YYYY-MM-DD." }, { name: "to", type: "string", description: "End date, YYYY-MM-DD." }, ...pageQ], status: 200, response: wrap({ id: "ln_7b2k9x", object: "statement_line", kind: "fee", amount: -250, wallet_id: "wal_main", reference: "PTS-8F3K2Q", description: "Collection fee", livemode: false, created_at: created }), errors: ["authentication_failed"] },
      { id: "query-collection-status", method: "POST", path: "/v1/collections/{id}/query", title: "Check a pending collection", summary: "Ask the network what happened.", description: "Use it on a collection that has been pending longer than expected. We ask the provider and update the collection. Never create a second collection to retry.", pathParams: [{ name: "id", type: "string", required: true, description: "The collection id." }], status: 200, response: collection, errors: ["not_found"] },
    ],
  },
  {
    id: "rails",
    title: "Payment rails",
    blurb: "Which rails your business can use, card refunds and PesaLink account checks.",
    endpoints: [
      {
        id: "list-rails", method: "GET", path: "/v1/rails", title: "List your rails", summary: "The rails enabled for your business.",
        description: "Only rails that Tefo staff enabled for your business are listed. available is false when no healthy account can serve the rail right now (live only). Airtel Money, card and PesaLink are not yet verified with their providers: treat a rail as usable only when it appears here.",
        status: 200, response: { object: "list", data: [{ rail: "mpesa", available: true }, { rail: "card", available: false }], has_more: false, next_cursor: null }, list: true, errors: ["authentication_failed", "permission_denied"],
      },
      {
        id: "refund-collection", method: "POST", path: "/v1/collections/{id}/refund", title: "Refund a card payment", summary: "Refund a paid card collection, in full or in part.",
        description: "Card collections only. You can refund between KES 1 and what is left of the amount collected, and make several partial refunds. The amount plus any refund fee is held from the wallet first, then the card acquirer is asked, and the refund goes only to the account that took the payment. Above your approval threshold a second person must approve it. The response is a payout object for the refund. Not yet verified with a card acquirer.",
        pathParams: [{ name: "id", type: "string", required: true, description: "The collection id of a succeeded card collection." }],
        headers: [idem],
        body: [{ name: "amount", type: "integer", description: "Amount in the smallest unit. Leave out to refund what is left." }, { name: "reason", type: "string", description: "Up to 100 characters." }],
        bodyExample: { amount: 100000, reason: "Customer returned the item" },
        status: 201, response: { ...payout, status: "pending", amount: 100000 }, errors: ["invalid_request", "not_found", "insufficient_funds", "verification_required", "rail_not_enabled", "idempotency_conflict"],
      },
      {
        id: "validate-bank-account", method: "POST", path: "/v1/rails/pesalink/validate_account", title: "Check a bank account", summary: "Check an account before paying it by PesaLink.",
        description: "Asks the bank whether the account exists, and returns the account name when the bank gives one. Payout creation does not do this check for you. Not yet verified with a sponsoring bank.",
        body: [{ name: "bank_code", type: "string", required: true, description: "The bank code, 2 to 11 letters or digits." }, { name: "account_number", type: "string", required: true, description: "The account number, 4 to 30 characters." }],
        bodyExample: { bank_code: "01", account_number: "1234567890" },
        status: 200, response: { valid: true, account_name: "A N OTHER" }, errors: ["invalid_request", "rail_not_enabled", "authentication_failed"],
      },
    ],
  },
  {
    id: "transfers",
    title: "Wallet transfers",
    blurb: "Move money instantly between two businesses' wallets, with no provider involved.",
    object: {
      name: "Transfer",
      description: "Money moved from one of your wallets to another business's wallet. It is one balanced entry inside Tefo, so no M-Pesa or bank call is made. You see the other side as a business name and a masked wallet number, never a wallet id. The fee comes from your tariff and is free by default.",
      fields: [
        { name: "id", type: "string", description: "Unique identifier." },
        { name: "status", type: "string", values: ["pending_approval", "succeeded", "rejected", "canceled"], description: "Where the transfer is. pending_approval means a second person must approve it; the money is held meanwhile." },
        { name: "direction", type: "string", values: ["out", "in"], description: "out if you sent it, in if you received it." },
        { name: "amount", type: "integer", description: "Amount in the smallest unit." },
        { name: "fee", type: "integer", description: "The fee you were charged. Always 0 on an incoming transfer." },
        { name: "currency", type: "string", description: "Always KES." },
        { name: "reference", type: "string | null", description: "Your reference." },
        { name: "wallet_id", type: "string", description: "Your wallet on this transfer: the one money left, or the one it arrived in." },
        { name: "approval", type: "object | null", description: "Present on an outgoing transfer that needed approval: { approval_id }." },
        { name: "counterparty", type: "object", description: "The other business: { business_name, wallet_number_masked }." },
        { name: "livemode", type: "boolean", description: "false in the sandbox." },
        { name: "created_at", type: "string", description: "ISO 8601 timestamp." },
        { name: "completed_at", type: "string | null", description: "When it finished, or null." },
      ],
      example: transfer,
    },
    endpoints: [
      {
        id: "lookup-wallet", method: "GET", path: "/v1/wallets/lookup", title: "Look up a wallet number", summary: "Find the business behind a wallet number before you send.",
        description: "Returns only the business name and the masked number. It is rate limited per business (10 a minute and 20 misses an hour) so wallet numbers cannot be guessed, and a refused request still counts. An unknown, frozen or suspended wallet answers recipient_not_found.",
        query: [{ name: "number", type: "string", required: true, description: "A wallet number, 6 to 12 digits." }],
        status: 200, response: { object: "wallet_lookup", business_name: "Mama Njeri Groceries", wallet_number_masked: "******78" }, errors: ["recipient_not_found", "rate_limited", "authentication_failed"],
      },
      {
        id: "create-transfer", method: "POST", path: "/v1/transfers", title: "Send a transfer", summary: "Send money to another business's wallet.",
        description: "Instant, with no provider call. Above your approval threshold the money is held and a second person decides. Use an Idempotency-Key so a retry cannot send twice. Events: transfer.sent for you and transfer.received for the other business.",
        headers: [idem],
        body: [
          { name: "from_wallet_id", type: "string", required: true, description: "Your wallet to send from." },
          { name: "to_merchant_number", type: "string", required: true, description: "The recipient's wallet number, 6 to 12 digits. Look it up first." },
          { name: "amount", type: "integer", required: true, description: "Amount in the smallest unit." },
          { name: "reference", type: "string", description: "Your reference, up to 60 characters." },
        ],
        bodyExample: { from_wallet_id: "wal_main", to_merchant_number: "10045678", amount: 500000, reference: "INV-77" },
        status: 201, response: transfer, errors: ["invalid_request", "insufficient_funds", "wallet_frozen", "recipient_not_found", "recipient_unavailable", "service_stopped", "idempotency_conflict", "authentication_failed"],
      },
      { id: "list-transfers", method: "GET", path: "/v1/transfers", title: "List transfers", summary: "Transfers you sent and received.", list: true, query: [{ name: "status", type: "string", description: "Filter by status.", values: ["pending_approval", "succeeded", "rejected", "canceled"] }, ...pageQ], status: 200, response: wrap(transfer), errors: ["authentication_failed"] },
      { id: "retrieve-transfer", method: "GET", path: "/v1/transfers/{id}", title: "Retrieve a transfer", summary: "Fetch one transfer.", pathParams: [{ name: "id", type: "string", required: true, description: "The transfer id." }], status: 200, response: transfer, errors: ["not_found"] },
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

export type Retry = "fix_first" | "same_key" | "after_wait";
export const RETRY_LABEL: Record<Retry, string> = { fix_first: "Do not retry as is. Fix the request first.", same_key: "Safe to retry with the same Idempotency-Key.", after_wait: "Retry after the number of seconds in the Retry-After header." };

export const ERRORS: { code: string; cause: string; retry: Retry; status: number; meaning: string; fix: string }[] = [
  { code: "invalid_request", cause: "A required field is missing, a value has the wrong type or is not an allowed value, or amount is not a positive integer in cents.", retry: "fix_first", status: 400, meaning: "A parameter is missing or the wrong shape.", fix: "Read error.param and fix that field." },
  { code: "authentication_failed", cause: "The Authorization header is missing, the key was revoked, or a sandbox key is being used for live (or the other way round).", retry: "fix_first", status: 401, meaning: "The API key is missing, wrong or revoked.", fix: "Check you send Authorization: Bearer and use the key for the right mode." },
  { code: "permission_denied", cause: "The key or the signed-in role does not have the permission this call needs.", retry: "fix_first", status: 403, meaning: "Your key or role cannot do this.", fix: "Use a key with the access you need, or ask an owner." },
  { code: "not_found", cause: "The id is wrong, or it belongs to the other mode. Objects never cross between sandbox and live.", retry: "fix_first", status: 404, meaning: "The object does not exist in this mode.", fix: "Check the id, and that you are not mixing sandbox and live ids." },
  { code: "idempotency_conflict", cause: "The same Idempotency-Key was sent with a different body.", retry: "fix_first", status: 409, meaning: "The Idempotency-Key was used with different parameters.", fix: "Use a new key for a different request." },
  { code: "insufficient_funds", cause: "The wallet's available balance is lower than the amount plus the fee. Money held for payouts waiting for approval is not available.", retry: "fix_first", status: 422, meaning: "The wallet cannot cover the amount plus the fee.", fix: "Top up the wallet or lower the amount." },
  { code: "wallet_frozen", cause: "The wallet is frozen, so it cannot send payouts.", retry: "fix_first", status: 422, meaning: "The wallet is frozen.", fix: "Unfreeze it in the portal or with PATCH /v1/wallets/{id}." },
  { code: "shortcode_inactive", cause: "The shortcode is pending or suspended.", retry: "fix_first", status: 422, meaning: "The shortcode is pending or suspended.", fix: "Wait for it to become active, or use another shortcode." },
  { code: "verification_required", cause: "The business is not fully verified, so payouts are off.", retry: "fix_first", status: 422, meaning: "The business is not fully verified, so payouts are still off.", fix: "Finish verification under Verification in the portal. Receiving payments is not affected." },
  { code: "rail_not_enabled", cause: "The rail you asked for (airtel_money, pesalink or card, or mpesa) is not enabled for your business. Tefo staff turn rails on per business.", retry: "fix_first", status: 422, meaning: "That payment rail is not enabled for your business.", fix: "Call GET /v1/rails to see which rails you can use, and ask Tefo to enable the one you need." },
  { code: "ip_not_allowed", cause: "The app that owns this API key has an IP allowlist and the request came from an address that is not on it.", retry: "fix_first", status: 403, meaning: "This API key cannot be used from this IP address.", fix: "Call from an allowed address, or add your server's IP to the app's allowlist in the portal. See App security." },
  { code: "recipient_not_found", cause: "No wallet can receive a transfer at that number. The same answer is given for frozen or suspended wallets.", retry: "fix_first", status: 404, meaning: "No wallet can receive a transfer at that number.", fix: "Check the wallet number with GET /v1/wallets/lookup." },
  { code: "recipient_unavailable", cause: "When a held transfer was approved, the recipient's wallet could not receive money any more.", retry: "fix_first", status: 422, meaning: "The recipient wallet could not receive at approval time.", fix: "Reject the pending transfer to release the held money, then ask the recipient." },
  { code: "service_stopped", cause: "Tefo has paused this type of transaction for everyone.", retry: "same_key", status: 503, meaning: "Tefo has paused this transaction type for everyone, for example payouts to businesses.", fix: "Retry with the same Idempotency-Key after a few minutes. Nothing was created." },
  { code: "rate_limited", cause: "More requests were sent than are allowed.", retry: "after_wait", status: 429, meaning: "Too many requests.", fix: "Wait for the number of seconds in the Retry-After header." },
  { code: "api_error", cause: "A fault on Tefo's side.", retry: "same_key", status: 500, meaning: "Something went wrong on our side.", fix: "Retry with the same Idempotency-Key. If it persists, contact support with the request id." },
];

export interface ApiEvent {
  type: string;
  when: string;
  /** What data.object holds: a key of EVENT_OBJECTS. null when no payload is documented yet. */
  object: "collection" | "payout" | "settlement" | "day_close" | "payout_batch" | "transfer" | null;
  /** Shown as a chip. Anything the backend notes but this file did not have before. */
  note?: string;
}

export const EVENTS: ApiEvent[] = [
  { type: "collection.recorded", object: "collection", when: "A collection succeeded and was recorded. data.object.rail says which rail took it." },
  { type: "collection.failed", object: "collection", when: "A collection failed. data.object.failure has the reason." },
  { type: "collection.reversed", object: "collection", when: "A collection that had succeeded was reversed.", note: "From the backend notes. Not in earlier versions of these docs." },
  { type: "payout.approval_required", object: "payout", when: "A payout went over your approval threshold and is waiting for a second person." },
  { type: "payout.approved", object: "payout", when: "A payout was approved and is being sent." },
  { type: "payout.rejected", object: "payout", when: "A payout was rejected. The held money is back in the wallet." },
  { type: "payout.pending", object: "payout", when: "A payout was accepted and is on its way. Not sent yet.", note: "From the backend notes. Not in earlier versions of these docs." },
  { type: "payout.sent", object: "payout", when: "A payout was sent." },
  { type: "payout.failed", object: "payout", when: "A payout failed." },
  { type: "payout_batch.complete", object: "payout_batch", when: "Every payout in a batch has finished.", note: "From the backend notes. Not in earlier versions of these docs." },
  { type: "schedule.run_failed", object: null, when: "A scheduled run failed.", note: "From the backend notes. Its payload is not documented yet." },
  { type: "transfer.approval_required", object: "transfer", when: "An outgoing wallet transfer went over your approval threshold and is waiting for a second person.", note: "From the backend source. Wallet transfers are new in these docs." },
  { type: "transfer.sent", object: "transfer", when: "A wallet transfer completed. You get it as the sender (direction out) and the other business gets transfer.received.", note: "From the backend source." },
  { type: "transfer.received", object: "transfer", when: "Another business sent a transfer to one of your wallets (direction in).", note: "From the backend source." },
  { type: "transfer.failed", object: "transfer", when: "An outgoing transfer was rejected or canceled. The held money is back in the wallet. data.object.status says which.", note: "From the backend source." },
  { type: "settlement.landed", object: "settlement", when: "A settlement landed in your till or account.", note: "The backend lists this event as defined but not emitted yet." },
  { type: "day.closed", object: "day_close", when: "A trading day was closed and its record is ready to export.", note: "The backend lists this event as defined but not emitted yet." },
];

/** The example data.object for each event family, taken from the reference so it cannot drift. */
export function eventObject(kind: NonNullable<ApiEvent["object"]>): unknown {
  const ex = (rid: string) => RESOURCES.find((r) => r.id === rid)?.object?.example;
  if (kind === "collection") return ex("collections");
  if (kind === "payout") return ex("payouts");
  if (kind === "settlement") return ex("settlements");
  if (kind === "payout_batch") return ex("payout-batches");
  if (kind === "transfer") return ex("transfers");
  return RESOURCES.flatMap((r) => r.endpoints).find((e) => e.id === "retrieve-day-close")?.response;
}

export function eventPayload(ev: ApiEvent) {
  return {
    id: "evt_6h2p0q",
    object: "event",
    type: ev.type,
    created_at: created,
    livemode: false,
    data: { object: ev.object ? eventObject(ev.object) : "<not documented yet>" },
  };
}

export const allEndpoints = () => RESOURCES.flatMap((r) => r.endpoints.map((e) => ({ resource: r, endpoint: e })));

/** What each allowed value means. Keyed by field name; the pages and the search index read this. */
export const ENUM_MEANINGS: Record<string, Record<string, string>> = {
  source: {
    till: "The customer paid to your till number.",
    paybill: "The customer paid to your paybill and typed an account number.",
    stk: "Tefo sent an M-Pesa prompt (STK push) to the customer's phone.",
  },
  currency: { KES: "Kenyan shillings, the only currency." },
  rail: {
    mpesa: "M-Pesa. The default rail, over Safaricom.",
    airtel_money: "Airtel Money. Not yet verified with Airtel. Works only where Tefo enabled it for your business.",
    card: "Visa and Mastercard on a hosted checkout page. Not yet verified with an acquirer. Works only where Tefo enabled it for your business.",
    pesalink: "Bank transfers by PesaLink. Not yet verified with a sponsoring bank. Works only where Tefo enabled it for your business.",
  },
  direction: { out: "You sent the transfer.", in: "You received the transfer." },
  "transfer.status": {
    pending_approval: "A second person must approve it first. The money is held meanwhile.",
    succeeded: "The money moved.",
    rejected: "A reviewer rejected it. The held money returns to the wallet.",
    canceled: "It was canceled before it was approved. The held money returns to the wallet.",
  },
  scenario: {
    success: "The customer approves and the collection succeeds.",
    insufficient_funds: "The collection fails with failure.code insufficient_funds.",
    customer_cancelled: "The collection fails with customer_cancelled.",
    no_response: "The customer never answers. The collection fails with no_response.",
  },
  "collection.status": {
    pending: "The customer has been asked to pay. The result has not arrived yet.",
    succeeded: "The payment arrived and was recorded.",
    failed: "The payment did not happen. failure.code says why.",
    reversed: "A payment that had succeeded was reversed.",
  },
  "payout.status": {
    pending_approval: "A second person must approve it first. The money is held meanwhile.",
    pending: "Accepted and on its way. Not sent yet.",
    sent: "The payout was sent.",
    failed: "The payout failed. The held money returns to the wallet.",
    canceled: "The payout was cancelled before it was sent.",
    rejected: "A reviewer rejected it. The held money returns to the wallet.",
  },
  "settlement.status": { pending: "On its way to your till or account.", landed: "The money has landed." },
  "wallet.status": {
    active: "Works normally.",
    suspended: "Cannot send payouts.",
    locked: "Cannot send payouts.",
    dormant: "No activity for 90 days.",
  },
  "shortcode.status": { active: "Takes payments.", pending: "Not active yet. Wait for it to become active.", suspended: "Not taking payments." },
  "shortcode.type": { paybill: "A paybill number. Customers type an account number.", till: "A till number (buy goods)." },
  "webhook_endpoint.status": { enabled: "Events are being sent.", disabled: "Events are not being sent." },
  "payout_batch.status": {
    draft: "Created, not yet submitted.",
    pending_approval: "Waiting for a second person.",
    sending: "Payouts in the batch are being sent.",
    complete: "Every payout in the batch has finished.",
    rejected: "A reviewer rejected the batch.",
  },
  kind: {
    collection: "Money in from a customer.",
    payout: "Money out to a person or account.",
    settlement: "Money moved to your till or account.",
    fee: "A fee charged.",
    adjustment: "A correction recorded by Tefo.",
  },
};

const MONEY_FIELDS = new Set(["amount", "balance", "fee", "held", "pending", "total", "approval_threshold"]);

/** The meanings for one field's values, trying "<resource>.<field>" then "<field>". */
export function enumMeanings(resourceKey: string, field: Field): Record<string, string> | undefined {
  return ENUM_MEANINGS[`${resourceKey}.${field.name}`] ?? ENUM_MEANINGS[field.name];
}

// Flag money fields once, here, so the reference, the OpenAPI file and the search index agree.
const flag = (fs?: Field[]) => fs?.forEach((f) => { if (f.type.startsWith("integer") && MONEY_FIELDS.has(f.name)) f.money = true; });
for (const r of RESOURCES) {
  flag(r.object?.fields);
  for (const e of r.endpoints) { flag(e.body); flag(e.query); }
}

/** failure.code on a failed collection. These come from the sandbox scenarios; they are not API errors. */
export const FAILURE_CODES: { code: string; meaning: string }[] = [
  { code: "insufficient_funds", meaning: "The customer does not have enough money." },
  { code: "customer_cancelled", meaning: "The customer cancelled the request on their phone." },
  { code: "no_response", meaning: "The customer did not respond in time." },
];
