---
title: Status
description: Where to check whether Tefo is working, and what to do when a payment looks stuck.
---

There is no public status page yet. This page will link to it when it exists.

## Until then

- Every error has a `request_id`. Log it, and quote it when you contact support.
- Check **Webhooks** in the partners portal for deliveries that failed, and [redeliver](/docs/reference/webhooks/) them once your endpoint is healthy.
- A collection that stays `pending` can be checked with [`POST /v1/collections/{id}/query`](/docs/reference/collections/) instead of creating a second one.
- `503 service_stopped` means Tefo has paused one transaction type for everyone. Retry with the same `Idempotency-Key` after a few minutes. Nothing was created. See [Errors](/docs/errors/).
