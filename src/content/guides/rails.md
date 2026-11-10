---
title: Payment rails
description: M-Pesa, Airtel Money, card and PesaLink, and what is and is not verified.
---

A **rail** is one way money moves. Collections and payouts carry a `rail` field. If you do not send one it is `mpesa`.

> **Not yet verified.** M-Pesa is the rail the API is built around. Airtel Money, card and PesaLink have not yet been run against their providers, and each is available only for businesses where Tefo has enabled it. Treat anything about them here as how the API is shaped, not a promise that it is open to you. Ask `GET /v1/rails` what your business can use.

| Rail | Collect | Pay out | Notes |
| --- | --- | --- | --- |
| `mpesa` | Prompt on the phone, paybill, till | To a phone, paybill, till and more | The default. |
| `airtel_money` | Prompt on the phone | To a phone | Whole shillings. Not yet verified with Airtel. |
| `card` | Hosted checkout page | Refunds only | Visa and Mastercard. Not yet verified with an acquirer. |
| `pesalink` | Bank details shown to the payer | To a bank account | Whole shillings. Not yet verified with a sponsoring bank. |

## Which rails can I use?

```bash
curl "$TEFO_API/v1/rails" -H "Authorization: Bearer $TEFO_SECRET_KEY"
```

You get only the rails Tefo enabled for your business. `available: false` means no healthy account can serve the rail right now (live only). Asking for a rail that is not enabled fails with `422 rail_not_enabled`.

## Collect

Send `rail` to [`POST /v1/payment_requests`](/docs/reference/payment-requests/).

- **`mpesa`, `airtel_money`:** send `customer.phone`. The customer approves on their phone.
- **`card`:** send `customer.email`, `return_url` and `cancel_url` (https). The response has `checkout.redirect_url`: send the payer there. **Never send card numbers.** The payer enters the card on the acquirer's hosted page, which also runs 3-D Secure, so Tefo and your server stay out of card data. A request that contains a card number, or fields named like card data, is refused.
- **`pesalink`:** the response has `payment_instructions` (`bank_name`, `account_number`, `account_name`, `reference`). Show them to the payer. The credit arrives later.

In every case the result is a [collection](/docs/reference/collections/) that is `pending`, then `succeeded` or `failed`, with a `collection.recorded` or `collection.failed` event. Do not treat a payer returning to your `return_url` as proof of payment.

## Pay out

Send `rail` to [`POST /v1/payouts`](/docs/reference/payouts/):

- `airtel_money` with a `phone` destination.
- `pesalink` with a `bank_account` destination: `{ "type": "bank_account", "bank_code": "...", "account_number": "..." }`. Check the account first with [`POST /v1/rails/pesalink/validate_account`](/docs/reference/rails/). Payout creation does not check it for you.

Airtel Money and PesaLink take whole shillings. Approval, holds and fees work as they do for M-Pesa payouts. See [Approvals and holds](/docs/approvals/).

## Refund a card payment

[`POST /v1/collections/{id}/refund`](/docs/reference/rails/) refunds a paid card collection, in full or in part, from KES 1 up to what is left of the amount collected. Several partial refunds are allowed. The amount is held from your wallet first, then the acquirer is asked. The refund goes only back to the account that took the payment. Above your approval threshold a second person approves it.

## Sandbox

The sandbox never calls a provider. For Airtel Money a phone ending `0001` fails and `0002` stays pending, as for M-Pesa. Card and PesaLink collections succeed at once, and payouts and refunds settle at once.

## Fees

Prices for the non-M-Pesa rails are set per business in your tariff. If your tariff has no price for a rail, the request fails with `product_not_offered`.
