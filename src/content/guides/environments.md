---
title: Sandbox and live
description: How the two modes differ and how live access is enabled.
---

Tefo has two modes. Build in the sandbox, then switch to live when you are ready.

| | Sandbox | Live |
| --- | --- | --- |
| Keys | `sk_test_` | `sk_live_` |
| Money | None. Everything is simulated. | Real payments and payouts. |
| Data | Test data you can create freely. | Your real records. |
| Access | Immediately, from the portal. | Requested in the portal and reviewed before it is enabled. |
| Failures | You can force them on command. | Real customers, real outcomes. |

Objects never cross between modes. A sandbox collection id returns `404 not_found` against a live key.

## Getting live access

1. In the portal, open an app in the sandbox and work through the go-live checklist.
2. Choose **Request live access**.
3. Tefo reviews the request and a second person approves it. The portal shows the status: onboarding, in review, then live.
4. Once it is enabled, create a live app and use its keys.

See [Go live](/docs/go-live/) for the checklist in full.
