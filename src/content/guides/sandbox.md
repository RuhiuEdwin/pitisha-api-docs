---
title: Sandbox and testing
description: Make payments succeed or fail on command.
---

The sandbox behaves like live, but nothing real happens. You can force any outcome so you can test your error handling before customers meet it.

## Force an outcome

Add the `Tefo-Sandbox-Scenario` header to [`POST /v1/collections`](/docs/reference/collections/), or send `scenario` to [`simulate_payment`](/docs/reference/sandbox/).

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
curl -X POST "$TEFO_API/v1/sandbox/shortcodes/SHORTCODE_ID/simulate_payment" \
  -H "Authorization: Bearer $TEFO_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "amount": 150000, "reference": "INV-204117", "scenario": "success" }'
```

Your webhook endpoint receives the same events it would in live.

## Test the smart switch

You cannot break a real gateway in the sandbox, but responses still carry a `routing` object. Your integration should treat `routing.failed_over: true` as ordinary. See [Gateways and failover](/docs/gateways/).

## Test other rails

Airtel Money follows the phone rules of M-Pesa: a phone ending `0001` fails and one ending `0002` stays pending. Card and PesaLink collections succeed at once, and payouts and refunds settle at once. The sandbox never calls a provider. See [Payment rails](/docs/rails/).

## What the sandbox does not do

- It does not move money or touch real accounts.
- Its timing is faster than live. Do not tune timeouts against it.
- Test data is deleted after 90 days.
