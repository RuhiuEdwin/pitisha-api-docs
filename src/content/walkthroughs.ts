import type { Req } from "@/lib/snippets";

/** One step of the quickstart or a recipe. `req` renders as cURL, JavaScript, Python and PHP. `code` is shown as it is. */
export interface Step {
  id: string;
  title: string;
  /** Markdown. */
  body: string;
  req?: Req;
  /** Per-language code that is not a plain API request (a verifier, an environment setup). */
  code?: Partial<Record<"curl" | "javascript" | "python" | "php", string>>;
  /** Code that is the same in every language (shell or JSON). Shown without tabs. */
  shared?: { lang: string; title: string; code: string };
  /** What you should see. Plain text or JSON. */
  expect?: { lang: "json" | "text"; code: string };
}

export interface Walkthrough {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  /** One sentence, said before the steps, that answers "what will I have at the end". */
  outcome: string;
  steps: Step[];
  related: { label: string; href: string }[];
}

const J = (v: unknown) => JSON.stringify(v, null, 2);

const collectBody = { amount: 250000, currency: "KES", source: "paybill", customer: { phone: "+254712000000" }, reference: "INV-204117" };

export const QUICKSTART: Walkthrough = {
  id: "quickstart",
  title: "Quickstart in 5 minutes",
  summary: "Make your first sandbox payment, read the result and see the event. Nothing here moves real money.",
  minutes: 5,
  outcome: "You will have created a sandbox key, collected a test payment of KES 2,500.00, read the result, and forced a failure.",
  steps: [
    {
      id: "key",
      title: "Get a sandbox key",
      body: "In the partners portal switch to **Sandbox**, open **Apps and keys** and create an app. Copy the secret key. It starts with `sk_test_`. Keep it on your server, never in a browser or a mobile app.\n\nPut the key and your sandbox base URL (from the portal) in environment variables. Every sample on this site reads them.",
      shared: { lang: "bash", title: "Terminal", code: 'export TEFO_API="your sandbox base URL from the portal"\nexport TEFO_SECRET_KEY="sk_test_..."' },
    },
    {
      id: "collect",
      title: "Collect a payment",
      body: "Ask a customer to pay KES 2,500 to your sandbox paybill.\n\n- `amount` is in **cents**. `250000` is KES 2,500.00.\n- `source: \"paybill\"` says the customer pays to your paybill. Other sources are in the [collection reference](/docs/reference/collections/).\n- `Idempotency-Key` makes a retry safe. See [Idempotency](/docs/idempotency/).\n- `Tefo-Sandbox-Scenario: success` makes the sandbox succeed on command.",
      req: { method: "POST", path: "/v1/collections", headers: [["Content-Type", "application/json"], ["Idempotency-Key", "quickstart-1"], ["Tefo-Sandbox-Scenario", "success"]], body: collectBody },
      expect: { lang: "text", code: 'HTTP 201\n"status": "pending"   the customer has been asked to approve on their phone\n"id": "col_8f3k2q"   keep this for the next step' },
    },
    {
      id: "read",
      title: "Read the result",
      body: "In the sandbox the customer approves right away. Fetch the collection, using the `id` from step 2.\n\n`status` is `pending`, `succeeded` or `failed`. A failed collection carries `failure.code`.",
      req: { method: "GET", path: "/v1/collections/{id}".replace("{id}", "COLLECTION_ID") },
      expect: { lang: "text", code: 'HTTP 200\n"status": "succeeded"\n"rail": "mpesa"' },
    },
    {
      id: "event",
      title: "Receive the event",
      body: "In your own code you would not poll. Tefo sends a `collection.recorded` webhook to your endpoint. Add an endpoint, then check the signature on every request.\n\nThe webhook scheme is **proposed** (see the note on [Webhooks](/docs/webhooks/)). The step-by-step is in the recipe [Verify a webhook signature](/docs/recipes/verify-webhook/).",
      req: { method: "POST", path: "/v1/webhook_endpoints", headers: [["Content-Type", "application/json"], ["Idempotency-Key", "quickstart-endpoint-1"]], body: { url: "https://api.example.com/tefo/webhooks", events: ["collection.recorded", "collection.failed"] } },
      expect: { lang: "text", code: "HTTP 201\nThe response shows the signing secret once. Store it on your server." },
    },
    {
      id: "failure",
      title: "Try a failure",
      body: "Change the header to `Tefo-Sandbox-Scenario: insufficient_funds` and repeat step 2 with a **new** `Idempotency-Key`. The collection ends as `failed` and `failure.code` says why. [Sandbox and testing](/docs/sandbox/) lists every scenario.",
      req: { method: "POST", path: "/v1/collections", headers: [["Content-Type", "application/json"], ["Idempotency-Key", "quickstart-2"], ["Tefo-Sandbox-Scenario", "insufficient_funds"]], body: collectBody },
      expect: { lang: "json", code: J({ status: "failed", failure: { code: "insufficient_funds", message: "The customer does not have enough money." } }) },
    },
  ],
  related: [
    { label: "Recipes", href: "/docs/recipes/" },
    { label: "Go-live checklist", href: "/docs/go-live/" },
    { label: "API reference", href: "/docs/reference/collections/" },
  ],
};

