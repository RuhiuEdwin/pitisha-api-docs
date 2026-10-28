---
title: Idempotency
description: Retry safely without paying or charging twice.
---

Networks fail. If your request times out, you cannot tell whether it reached Pitisha. Without protection, retrying a payout could pay someone twice.

Send an `Idempotency-Key` header on every request that creates something.

```bash
curl -X POST "$PITISHA_API/v1/payouts" \
  -H "Authorization: Bearer $PITISHA_SECRET_KEY" \
  -H "Idempotency-Key: salary-oct-0007" \
  -H "Content-Type: application/json" \
  -d '{ "amount": 1200000, "currency": "KES", "wallet_id": "wal_payroll",
        "destination": { "type": "phone", "phone": "+254722000000" } }'
```

## How it behaves

- The first request with a key does the work and stores the result.
- A retry with the **same key and same body** returns the stored result. Nothing happens twice.
- A request with the **same key and a different body** returns `409 idempotency_conflict`.
- Keys are remembered for 24 hours.

## Choosing a key

Use a value that identifies the logical action, not the attempt. An order id plus the action works well: `order-1042-payout`. A random UUID generated per request does not help, because a retry would generate a new one.

`GET` requests are already safe to repeat and do not need a key.
