---
title: Errors
description: The error object, status codes and what to do about each.
---

Pitisha uses standard HTTP status codes. Anything outside the 200s means the request did not do what you asked.

## The error object

```json
{
  "error": {
    "code": "invalid_request",
    "message": "amount must be a positive integer.",
    "param": "amount",
    "request_id": "req_4k2m9x"
  }
}
```

| Field | Meaning |
| --- | --- |
| `code` | A stable machine-readable string. Branch on this, not on `message`. |
| `message` | A human explanation. It can change, so do not parse it. |
| `param` | The field at fault, when there is one. |
| `request_id` | Quote this when you contact support. |

## Codes

| Code | Status | What it means | What to do |
| --- | --- | --- | --- |
| `invalid_request` | 400 | A parameter is missing or the wrong shape. | Read `error.param` and fix that field. |
| `authentication_failed` | 401 | The API key is missing, wrong or revoked. | Check you send `Authorization: Bearer` and use the key for the right mode. |
| `permission_denied` | 403 | Your key or role cannot do this. | Use a key with the access you need, or ask an owner. |
| `not_found` | 404 | The object does not exist in this mode. | Check the id, and that you are not mixing sandbox and live ids. |
| `idempotency_conflict` | 409 | The Idempotency-Key was used with different parameters. | Use a new key for a different request. |
| `insufficient_funds` | 422 | The wallet cannot cover the amount plus the fee. | Top up the wallet or lower the amount. |
| `wallet_frozen` | 422 | The wallet is frozen. | Unfreeze it in the portal or with `PATCH /v1/wallets/{id}`. |
| `shortcode_inactive` | 422 | The shortcode is pending or suspended. | Wait for it to become active, or use another shortcode. |
| `rate_limited` | 429 | Too many requests. | Wait for the seconds in the `Retry-After` header. |
| `api_error` | 500 | Something went wrong on our side. | Retry with the same Idempotency-Key. If it persists, contact support with the request id. |

## Failed payments are not errors

A customer declining a payment is a normal result. The request succeeds with `201`, and the collection later ends as `failed` with a `failure` object. Handle it from the `collection.failed` webhook.
