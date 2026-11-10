---
title: Idempotency
description: Retry safely without paying or charging twice.
---

Networks fail. If your request times out, you cannot tell whether it reached Tefo. Without protection, retrying a payout could pay someone twice.

Send an `Idempotency-Key` header on every request that moves money or creates something. With an API key it is **required** on `POST /v1/payment_requests`, `/v1/payouts`, `/v1/wallets`, `/v1/payment_links`, `/v1/transfers` and `/v1/collections/{id}/refund`. Without it the request is refused with `400 invalid_request` and nothing is created, so a retry after a timeout can never pay twice.

```bash
curl -X POST "$TEFO_API/v1/payouts" \
  -H "Authorization: Bearer $TEFO_SECRET_KEY" \
  -H "Idempotency-Key: salary-oct-0007" \
  -H "Content-Type: application/json" \
  -d '{ "amount": 1200000, "wallet_id": "wal_payroll",
        "destination": { "type": "phone", "phone": "+254722000000" } }'
```

## How it behaves

- The first request with a key does the work and stores the result.
- A retry with the **same key and same body** returns the stored result, with the header `Idempotent-Replayed: true`. Nothing happens twice.
- A request with the **same key and a different body** returns `409 idempotency_conflict`.
- A retry while the first request is still running returns `409 idempotency_in_progress`.
- A request that failed before it did anything releases its key, so you can send it again.
- A key is scoped to your business and to the mode (sandbox or live).

## Choosing a key

Use a value that identifies the logical action, not the attempt. An order id plus the action works well: `order-1042-payout`. A random UUID generated per request does not help, because a retry would generate a new one.

`GET` requests are already safe to repeat and do not need a key.

If a payout times out and you sent no key, it may or may not exist. List payouts by `reference` before you send again.
