---
title: Go live
description: The checklist before you take real payments.
---

Live access is reviewed by Pitisha before it is enabled. Work through this list in the sandbox first.

## Checklist

- [ ] A webhook endpoint is saved, receives events and verifies the signature.
- [ ] Your handler ignores events it has already processed.
- [ ] Every create request sends an `Idempotency-Key`.
- [ ] You tested a successful payment **and** a failed one (`insufficient_funds`, `customer_cancelled`, `no_response`).
- [ ] You handle a payment in the pile and one with no match.
- [ ] A shortcode is assigned to a wallet, and you know where each payment will land.
- [ ] Secret keys live in environment variables or a secrets manager, never in source control.
- [ ] Logs include the `request_id` from errors.

## Request access

In the portal, open your sandbox app and choose **Request live access**. Pitisha reviews the request, usually within one working day. Once it is enabled, create a live app. Live keys start with `sk_live_`.

## After you are live

- Start with small amounts and check the first payments in **Transactions**.
- Watch **Webhooks** for failed deliveries.
- Rotate keys whenever someone with access leaves.
