---
title: Webhooks
description: Receive signed events and verify them.
---

Most results arrive as events. When a collection succeeds or a payout goes through, Tefo sends an HTTP `POST` to your endpoint. Do not poll.

## Set up an endpoint

Add one in the portal under **Apps and keys**, or in the sandbox with [`POST /v1/webhook_endpoints`](/docs/reference/webhooks/). Use a public HTTPS URL: private and internal addresses are refused. The signing secret is shown once, so store it on your server. In live a signed-in person adds the endpoint and a second person approves it; an API key cannot create one.

## The event

```json
{
  "id": "evt_6h2p0q",
  "object": "event",
  "type": "collection.recorded",
  "created_at": "2026-10-28T08:20:04.000Z",
  "livemode": false,
  "data": { "object": { "id": "col_8f3k2q", "status": "succeeded", "amount": 250000 } }
}
```

| Event | When |
| --- | --- |
| `collection.recorded` | A collection succeeded and was recorded. |
| `collection.failed` | A collection failed. `data.object.failure` has the reason. |
| `collection.reversed` | A collection that had succeeded was reversed. |
| `payout.pending`, `payout.sent`, `payout.failed` | A payout was accepted and is with the network, went through (`status` is `succeeded`) or failed. |
| `payout.approval_required`, `payout.approved`, `payout.rejected` | A payout is waiting for a second person, was approved, or was rejected. |
| `transfer.sent`, `transfer.received`, `transfer.failed`, `transfer.approval_required` | A [wallet transfer](/docs/transfers/) completed, arrived, was rejected or canceled, or is waiting for approval. |
| `payout_batch.complete`, `schedule.run_failed` | A bulk payout or a scheduled payment made in the portal finished or failed to run. |

When you create an endpoint you can name only the types that are not marked in the [event catalogue](/docs/webhook-events/). Leave `events` empty to receive every event, including `collection.reversed`, `payout.pending`, `payout_batch.complete` and `schedule.run_failed`.

## Verify the signature

Every request carries a `Tefo-Signature` header, plus `Tefo-Event` (the event type) and `Tefo-Delivery` (the delivery id):

```
Tefo-Signature: t=1761639604,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

To verify it:

1. Split the header on commas to get the timestamp `t` and the signature `v1`.
2. Build the signed string: the timestamp, a full stop, then the **raw request body**, exactly as received.
3. Compute an HMAC-SHA256 of that string with your signing secret, as hex.
4. Compare it to `v1` using a constant-time comparison.
5. Reject the request if `t` is more than five minutes old. This stops replays.

Use the raw body. If your framework parses the JSON first and you serialise it again, the bytes change and the signature will not match.

```javascript
import crypto from "node:crypto";

export function verify(rawBody, header, secret) {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")));
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parts.t}.${rawBody}`)
    .digest("hex");
  const ok =
    expected.length === parts.v1.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  const fresh = Math.abs(Date.now() / 1000 - Number(parts.t)) < 300;
  return ok && fresh;
}
```

```python
import hmac, hashlib, time

def verify(raw_body: bytes, header: str, secret: str) -> bool:
    parts = dict(p.split("=", 1) for p in header.split(","))
    signed = f"{parts['t']}.".encode() + raw_body
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    fresh = abs(time.time() - int(parts["t"])) < 300
    return hmac.compare_digest(expected, parts["v1"]) and fresh
```

## Respond fast

Return a `2xx` as soon as you have stored the event. Do the real work afterwards.

## Retries

Anything but a `2xx` within 10 seconds counts as a failure. Tefo retries a failed delivery six times: 1 minute, 5 minutes, 30 minutes, 2 hours, 6 hours and 24 hours after the previous attempt. After the last retry it stops, the delivery is marked failed and it shows in the portal under **Webhooks**. You can [redeliver](/docs/reference/webhooks/) the event from there or with `POST /v1/events/{id}/redeliver`. The same event `id` is sent every time.

## Make your handler idempotent

An event can arrive more than once, for example after a retry or a redelivery. Store the `id` of each event you have handled and ignore repeats.
