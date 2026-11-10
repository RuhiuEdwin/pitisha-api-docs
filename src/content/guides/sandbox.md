---
title: Sandbox and testing
description: Make payments succeed or fail on command.
---

The sandbox behaves like live, but nothing real happens. You can force any outcome so you can test your error handling before customers meet it.

## Force an outcome

The sandbox answers at once, and the **customer's phone number** decides the result of [`POST /v1/payment_requests`](/docs/reference/payment-requests/) and of a payout to a phone:

| Phone ends with | Collection | Payout |
| --- | --- | --- |
| `0001` | `failed`, `failure.code` `1032` | `failed`, `failure.code` `SANDBOX_DECLINED` |
| `0002` | stays `pending` | stays `pending` |
| anything else | `succeeded` at once | `succeeded` at once |

Fees are zero in the sandbox. A collection you create this way has source `stk`.

## Simulate a customer paying your paybill

If your integration waits for customers to pay a paybill you gave them, use `simulate_payment` to play the customer. First request a sandbox paybill with [`POST /v1/shortcodes`](/docs/reference/shortcodes/) (it is active at once) and assign it to a wallet with `PATCH /v1/shortcodes/{id}`.

```bash
curl -X POST "$TEFO_API/v1/sandbox/shortcodes/SHORTCODE_ID/simulate_payment" \
  -H "Authorization: Bearer $TEFO_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "amount": 150000, "reference": "INV-204117", "scenario": "success" }'
```

| `scenario` | Result |
| --- | --- |
| `success` | The collection succeeds. |
| `insufficient` | The collection fails with `failure.code` `1`: not enough M-Pesa balance. |
| `cancelled` | The collection fails with `failure.code` `1032`: the customer cancelled. |
| `timeout` | The customer never answers. The collection stays `pending`. |

Your webhook endpoint receives the same events it would in live.

## Start again

`POST /v1/sandbox/reset` brings every sandbox wallet balance back to zero and cancels sandbox collections and payouts that are still pending. Finished ones stay in the history.

## Test the smart switch

You cannot break a real gateway in the sandbox, but responses still carry a `routing` object. Your integration should treat `routing.failed_over: true` as ordinary. See [Gateways and failover](/docs/gateways/).

## Test other rails

Airtel Money follows the phone rules of M-Pesa: a phone ending `0001` fails and one ending `0002` stays pending. Card and PesaLink collections succeed at once, and payouts and refunds settle at once. The sandbox never calls a provider. These rails need to be enabled for your business first. See [Payment rails](/docs/rails/).

## What the sandbox does not do

- It does not move money or touch real accounts.
- Its timing is faster than live. Do not tune timeouts against it.
