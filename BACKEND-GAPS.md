# Backend gaps

What the docs still cannot say, or where the backend itself looks wrong or out of step. Checked on 2026-11-10 against `tefo-backend` (`docs/openapi.json`, `docs/API.md`, `src/routes`, `src/modules`) and by running every sample in the quickstart, the recipes and the guides against a local sandbox. Nothing here is invented in the docs: each item is either marked "Proposed" on the site or left out.

## Missing, so the docs show a placeholder or a local-only control

| Gap | What the docs do today | What is needed |
| --- | --- | --- |
| **No real sandbox or live base URL** | Shown as `https://YOUR-BASE-URL`. Set `NEXT_PUBLIC_TEFO_SANDBOX_URL` and `NEXT_PUBLIC_TEFO_LIVE_URL` at build time and every page, the OpenAPI file and "Copy as cURL" pick them up. | The two URLs. |
| **No browser-callable sandbox** | Try it is a labelled simulation (`src/lib/simulate.ts`). It never sends a request and refuses `sk_live_` keys. | A sandbox with CORS for the docs origin, or a docs proxy. |
| **No public status page** | `/docs/status/` says so. Set `NEXT_PUBLIC_STATUS_URL` and the header link goes there. | A status page URL. |
| **No feedback endpoint** | "Was this helpful?" is saved on the visitor's device only, and says so. | An endpoint that accepts `{ page, vote }`. |
| **No version header or deprecation policy** | `/docs/versioning/` says there is none. | A decision: a pin header, and a notice period for breaking changes. |
| **No go-live checklist in the portal** | The docs checklist follows what the portal does have (Settings and security, Request live access). | If the portal gets a checklist, mirror its item ids in `src/content/golive.ts`. |

## Where the backend disagrees with itself or looks wrong

| Topic | What was found | Docs do |
| --- | --- | --- |
| **Webhook header names** | The backend sends `Tefo-Signature`, `Tefo-Event` and `Tefo-Delivery` (`src/modules/webhooks.ts`). | Documents those names. If the headers are renamed, search the docs for `Tefo-` and change them with the backend. |
| **`openapi.json` is stale in places** | The `events` enum on `POST /v1/webhook_endpoints` lists `settlement.landed` and `day.closed` (never emitted) but not `collection.reversed`, `payout.pending`, `payout_batch.complete` or `schedule.run_failed`, so those four can only be received by leaving `events` empty. `Idempotency-Key` is listed as optional although API keys must send it. `POST /v1/payment_requests` is typed as `Collection` but returns a `payment_request` object. | Follows the route code and real responses, not the file. |
| **`settlement.landed`, `day.closed`** | Accepted as `events` values, never emitted, and there are no settlement or day-close routes. | Removed from the reference, the guides and the event catalogue. |
| **Deleting a webhook endpoint** | `DELETE /v1/webhook_endpoints/{id}` answered `500 api_error` once during testing, on an endpoint that had received events. `webhook_deliveries.endpoint_id` has no `ON DELETE CASCADE`, and the route only falls back to disabling the endpoint when the delete returns no row. A second try on a fresh endpoint returned 200, so it is not reproduced. | Documents only `{ id, deleted: true }`. |
| **Idempotency keys never expire** | Nothing removes rows from `idempotency_keys`. The old docs said keys were kept for 24 hours. | Says keys are scoped to the business and mode, with no expiry stated. |
| **Cancel a payout** | Refused with `422 invalid_request` (not `400`) when the payout is not waiting for approval. | Documents the 422. |
| **Sandbox failure codes** | Collections fail with M-Pesa result codes (`1`, `1032`) and payouts with `SANDBOX_DECLINED`, not named codes such as `insufficient_funds`. `timeout` leaves the collection pending. | Documents what the sandbox returns. |
| **Name clash** | `insufficient_funds` is an API error on wallets. The collection failure codes no longer clash with it. | Nothing to do. |

## Not in the key-based API, so not in the reference

| Topic | State |
| --- | --- |
| **Bulk payouts** (`/v1/payout_batches`), **schedules** | Need a signed-in person (an API key gets 403) and a PIN. Their events (`payout_batch.complete`, `schedule.run_failed`) are in the catalogue. |
| **App security** (`/v1/apps/{id}/ip_allowlist`, `callback_url`, `rotate`, `revoke`, `/v1/app_security`, `/v1/app_changes`) | Session-only. Described in the App security guide, not in the reference, OpenAPI or Postman. |
| **Other payout destinations** | Paybill, till, Pochi, tax and B2C top-up are in the payout `destination` description. Payout `limits` for non-M-Pesa rails come from each rail adapter and are returned by `GET /v1/rails`. |
| **B2B requests, standing orders, saved views, reports, tickets** | Exist in the backend, not documented here. |
| **Payout limits** | KES 10 to 150,000 to a phone and KES 10 to 250,000 to a paybill, till or bank (`LIMITS` in `src/modules/payouts.ts`). The backend notes these must be checked against Safaricom before go-live. |

## Rails

Airtel Money, card and PesaLink are marked "not yet verified" and "available only where enabled" (`docs/RAILS.md` says nothing has run against a real provider). `result_url` is stored and returned; the backend also queues a `callback.result` post to it for collection events, but the docs only promise webhooks, because that delivery has not been exercised here.

## Still proposed

The README calls the webhook scheme a proposal. The signature scheme (`t=<unix>,v1=<hex>`, HMAC-SHA256 over `<t>.<raw body>`, five minute tolerance) matches `docs/API.md` and `sign()` in `webhooks.ts`, and the JavaScript, Python and openssl verifiers in the recipe were run against a header built that way. The "Proposed" marking stays until the backend owners confirm it. To remove it, set `PROPOSED = false` in `src/content/config.ts`.
