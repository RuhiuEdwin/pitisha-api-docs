---
title: Pagination
description: Walking through long lists.
---

List endpoints return the newest items first, in pages.

```json
{
  "object": "list",
  "data": [ { "id": "col_8f3k2q" } ],
  "has_more": true,
  "next_cursor": "cur_9fK2mQ"
}
```

| Parameter | Meaning |
| --- | --- |
| `limit` | Items per page, 1 to 100. Defaults to 20. |
| `starting_after` | Pass the previous response's `next_cursor` to get the next page. |

Keep requesting with `starting_after` until `has_more` is `false`.

```javascript
let cursor;
const all = [];
do {
  const url = new URL(`${process.env.PITISHA_API}/v1/collections`);
  url.searchParams.set("limit", "100");
  if (cursor) url.searchParams.set("starting_after", cursor);
  const page = await (await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.PITISHA_SECRET_KEY}` },
  })).json();
  all.push(...page.data);
  cursor = page.has_more ? page.next_cursor : undefined;
} while (cursor);
```

Cursors are opaque and expire after an hour. Do not build or store them.
