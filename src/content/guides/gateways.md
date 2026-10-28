---
title: Gateways and failover
description: What the smart switch does and what it means for your code.
---

Behind the API, Pitisha connects to several gateways: M-Pesa, Airtel Money and bank rails. When you create a collection, the smart switch shares traffic across the healthy gateways that serve that source.

If a gateway slows down or fails, the switch moves the payment to the next gateway straight away. **You do not retry and your customer does not try again.**

## What you see

Each collection has a `routing` object:

```json
"routing": { "gateway": "daraja", "attempts": 2, "failed_over": true }
```

| Field | Meaning |
| --- | --- |
| `gateway` | The gateway that accepted the payment. |
| `attempts` | How many gateways were tried. |
| `failed_over` | `true` if the first gateway failed and the payment moved. |

## What to do about it

- Treat `failed_over: true` as ordinary. The payment is as valid as any other.
- Do not retry a collection yourself because it took slightly longer. Wait for the webhook.
- If you must retry after a network error on your side, use the same `Idempotency-Key`. See [Idempotency](/docs/idempotency/).
- Latency can vary by gateway. Do not assume a fixed response time.

## When every gateway is down

If every gateway for a source is unavailable, the collection is not created and you get `503 api_error`. Retry with the same Idempotency-Key.
