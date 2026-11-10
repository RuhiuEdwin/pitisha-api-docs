---
title: Wallet transfers
description: Send money instantly between two businesses' wallets.
---

A transfer moves money from one of your wallets to another business's wallet. It is a single entry inside Tefo, so no M-Pesa or bank call is made and it is instant. The fee comes from your tariff and is free by default.

## Look up, then send

1. [`GET /v1/wallets/lookup?number=...`](/docs/reference/transfers/) tells you the business name and a masked number for a wallet number of 6 to 12 digits. Check the name before you send.
2. [`POST /v1/transfers`](/docs/reference/transfers/) with `from_wallet_id`, `to_merchant_number`, `amount` (cents) and an `Idempotency-Key`.

```bash
curl -X POST "$TEFO_API/v1/transfers" \
  -H "Authorization: Bearer $TEFO_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: inv-77-transfer" \
  -d '{ "from_wallet_id": "wal_main", "to_merchant_number": "10045678", "amount": 500000, "reference": "INV-77" }'
```

## What to know

- Lookups are rate limited per business (10 a minute, 20 misses an hour) so wallet numbers cannot be guessed. A refused request still counts.
- A wallet that does not exist, or is frozen or suspended, answers `404 recipient_not_found`. You cannot tell which.
- Sandbox and live are separate: a sandbox number never reaches a live wallet.
- Every wallet has a `number`. Share it with the business that wants to pay you; they look it up before they send.
- Above your approval threshold the transfer is `pending_approval`, the money is held and a second person decides. If the recipient cannot receive when it is approved, you get `recipient_unavailable`; reject it to release the hold.
- You see the other side as a business name and a masked wallet number, never a wallet id.

## Events

`transfer.approval_required`, `transfer.sent` (to you as sender), `transfer.received` (to the recipient), and `transfer.failed` (rejected or canceled). See the [event catalogue](/docs/webhook-events/).
