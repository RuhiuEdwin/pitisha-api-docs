# Tefo API documentation

A docs product for the Tefo API: guides, a quickstart with a progress tracker, recipes, a full reference with units explained, a webhook event catalogue with a signature verifier, an error explorer, a go-live checklist, a changelog, Postman and OpenAPI downloads, search (Cmd or Ctrl K) and LLM-friendly output. Next.js static export, TypeScript, Tailwind v4, on the `docs` surface of [`pitisha-design`](../pitisha-design). Light and dark mode.

See [DESIGN.md](DESIGN.md) for the direction and [BACKEND-GAPS.md](BACKEND-GAPS.md) for what is still a placeholder or a proposal.

## Run it

```bash
npm install            # pitisha-design is vendored in vendor/pitisha-design
npm run dev            # http://localhost:3000
npm run check          # lint, typecheck, tests, build
```

To update the design system, copy `src`, `fonts` and `assets` from the pitisha-design repo into `vendor/pitisha-design`, then run `npm install`.

## One source of truth

| Source | Feeds |
| --- | --- |
| `src/content/api.ts` | Reference, enum tables, money flags, errors, events, search, OpenAPI, Postman, Markdown |
| `src/content/walkthroughs.ts` | Quickstart and the five recipes (cURL, JavaScript, Python and PHP are generated from one request) |
| `src/content/golive.ts`, `changelog.ts` | Go-live checklist and changelog, and their Markdown |
| `src/content/guides/*.md` | The guides. Add one and list it in `PAGES` in `src/lib/docs.ts` |
| `src/content/config.ts` | Base URLs, status and portal links, API version, the "Proposed" switch |

`/search-index.json`, `/openapi.json`, `/postman_collection.json`, `/llms.txt`, `/llms-full.txt` and `<page>/index.md` are all built from these at build time, so nothing is typed twice. Tests fail if a link, an enum value or an endpoint is missing from any of them.

## Configure

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_TEFO_SANDBOX_URL`, `NEXT_PUBLIC_TEFO_LIVE_URL` (the old `NEXT_PUBLIC_PITISHA_*` names still work) | Real base URLs. Unset, the docs show a placeholder. |
| `NEXT_PUBLIC_STATUS_URL` | Header "Status" link. Unset, it opens `/docs/status/`. |
| `NEXT_PUBLIC_PORTAL_URL` | "Open the portal" link on the go-live checklist |
| `NEXT_PUBLIC_DOCS_REPO_URL`, `NEXT_PUBLIC_DOCS_REPO_BRANCH` | "Edit this page" |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, `llms.txt` |

## Notes

- **Try it is simulated.** It runs in the browser, sends nothing and refuses live keys. It is labelled on every panel.
- **The endpoints and the webhook scheme are a proposal** until the backend matches (`PROPOSED` in `config.ts`).
- **Nothing here says Tefo is live, licensed or holds funds.** A test checks the generated text for that.
- Theme, environment, language, checklist ticks and "helpful" votes are saved on the visitor's device only.

## Screenshots

`scripts/screenshots.sh` captures every page type at 375px and 1440px, light and dark, into `screenshots/`.
