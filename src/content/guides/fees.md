---
title: Fees and statements
description: How fees are worked out and how to check them.
---

## How fees work

Fees come from the tariff assigned to your business. A tariff prices each kind of payment (for example receiving by prompt, sending to a phone, a paybill, a till or a bank) in bands of amounts, as a fixed fee or a percentage, sometimes with a minimum and a cap. The tariff in force when the money moves is the one used, and a change never applies to payments already made.

The sandbox is free: every fee is zero. Your tariff is under Pricing in the portal. If your tariff has no price for what you ask for, in live the request fails with `product_not_offered`, `recipient_not_supported` or `amount_out_of_range`.

Each collection and payout carries its `fee`, in cents.

## The statement

`GET /v1/statement` returns one signed line per movement. A collection with a fee gives two lines with the same `reference`:

| kind | amount | description |
| --- | --- | --- |
| collection | +250000 | Payment received |
| fee | -2500 | Fee |

Filters (`wallet_id`, `kind`, `from`, `to`) are applied on the server across all lines, not just the first page. `kind` is `collection`, `payout`, `settlement`, `fee`, `adjustment` or `refund`. A list also returns `totals` for everything the filters match.

## Checking fees

`GET /v1/fees` is the statement filtered to fee lines. Sum it for a period and compare with your own records. The Fees statement in the portal shows the same lines.

## Exports

Large exports are prepared in the background. Request one under Reports and download it within 24 hours. After that the file is removed and you request it again.

## Pending too long?

Call `POST /v1/collections/{id}/query` to ask the network what happened. Do not create a second collection.
