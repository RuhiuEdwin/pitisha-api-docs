---
title: Introduction
description: What the Pitisha API is and how it is laid out.
---

Pitisha is one integration for every way Kenyans pay, and one record of every shilling, in and out. You call one API. Pitisha handles the till, paybill, QR, bank and mobile money rails behind it, and keeps a single record of what came in and what went out.

Money goes straight into your own till. Pitisha records and matches payments but does not sit in the middle of your funds, so there is nothing for you to wait on.

## What you can do

| Resource | What it is for |
| --- | --- |
| [Collections](/docs/reference/collections/) | Take a payment from any source and have it recorded and matched to the sale |
| [Payouts](/docs/reference/payouts/) | Send money to a phone or a bank account from a wallet |
| [Settlements](/docs/reference/settlements/) | See where the day's money landed, and export one record |
| [Wallets](/docs/reference/wallets/) | Hold balances and decide where each shortcode settles |
| [Shortcodes](/docs/reference/shortcodes/) | View and configure your paybills and tills |
| [Webhook endpoints](/docs/reference/webhooks/) | Receive signed events when something happens |

## How the API works

- **REST and JSON.** Resources have predictable URLs, request and response bodies are JSON, and standard HTTP status codes tell you what happened.
- **One base URL per environment.** Your portal shows the base URL for the sandbox and for live. In the examples we write it as `$PITISHA_API`.
- **Amounts are integers in the smallest unit.** `250000` is KES 2,500.00. There are no floating point amounts.
- **Timestamps** are ISO 8601 with a time zone.
- **Every object has an `id` with a short prefix**, such as `col_` for a collection, so you can tell what you are looking at.
- **`livemode`** is `false` for everything created with a sandbox key.

## Where to start

Read the [Quickstart](/docs/quickstart/) to make your first sandbox payment in about five minutes. Then read [Webhooks](/docs/webhooks/), because most results arrive as events.

The whole API is also described in an [OpenAPI file](/openapi.json) that you can import into Postman, Insomnia or a code generator.
