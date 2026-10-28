---
title: Approvals and holds
description: How large payouts, bulk payments and live changes wait for a second person.
---

Some actions need two people. The person who asks cannot be the person who approves.

## What needs approval

| Action | When |
| --- | --- |
| Payout | Above your approval threshold, which you set in the portal. |
| Bulk payout | Always, once for the whole batch. |
| Scheduled payout | When the amount is above the threshold, before the schedule starts. |
| Live API changes | Changing a webhook URL or rotating a live secret. |

Sandbox changes never need approval.

## Money is held, not spent

When a payout is created, the amount and fee move from the wallet's available balance into `held`. You can see it on the wallet as `held`.

- If the payout is approved and sent, the held money leaves the wallet.
- If it is rejected or canceled, the held money returns to the available balance.

## What your code sees

A payout over the threshold comes back as `pending_approval`:

```json
{ "id": "pay_2xk9d7", "status": "pending_approval", "approval": { "required": true } }
```

Listen for these events instead of polling:

- `payout.approval_required`
- `payout.approved`, followed by `payout.sent` or `payout.failed`
- `payout.rejected`

Do not create a second payout while one waits. Retrying with the same `Idempotency-Key` returns the original.

## Who can approve

Anyone with the approve permission who is marked as an approver and did not raise the request. Approvers confirm with their transaction PIN.

## Verification comes first

Payouts stay off until your business is verified. Until then payouts fail with `verification_required`. Receiving payments is never blocked.
