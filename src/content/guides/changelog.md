---
title: Changelog
description: What changed in the API.
---

## 2026-10-29

- Payouts can be `pending_approval` or `rejected`, hold money on the wallet, and carry an `approval` object. New events `payout.approval_required`, `payout.approved`, `payout.rejected`.
- Wallets gain `held` and `status`.
- New: payment requests, payment links, bulk payouts, `/v1/statement`, `/v1/fees` and `POST /v1/collections/{id}/query`.
- New errors `verification_required` and `service_stopped`.
- New guides: Approvals and holds, Fees and statements.

## 2026-10-28

First version of the documentation.

- Collections, payouts, settlements, wallets, shortcodes, webhook endpoints, events and sandbox tools.
- Webhook signature scheme `v1` (HMAC-SHA256 over timestamp and raw body).
- Matching states `matched`, `pile` and `no_match`, and the `routing` object on collections.