const signedNote = "Build the signed string: the timestamp `t`, a full stop, then the **raw request body** exactly as received.";

export const RECIPES: Walkthrough[] = [
  {
    id: "accept-stk-push",
    title: "Accept an STK push",
    summary: "Ask a customer to pay on their phone and learn the result without polling.",
    minutes: 10,
    outcome: "A customer is prompted on their phone, and your server learns whether they paid from a webhook, with a status query as the backup.",
    steps: [
      { id: "create", title: "Create the collection", body: "Send `amount` in cents, the customer's phone in international format and a `reference` you can find your order by. Use one `Idempotency-Key` per order, so a retry never prompts twice.", req: { method: "POST", path: "/v1/collections", headers: [["Content-Type", "application/json"], ["Idempotency-Key", "order-1042-collect"]], body: { amount: 250000, currency: "KES", source: "till", customer: { phone: "+254712000000" }, reference: "ORDER-1042", metadata: { order_id: "1042" } } }, expect: { lang: "text", code: 'HTTP 201, "status": "pending"\nNothing is paid yet. Tell the customer to check their phone.' } },
      { id: "wait", title: "Wait for the event", body: "Handle `collection.recorded` and `collection.failed` on your webhook endpoint. `data.object.status` is the final state and `data.object.reference` is your reference, so you can find the order it paid for. See the [event catalogue](/docs/webhook-events/).", shared: { lang: "json", title: "collection.recorded (data.object trimmed)", code: J({ type: "collection.recorded", data: { object: { id: "col_8f3k2q", status: "succeeded", amount: 250000, reference: "ORDER-1042" } } }) } },
      { id: "query", title: "If no event arrives, ask", body: "If you have heard nothing after your own timeout, ask Tefo for the status instead of creating a second collection.", req: { method: "POST", path: "/v1/collections/{id}/query".replace("{id}", "COLLECTION_ID"), headers: [["Idempotency-Key", "order-1042-query-1"]] } },
      { id: "fail", title: "Handle a failure", body: "A failed collection has `failure.code`. `insufficient_funds`, `customer_cancelled` and `no_response` are the three to handle first. Offer the customer a new attempt with a **new** `Idempotency-Key`. Test all three in the sandbox with `Tefo-Sandbox-Scenario`.", expect: { lang: "text", code: "insufficient_funds   the customer does not have enough money\ncustomer_cancelled   they cancelled on their phone\nno_response          they did not answer in time" } },
    ],
    related: [{ label: "Collections reference", href: "/docs/reference/collections/" }, { label: "Sandbox and testing", href: "/docs/sandbox/" }, { label: "Verify a webhook signature", href: "/docs/recipes/verify-webhook/" }],
  },
  {
    id: "collect-paybill-payment",
    title: "Collect on a paybill",
    summary: "Take a customer's paybill payment, confirm it by webhook and check its status.",
    minutes: 10,
    outcome: "A customer pays your paybill with your reference as the account number, you learn the result from a webhook, and you can check the status yourself if the event is late.",
    steps: [
      { id: "shortcode", title: "Find the paybill and its wallet", body: "List your shortcodes and note the paybill's `id`, the wallet it settles to and its `account_format`. Customers type your reference as the account number, so choose one per order, for example the invoice number. See [Shortcodes](/docs/reference/shortcodes/).", req: { method: "GET", path: "/v1/shortcodes" } },
      { id: "simulate", title: "Play the customer (sandbox)", body: "In the sandbox, play the customer paying the paybill. `reference` is the account number they would type. `amount` is in cents. In live the customer pays from their own phone and nothing is sent by you.", req: { method: "POST", path: "/v1/sandbox/shortcodes/SHORTCODE_ID/simulate_payment", headers: [["Content-Type", "application/json"]], body: { amount: 315000, reference: "INV-204117", scenario: "success" } } },
      { id: "webhook", title: "Confirm by webhook", body: "Handle `collection.recorded` (and `collection.failed`) on your webhook endpoint, and [verify the signature](/docs/recipes/verify-webhook/). Look up your order by `data.object.reference`, check `amount`, then mark it paid. Store the event `id` so a repeat does nothing.", shared: { lang: "json", title: "collection.recorded (data.object trimmed)", code: J({ type: "collection.recorded", data: { object: { id: "col_8f3k2q", status: "succeeded", source: "paybill", rail: "mpesa", amount: 315000, reference: "INV-204117", receipt: "SJK4H2L9QX" } } }) } },
      { id: "status", title: "Check the status yourself", body: "If no event arrives, fetch the collection. A collection is `pending`, `succeeded` or `failed`. For one that stays pending longer than you expect, ask the network with the query call instead of asking the customer to pay again.", req: { method: "GET", path: "/v1/collections?source=paybill&status=succeeded" } },
    ],
    related: [{ label: "Collections reference", href: "/docs/reference/collections/" }, { label: "Shortcodes reference", href: "/docs/reference/shortcodes/" }, { label: "Webhooks", href: "/docs/webhooks/" }],
  },
  {
    id: "take-card-payment",
    title: "Take a card payment",
    summary: "Send the payer to a hosted checkout page and read the result. Not yet verified with an acquirer.",
    minutes: 10,
    outcome: "The payer pays on a hosted page, so no card number ever reaches your server or Tefo, and you learn the result from a webhook. Card works only for businesses where Tefo enabled it.",
    steps: [
      { id: "enabled", title: "Check card is enabled", body: "Card is **not yet verified with an acquirer** and is available only where Tefo enabled it. Look for `card` in the list, and check `available`.", req: { method: "GET", path: "/v1/rails" } },
      { id: "create", title: "Create the payment", body: "Send `rail: \"card\"`, the payer's `email` and the `return_url` and `cancel_url` (https). **Never send a card number**: a request that contains one is refused.", req: { method: "POST", path: "/v1/payment_requests", headers: [["Content-Type", "application/json"], ["Idempotency-Key", "order-1042-card"]], body: { amount: 250000, wallet_id: "wal_main", rail: "card", customer: { email: "payer@example.com" }, return_url: "https://shop.example.com/paid", cancel_url: "https://shop.example.com/cart", reference: "ORDER-1042" } } },
      { id: "redirect", title: "Redirect the payer", body: "The response has `checkout.redirect_url`. Send the payer there. They enter the card on the acquirer's page, which also runs 3-D Secure.", expect: { lang: "text", code: 'HTTP 201\n"rail": "card"\n"checkout": { "redirect_url": "https://..." }' } },
      { id: "result", title: "Wait for the event", body: "The collection is `pending` until the payer finishes. Handle `collection.recorded` and `collection.failed`. Do not treat the browser returning to your `return_url` as proof of payment.", shared: { lang: "text", title: "Outcomes", code: "collection.recorded   status succeeded, rail card\ncollection.failed     status failed, failure.code says why" } },
      { id: "refund", title: "Refund if you need to", body: "A paid card collection can be refunded in full or in part with [`POST /v1/collections/{id}/refund`](/docs/reference/rails/). Several partial refunds are allowed up to the amount collected.", req: { method: "POST", path: "/v1/collections/COLLECTION_ID/refund", headers: [["Content-Type", "application/json"], ["Idempotency-Key", "order-1042-refund-1"]], body: { amount: 100000, reason: "Customer returned the item" } } },
    ],
    related: [{ label: "Payment rails", href: "/docs/rails/" }, { label: "Payment rails reference", href: "/docs/reference/rails/" }],
  },
  {
    id: "move-money-between-wallets",
    title: "Move money between wallets",
    summary: "Send money instantly to another business's wallet, with no provider involved.",
    minutes: 8,
    outcome: "You looked up the recipient, sent a transfer once even if you retried, and know which events to expect.",
    steps: [
      { id: "lookup", title: "Look up the wallet number", body: "Confirm the business behind the number before you send. You get only its name and a masked number. Lookups are rate limited.", req: { method: "GET", path: "/v1/wallets/lookup?number=10045678" } },
      { id: "send", title: "Send the transfer", body: "Use an `Idempotency-Key` so a retry cannot send twice. Above your approval threshold the transfer is `pending_approval` and a second person decides.", req: { method: "POST", path: "/v1/transfers", headers: [["Content-Type", "application/json"], ["Idempotency-Key", "inv-77-transfer"]], body: { from_wallet_id: "wal_main", to_merchant_number: "10045678", amount: 500000, reference: "INV-77" } } },
      { id: "events", title: "Read the result", body: "You get `transfer.sent` (or `transfer.approval_required`, then `transfer.sent` or `transfer.failed`). The other business gets `transfer.received`. Fetch it any time.", req: { method: "GET", path: "/v1/transfers" } },
    ],
    related: [{ label: "Wallet transfers", href: "/docs/transfers/" }, { label: "Transfers reference", href: "/docs/reference/transfers/" }],
  },
  {
    id: "retry-safely",
    title: "Retry safely with idempotency keys",
    summary: "Never pay someone twice because a request timed out.",
    minutes: 8,
    outcome: "A timed-out payout can be retried with the same key and cannot be sent twice.",
    steps: [
      { id: "key", title: "Choose a key that names the action", body: "Use one key per logical action, such as `order-1042-payout`. A random value per attempt does not help, because the retry would make a new one.", shared: { lang: "text", title: "Good and bad keys", code: "order-1042-payout        names the action, so a retry reuses it\nsalary-oct-0007          same\n9b1f6c2e-... (new each try)  a new key per attempt protects nothing" } },
      { id: "send", title: "Send the request with the key", body: "The first request does the work and stores the result.", req: { method: "POST", path: "/v1/payouts", headers: [["Content-Type", "application/json"], ["Idempotency-Key", "salary-oct-0007"]], body: { amount: 1200000, currency: "KES", wallet_id: "wal_payroll", destination: { type: "phone", phone: "+254722000000" }, reference: "SALARY-OCT-0007", reason: "salary" } } },
      { id: "retry", title: "On a timeout, retry with the same key and body", body: "You cannot tell whether the request arrived. Send it again, **unchanged**. A retry with the same key and body returns the stored result and does nothing twice.", expect: { lang: "text", code: "Same key + same body  -> the original result, nothing happens twice\nSame key + different body -> 409 idempotency_conflict" } },
      { id: "conflict", title: "Handle 409 idempotency_conflict", body: "It means you reused a key for a **different** request. Use a new key for a different request. Keys are remembered for 24 hours.", expect: { lang: "json", code: J({ error: { code: "idempotency_conflict", message: "The Idempotency-Key was used with different parameters.", request_id: "req_4k2m9x" } }) } },
    ],
    related: [{ label: "Idempotency", href: "/docs/idempotency/" }, { label: "Errors", href: "/docs/errors/" }],
  },
  {
    id: "verify-webhook",
    title: "Verify a webhook signature",
    summary: "Prove a request came from Tefo, and reject replays.",
    minutes: 8,
    outcome: "Your endpoint accepts only correctly signed, recent events. The scheme is proposed until the backend matches.",
    steps: [
      { id: "raw", title: "Read the raw body", body: "Use the bytes exactly as received. If your framework parses the JSON first and you serialise it again, the bytes change and the check fails. Read the `Tefo-Signature` header, which looks like `t=1761639604,v1=<hex>`." },
      {
        id: "verify", title: "Compute and compare",
        body: `${signedNote}\n\nCompute an HMAC-SHA256 of it with your signing secret, as hex. Compare with \`v1\` using a constant-time comparison. Reject the request if \`t\` is more than five minutes old.\n\nYou can try it with your own values in the [verifier on the event catalogue](/docs/webhook-events/#verifier).`,
        code: {
          curl: '# T and V1 come from the Tefo-Signature header; RAW_BODY is the exact body\nprintf \'%s\' "$T.$RAW_BODY" | openssl dgst -sha256 -hmac "$TEFO_WEBHOOK_SECRET"\n# the hex it prints must equal V1',
          javascript: 'import crypto from "node:crypto";\n\nexport function verify(rawBody, header, secret) {\n  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")));\n  const expected = crypto\n    .createHmac("sha256", secret)\n    .update(`${parts.t}.${rawBody}`)\n    .digest("hex");\n  const ok =\n    expected.length === parts.v1.length &&\n    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));\n  const fresh = Math.abs(Date.now() / 1000 - Number(parts.t)) < 300;\n  return ok && fresh;\n}',
          python: 'import hmac, hashlib, time\n\ndef verify(raw_body: bytes, header: str, secret: str) -> bool:\n    parts = dict(p.split("=", 1) for p in header.split(","))\n    signed = f"{parts[\'t\']}.".encode() + raw_body\n    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()\n    fresh = abs(time.time() - int(parts["t"])) < 300\n    return hmac.compare_digest(expected, parts["v1"]) and fresh',
          php: '<?php\nfunction verify(string $rawBody, string $header, string $secret): bool {\n  $parts = [];\n  foreach (explode(\',\', $header) as $p) { [$k, $v] = explode(\'=\', $p, 2); $parts[$k] = $v; }\n  $expected = hash_hmac(\'sha256\', $parts[\'t\'] . \'.\' . $rawBody, $secret);\n  $fresh = abs(time() - (int) $parts[\'t\']) < 300;\n  return hash_equals($expected, $parts[\'v1\']) && $fresh;\n}',
        },
      },
      { id: "respond", title: "Answer fast, and ignore repeats", body: "Return a `2xx` as soon as you have stored the event, and do the work afterwards. An event can arrive more than once, so store each event `id` you have handled and ignore repeats." },
    ],
    related: [{ label: "Webhooks", href: "/docs/webhooks/" }, { label: "Event catalogue and verifier", href: "/docs/webhook-events/" }],
  },
  {
    id: "switch-to-live",
    title: "Switch to live",
    summary: "From a tested sandbox integration to your first real payment.",
    minutes: 15,
    outcome: "Live access is requested, your live keys are in place, and your first live payment is small and watched. Live access is reviewed first, and this site does not say it is available.",
    steps: [
      { id: "check", title: "Finish the go-live checklist", body: "Work through the [go-live checklist](/docs/go-live/) in the sandbox first. Test a success and the failures, and handle a collection that stays pending (wait for the event, or ask with the query call)." },
      { id: "request", title: "Request live access in the portal", body: "In the partners portal, open **Settings and security** and choose **Request live access**. You need the permission to request it. The portal shows the status: onboarding, then in review, then live. Tefo reviews the request and a second person approves it." },
      { id: "keys", title: "Swap in live keys", body: "Once live is enabled, create a live app. Live keys start with `sk_live_`. Objects never cross between modes, so a sandbox id returns `404 not_found` with a live key. Change both variables and nothing else.", shared: { lang: "bash", title: "Terminal", code: 'export TEFO_API="your live base URL from the portal"\nexport TEFO_SECRET_KEY="sk_live_..."' } },
      { id: "webhook", title: "Add a live webhook endpoint", body: "Webhook endpoints and secrets are per mode. In live mode the backend creates an endpoint only after a second person approves it." },
      { id: "first", title: "Start small and watch", body: "Take a small first payment and check it in **Transactions**. Watch **Webhooks** for failed deliveries. Rotate keys whenever someone with access leaves." },
    ],
    related: [{ label: "Go-live checklist", href: "/docs/go-live/" }, { label: "Sandbox and live", href: "/docs/environments/" }],
  },
];

export const recipeById = (id: string) => RECIPES.find((r) => r.id === id);
