---
title: Webhooks
description: Receive signed events and verify them.
---

Most results arrive as events. When a collection succeeds, a payout is sent or a settlement lands, Pitisha sends an HTTP `POST` to your endpoint. Do not poll.

## Set up an endpoint

Add one in the portal under **Apps and keys**, or with [`POST /v1/webhook_endpoints`](/docs/reference/webhooks/). Use an HTTPS URL. The signing secret is shown once, so store it on your server.

## The event

```json
{
  "id": "evt_6h2p0q",
  "object": "event",
  "type": "collection.recorded",
  "created_at": "2026-10-28T11:20:04+03:00",
  "livemode": false,
  "data": { "object": { "id": "col_8f3k2q", "status": "succeeded", "amount": 250000 } }
}
```

| Event | When |
| --- | --- |
| `collection.recorded` | A collection succeeded and was recorded. `data.object.match` says how it matched. |
| `collection.failed` | A collection failed. `data.object.failure` has the reason. |
| `collection.matched` | A payment in the pile or with no match was matched to a sale. |
| `payout.sent` | A payout was sent. |
| `payout.failed` | A payout failed. |
| `settlement.landed` | A settlement landed in your till or account. |
| `day.closed` | A trading day was closed and its record is ready to export. |

## Verify the signature

Every request carries a `Pitisha-Signature` header:

```
Pitisha-Signature: t=1761639604,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
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

Return a `2xx` as soon as you have stored the event. Do the real work afterwards. Anything else, or no answer within 10 seconds, counts as a failure.

## Retries

Pitisha retries a failed delivery up to three times, with growing gaps. After that the event is marked failed and shows in the portal under **Webhooks**. You can [redeliver](/docs/reference/webhooks/) it from there or with the API.

## Make your handler idempotent

An event can arrive more than once, for example after a retry or a redelivery. Store the `id` of each event you have handled and ignore repeats.
