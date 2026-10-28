---
title: Sandbox and testing
description: Make payments succeed or fail on command.
---

The sandbox behaves like live, but nothing real happens. You can force any outcome so you can test your error handling before customers meet it.

## Force an outcome

Add the `Pitisha-Sandbox-Scenario` header to [`POST /v1/collections`](/docs/reference/collections/), or send `scenario` to [`simulate_payment`](/docs/reference/sandbox/).

| Scenario | Result |
| --- | --- |
| `success` | The customer approves. The collection succeeds. |
| `insufficient_funds` | The collection fails with `failure.code` of `insufficient_funds`. |
| `customer_cancelled` | The collection fails with `customer_cancelled`. |
| `no_response` | The customer never answers. The collection fails with `no_response` after the timeout. |

Without the header, collections succeed.

## Simulate a customer paying your paybill

If your integration waits for customers to pay a paybill you gave them, use `simulate_payment` to play the customer:

```bash
curl -X POST "$PITISHA_API/v1/sandbox/shortcodes/SHORTCODE_ID/simulate_payment" \
  -H "Authorization: Bearer $PITISHA_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "amount": 150000, "reference": "INV-204117", "scenario": "success" }'
```

Your webhook endpoint receives the same events it would in live.

## Test the smart switch

You cannot break a real gateway in the sandbox, but responses still carry a `routing` object. Your integration should treat `routing.failed_over: true` as ordinary. See [Gateways and failover](/docs/gateways/).

## Test the pile

Reuse the same `reference` for two sandbox collections of the same amount with different `sale_id`s in your own records. Pitisha cannot tell which sale the second one belongs to, so the collection lands in the pile. Resolve it with [`POST /v1/collections/{id}/match`](/docs/reference/collections/).

## What the sandbox does not do

- It does not move money or touch real accounts.
- Its timing is faster than live. Do not tune timeouts against it.
- Test data is deleted after 90 days.
