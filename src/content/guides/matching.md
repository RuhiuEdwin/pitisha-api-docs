---
title: Matching
description: How a payment is matched to a sale, and what to do when it is not.
---

Every payment that arrives is checked against your sales and lands in one of three places. The result is on the collection as `match.state`.

| State | What it means | What you do |
| --- | --- | --- |
| `matched` | The payment agrees with exactly one sale. | Nothing. It is recorded against that sale. |
| `pile` | More than one sale could fit. | Choose the right one. |
| `no_match` | Money came in and no sale fits it. | Find the sale, or look into the payment. |

## Example

KES 3,150 arrives. You have two orders of KES 3,150 from that morning. Pitisha cannot know which one it paid for, so it goes to the pile rather than guessing.

```json
{
  "id": "col_8f3k2q",
  "amount": 315000,
  "match": { "state": "pile", "candidate_sale_ids": ["sale_1042", "sale_1043"] }
}
```

## Resolving a payment

Send the sale it belongs to:

```bash
curl -X POST "$PITISHA_API/v1/collections/col_8f3k2q/match" \
  -H "Authorization: Bearer $PITISHA_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: match-col_8f3k2q" \
  -d '{ "sale_id": "sale_1042" }'
```

The collection becomes `matched` and a `collection.matched` event is sent.

## Staying out of the pile

The pile is a to-do list, not an error. You can shrink it:

- Give each customer a unique `reference` per order, for example the invoice number, and use paybills with account number validation.
- Send the order id in `metadata`.
- Keep amounts and references in your sales record consistent with what you send to Pitisha.

## Counting

[`GET /v1/day-closes/{day}`](/docs/reference/settlements/) gives the day's `matched`, `pile` and `no_match` counts, and a CSV export for your accountant. You can also list the pile with `GET /v1/collections?match_state=pile`.
