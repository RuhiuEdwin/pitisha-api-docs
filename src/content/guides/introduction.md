---
title: Introduction
description: What the Tefo API is and how it is laid out.
---

Tefo is a payment gateway with one public API. You collect payments, pay out, and see every transaction in one place. M-Pesa and paybill come first. Airtel Money, card (on a hosted checkout) and PesaLink follow, and are not yet verified with their providers. See [Payment rails](/docs/rails/).

A collection is simply `pending`, `succeeded` or `failed`. Every shilling in and out has one record.

## What you can do

| Resource | What it is for |
| --- | --- |
| [Payment requests](/docs/reference/payment-requests/) | Ask a customer to pay, which creates a collection, and share payment links |
| [Collections](/docs/reference/collections/) | Read the result of a payment: pending, succeeded or failed |
| [Payouts](/docs/reference/payouts/) | Send money from a wallet to an M-Pesa phone number, and on other rails where enabled |
| [Payment rails](/docs/reference/rails/) | See which rails you can use, refund card payments |
| [Wallet transfers](/docs/reference/transfers/) | Move money instantly between two businesses' wallets |
| [Wallets](/docs/reference/wallets/) | Hold balances and decide where each shortcode settles |
| [Shortcodes](/docs/reference/shortcodes/) | View and configure your paybills and tills |
| [Webhook endpoints](/docs/reference/webhooks/) | Receive signed events when something happens |

## How the API works

- **REST and JSON.** Resources have predictable URLs, request and response bodies are JSON, and standard HTTP status codes tell you what happened.
- **One base URL per environment.** Your portal shows the base URL for the sandbox and for live. In the examples we write it as `$TEFO_API`.
- **Amounts are integers in the smallest unit.** `250000` is KES 2,500.00. There are no floating point amounts.
- **Timestamps** are ISO 8601 in UTC, for example `2026-10-28T08:20:04.000Z`.
- **Every object has an `id` with a short prefix**, such as `col_` for a collection, so you can tell what you are looking at.
- **`livemode`** is `false` for everything created with a sandbox key.

## Where to start

Read the [Quickstart](/docs/quickstart/) to make your first sandbox payment in about five minutes. Then read [Webhooks](/docs/webhooks/), because most results arrive as events.

The whole API is also described in an [OpenAPI file](/openapi.json) that you can import into Postman, Insomnia or a code generator.
