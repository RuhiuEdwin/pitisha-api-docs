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
| Collection `source` values | `till`, `paybill`, `qr`, `bank`, `airtel` | `paybill`, `till`, `stk` | Agree one list. The docs keep their own until then. |
| Webhook retries | "up to three times" (`webhooks.md`) | 1 min, 5 min, 30 min, 2 h, 6 h, 24 h, then stop | Docs should say six retries once confirmed. Left as written, marked Proposed. |
| Webhook events | 10 events | 14: adds `collection.reversed`, `payout.pending`, `payout_batch.complete`, `schedule.run_failed` | The catalogue now lists all 14. `schedule.run_failed` has no documented payload. |
| `settlement.landed`, `day.closed` | Documented as sent | "Defined for the future and not yet emitted" | The catalogue says so on both events. |
| Webhook headers | `Pitisha-Signature` only | Also `Pitisha-Event` and `Pitisha-Delivery` | Add to the docs when the scheme is final. |
| Live webhook endpoint | Created at once | Created only after a second person approves | Stated in the "Switch to live" recipe and the checklist. |
| Idempotency replay | Not mentioned | Replays carry `Idempotent-Replayed: true` | The simulation sends it. Add to the guide. |
| Whole shillings | Not mentioned | Payouts and STK push must be a multiple of 100 | Added to the payout `amount` field and the simulation. STK push not yet stated for collections. |
| `Collection.fee` | Not in the object | `fee`, `receipt` (M-Pesa receipt) | Add to the object when final. |
| Name clash | `insufficient_funds` is both an API error (wallet) and a collection `failure.code` (customer) | Same | Explained on the error explorer. Rename one if possible. |

## Business claims removed

The old go-live text said live review takes "usually within one working day" and that people are told "by email". Neither is in the README or the backend, so both are gone.

## Still proposed

The README calls the endpoints and the webhook scheme a proposal. The signature scheme (`t=<unix>,v1=<hex>`, HMAC-SHA256 over `<t>.<raw body>`, five minute tolerance) is identical in `API.md`, but the docs keep the "Proposed" marking until the backend is confirmed against them. To remove it, set `PROPOSED = false` in `src/content/config.ts`.
