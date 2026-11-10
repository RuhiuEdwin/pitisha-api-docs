---
title: Authentication
description: API keys, how to send them and how to keep them safe.
---

You authenticate with an API key sent as a bearer token.

```bash
curl "$TEFO_API/v1/wallets" \
  -H "Authorization: Bearer $TEFO_SECRET_KEY"
```

## Key types

| Key | Prefix | Where it goes |
| --- | --- | --- |
| Secret key | `sk_test_`, `sk_live_` | Your server only. It can create payment requests and payouts, read transactions and wallets, manage shortcodes and webhook endpoints (in the sandbox). |

There is no publishable key. A secret key never goes in a web page or an app.

The prefix tells you the mode. A `test` key only sees sandbox data. A `live` key only sees live data. You cannot mix them.

## Keeping keys safe

- Never commit a secret key to source control, and never put it in front-end code.
- Load it from an environment variable or a secrets manager.
- Give each service its own app, so you can rotate one key without breaking the others.
- If a key may have leaked, **rotate it** in the portal under **Apps and keys**. You choose a grace window of 0 to 24 hours: the old key keeps working that long, so you can deploy the new one without downtime. With no grace window it stops at once.

## Roles

A key can do a fixed set of things: create payment requests and payouts, read transactions, wallets and events, create and read wallets and shortcodes, and manage webhook endpoints in the sandbox. It cannot approve anything, manage the team, change settings or reveal keys; those need a signed-in person in the portal. A request your key is not allowed to make returns `403 permission_denied`.

If the app has an IP allowlist, a request from another address returns `403 ip_not_allowed`. See [App security](/docs/app-security/).

## Failed authentication

A missing, wrong or revoked key returns `401 authentication_failed`. See [Errors](/docs/errors/).
