---
title: Authentication
description: API keys, how to send them and how to keep them safe.
---

You authenticate with an API key sent as a bearer token.

```bash
curl "$PITISHA_API/v1/wallets" \
  -H "Authorization: Bearer $PITISHA_SECRET_KEY"
```

## Key types

| Key | Prefix | Where it goes |
| --- | --- | --- |
| Publishable key | `pk_test_`, `pk_live_` | Safe to put in a web page or app. It can only start a payment flow you have already set up on your server. It cannot read data. |
| Secret key | `sk_test_`, `sk_live_` | Your server only. It can do everything your role allows. |

The prefix tells you the mode. A `test` key only sees sandbox data. A `live` key only sees live data. You cannot mix them.

## Keeping keys safe

- Never commit a secret key to source control, and never put it in front-end code.
- Load it from an environment variable or a secrets manager.
- Give each service its own app, so you can rotate one key without breaking the others.
- If a key may have leaked, **rotate it** in the portal under **Apps and keys**. The old key keeps working for 24 hours so you can deploy the new one without downtime.

## Roles

Keys act with the permissions of the app that owns them. People in the portal have roles of their own. For example, only owners and developers can reveal and rotate keys. A request your key is not allowed to make returns `403 permission_denied`.

## Failed authentication

A missing, wrong or revoked key returns `401 authentication_failed`. See [Errors](/docs/errors/).
