# Backend gaps found while building the docs

Things the docs need that the backend (or the docs' own source) does not state or does not match. Nothing here is invented in the docs: each item is either marked "Proposed" on the site or left out. Checked against `pitisha-backend/docs/API.md` and the partners portal on 2026-11-01.

## Missing, so the docs show a placeholder or a local-only control

| Gap | What the docs do today | What is needed |
| --- | --- | --- |
| **No real sandbox or live base URL** | Shown as `https://YOUR-BASE-URL`. Set `NEXT_PUBLIC_PITISHA_SANDBOX_URL` and `NEXT_PUBLIC_PITISHA_LIVE_URL` at build time and every page, the OpenAPI file and "Copy as cURL" pick them up. | The two URLs. |
| **No browser-callable sandbox** | Try it is a labelled simulation (`src/lib/simulate.ts`). It never sends a request and refuses `sk_live_` keys. | A sandbox with CORS for `docs` origins, or a docs proxy. Then Try it can send for real. |
| **No public status page** | `/docs/status/` says so. Set `NEXT_PUBLIC_STATUS_URL` and the header link goes there. | A status page URL. |
| **No feedback endpoint** | "Was this helpful?" is saved on the visitor's device only, and says so. | An endpoint (or a form service) that accepts `{ page, vote }`. |
| **No version header or deprecation policy** | `/docs/versioning/` says there is none. Versions are named by date. | A decision: a pin header, and a notice period for breaking changes. |
| **No go-live checklist in the portal** | The docs checklist follows what the portal does have: Settings and security, Request live access (`POST /v1/go-live`), status onboarding, in review, live. | If the portal gets a checklist, mirror its item ids in `src/content/golive.ts`. |

## Where the docs and the backend disagree

| Topic | Docs (`api.ts`) | Backend (`API.md`) | Action |
| --- | --- | --- | --- |
| Collection `source` values | `paybill`, `till`, `stk` (bank, Airtel and QR removed 2026-11-04: not built) | `paybill`, `till`, `stk` | Confirm what `stk` means for the `source` field. |
| Webhook retries | "up to three times" (`webhooks.md`) | 1 min, 5 min, 30 min, 2 h, 6 h, 24 h, then stop | Docs should say six retries once confirmed. Left as written, marked Proposed. |
| Webhook events | 10 events | 14: adds `collection.reversed`, `payout.pending`, `payout_batch.complete`, `schedule.run_failed` | The catalogue now lists all 14. `schedule.run_failed` has no documented payload. |
| `settlement.landed`, `day.closed` | Documented as sent | "Defined for the future and not yet emitted" | The catalogue says so on both events. |
| Webhook headers | `Tefo-Signature` only (renamed to `Tefo-Signature` in the docs; the backend must send the same) | Also `Tefo-Event` and `Tefo-Delivery` | Add to the docs when the scheme is final. |
| Live webhook endpoint | Created at once | Created only after a second person approves | Stated in the "Switch to live" recipe and the checklist. |
| Idempotency replay | Not mentioned | Replays carry `Idempotent-Replayed: true` | The simulation sends it. Add to the guide. |
| Whole shillings | Not mentioned | Payouts and STK push must be a multiple of 100 | Added to the payout `amount` field and the simulation. STK push not yet stated for collections. |
| `Collection.fee` | Not in the object | `fee`, `receipt` (M-Pesa receipt) | Add to the object when final. |
| Name clash | `insufficient_funds` is both an API error (wallet) and a collection `failure.code` (customer) | Same | Explained on the error explorer. Rename one if possible. |

## Added 2026-11-10 (rails, transfers, app security)

Sources: `pitisha-backend/src/routes/{money,rails,merchant_tools}.ts`, `src/modules/serialize.ts`, `docs/RAILS.md`, `docs/API.md`. Matching (match object, `match_state`, `/match`, `collection.matched`) is removed everywhere on the site.

| Topic | State |
| --- | --- |
| **Create path** | The backend creates collections with `POST /v1/payment_requests` (and a `collection` object in the response). The reference still shows `POST /v1/collections` as the proposed create call. Both carry `rail`, `return_url`, `cancel_url` and `result_url`; the guides and recipes for card use the real `payment_requests` path. Decide whether `/v1/collections` will exist. |
| **Non-M-Pesa rails** | Airtel Money, card and PesaLink are marked "not yet verified" and "available only where enabled" (RAILS.md says nothing has run against a real provider). Card and PesaLink contracts are invented placeholders in the backend. |
| **`result_url`** | The backend stores it (or the app's default callback URL) and returns it on the collection. The code read does not show a request to that URL, so the docs say results arrive as webhooks. Confirm what, if anything, Tefo sends there. |
| **Payout status** | Backend statuses are `succeeded`, `pending`, `failed`, ...; the docs still say `sent` (pre-existing). |
| **Refund response** | `POST /v1/collections/{id}/refund` returns a payout-shaped object; its exact `destination` is not in the route file. |
| **Day close** | `GET /v1/day-closes/{day}` and settlements are not in the backend route files (pre-existing). The matched/pile counts were removed from the example. |
| **App security endpoints** | Session-only (people in the portal, PIN, second-person approval in live). Described in the App security guide, not in the key-based reference, OpenAPI or Postman. |
| **Collection `source`** | Still `paybill`, `till`, `stk`; the backend collection serializer sends `source` and `rail`. |

## Business claims removed

The old go-live text said live review takes "usually within one working day" and that people are told "by email". Neither is in the README or the backend, so both are gone.

## Still proposed

The README calls the endpoints and the webhook scheme a proposal. The signature scheme (`t=<unix>,v1=<hex>`, HMAC-SHA256 over `<t>.<raw body>`, five minute tolerance) is identical in `API.md`, but the docs keep the "Proposed" marking until the backend is confirmed against them. To remove it, set `PROPOSED = false` in `src/content/config.ts`.
