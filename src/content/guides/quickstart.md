---
title: Quickstart
description: Make your first sandbox payment in five minutes.
---

You will create a sandbox app, collect a test payment and read the result. Nothing here moves real money.

## 1. Get a sandbox key

In the partners portal, switch to **Sandbox**, open **Apps and keys** and create an app. Copy the secret key. It starts with `sk_test_`. Keep it on your server, never in a browser or a mobile app.

```bash
export PITISHA_API="your sandbox base URL from the portal"
export PITISHA_SECRET_KEY="sk_test_..."
```

## 2. Collect a payment

Ask a customer to pay KES 2,500 to your sandbox paybill. The `Pitisha-Sandbox-Scenario` header makes the sandbox succeed or fail on command.

```bash
curl -X POST "$PITISHA_API/v1/collections" \
  -H "Authorization: Bearer $PITISHA_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: quickstart-1" \
  -H "Pitisha-Sandbox-Scenario: success" \
  -d '{
    "amount": 250000,
    "currency": "KES",
    "source": "paybill",
    "customer": { "phone": "+254712000000" },
    "reference": "INV-204117"
  }'
```

The response has `"status": "pending"`. The customer has been asked to approve the payment.

## 3. Read the result

In the sandbox the customer approves right away. Fetch the collection:

```bash
curl "$PITISHA_API/v1/collections/COLLECTION_ID" \
  -H "Authorization: Bearer $PITISHA_SECRET_KEY"
```

You should see `"status": "succeeded"` and a `match` object telling you how the payment matched your sales.

In your own code you would not poll. Pitisha sends a `collection.recorded` webhook, which is covered in [Webhooks](/docs/webhooks/).

## 4. Try a failure

Change the header to `Pitisha-Sandbox-Scenario: insufficient_funds` and repeat step 2 with a new `Idempotency-Key`. The collection ends as `failed` and `failure.code` says why. See [Sandbox and testing](/docs/sandbox/) for every scenario.

## Next

- Verify webhook signatures: [Webhooks](/docs/webhooks/)
- Understand `match`: [Matching](/docs/matching/)
- Make retries safe: [Idempotency](/docs/idempotency/)
- Browse every endpoint in the [API reference](/docs/reference/collections/)
