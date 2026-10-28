---
title: Fees and statements
description: How fees are worked out and how to reconcile them.
---

## How fees work

Your plan sets three prices.

- **Receiving a payment:** a percentage, with a small flat fee up to KES 100 and a minimum above that.
- **Sending to a phone or bank:** a fixed fee by amount band.
- **Sending to a business:** a fixed fee by amount band, usually higher.

The sandbox is free. Your current plan and its bands are under Pricing in the portal. When your plan changes, the new version is shown before it applies.

## The statement

`GET /v1/statement` returns one signed line per movement. A collection with a fee gives two lines with the same `reference`:

| kind | amount | description |
| --- | --- | --- |
| collection | +250000 | Payment received |
| fee | -250 | Collection fee |

Filters (`wallet_id`, `kind`, `from`, `to`) are applied on the server across all lines, not just the first page.

## Reconciling fees

`GET /v1/fees` is the statement filtered to fee lines. Sum it for a period and compare with your own records. The Fees statement in the portal shows the same lines.

## Exports

Large exports are prepared in the background. Request one under Reports and download it within 24 hours. After that the file is removed and you request it again.

## Pending too long?

Call `POST /v1/collections/{id}/query` to ask the network what happened. Do not create a second collection.
