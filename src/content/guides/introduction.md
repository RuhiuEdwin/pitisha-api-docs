---
title: Introduction
description: What the Tefo API is and how it is laid out.
---

Tefo lets you take and send M-Pesa payments through one API and matches each payment to the sale it belongs to, by reference. Every shilling in and out has one record.

Money goes straight into your own till. Tefo records and matches payments but does not sit in the middle of your funds, so there is nothing for you to wait on.

## What you can do

| Resource | What it is for |
| --- | --- |
| [Collections](/docs/reference/collections/) | Take an M-Pesa payment and have it recorded and matched to the sale by reference |
| [Payouts](/docs/reference/payouts/) | Send money from a wallet to an M-Pesa phone number |
| [Settlements](/docs/reference/settlements/) | See where the day's money landed, and export one record |
| [Wallets](/docs/reference/wallets/) | Hold balances and decide where each shortcode settles |
| [Shortcodes](/docs/reference/shortcodes/) | View and configure your paybills and tills |
| [Webhook endpoints](/docs/reference/webhooks/) | Receive signed events when something happens |

## How the API works

- **REST and JSON.** Resources have predictable URLs, request and response bodies are JSON, and standard HTTP status codes tell you what happened.
- **One base URL per environment.** Your portal shows the base URL for the sandbox and for live. In the examples we write it as `$TEFO_API`.
- **Amounts are integers in the smallest unit.** `250000` is KES 2,500.00. There are no floating point amounts.
- **Timestamps** are ISO 8601 with a time zone.
- **Every object has an `id` with a short prefix**, such as `col_` for a collection, so you can tell what you are looking at.
- **`livemode`** is `false` for everything created with a sandbox key.

## Where to start

Read the [Quickstart](/docs/quickstart/) to make your first sandbox payment in about five minutes. Then read [Webhooks](/docs/webhooks/), because most results arrive as events.

The whole API is also described in an [OpenAPI file](/openapi.json) that you can import into Postman, Insomnia or a code generator.
