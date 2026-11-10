---
title: App security
description: IP allowlist, default callback URL and result URLs.
---

Each app (a set of API keys) has security settings. They are changed by people in the partners portal, with a signed-in session, not with an API key. A key cannot change them.

## IP allowlist

Limit an app's keys to your servers. Add up to 20 IPv4 or IPv6 addresses or CIDR ranges. An empty list means any address. A request from another address fails with `403 ip_not_allowed`.

In live, a change to the allowlist waits for a second team member to approve it, unless your business turned off approvals for app changes. The portal calls these endpoints (they need a signed-in user and, where asked, a PIN):

| Endpoint | Does |
| --- | --- |
| `GET /v1/apps/{id}/security` | Shows the allowlist, callback URL and live keys of an app |
| `PUT /v1/apps/{id}/ip_allowlist` | Sets the allowlist (`ips`) |
| `PUT /v1/apps/{id}/callback_url` | Sets or clears the app's default callback URL |
| `POST /v1/apps/{id}/rotate` | Rotates the credentials, with an optional grace window of 0 to 24 hours |
| `POST /v1/apps/{id}/revoke` | Revokes the app and all its keys at once |

## Result URL and the default callback URL

A collection stores a `result_url`. Send `result_url` when you create the payment, or leave it out and Tefo uses the app's **default callback URL**. If neither is set, `result_url` is `null`. In live it must be https, and private or internal addresses are refused.

Results reach your server as signed [webhooks](/docs/webhooks/); verify those, and do not trust an unsigned request to your result URL.
