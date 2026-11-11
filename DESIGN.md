# Tefo API docs: DESIGN.md

A docs product, not a marketing page. It uses the `docs` surface of `tefo-design` and nothing else for colour, type and focus.

## Idea
The API is a quiet instrument panel. Ivory page, night code. **Gold marks money and the one thing to do next**, **sky marks the rails** (links in dark mode), **red is only a failure**. Every status is an icon plus a word.

## Direction
- **Concept**: a reference you can trust at 2 a.m. with a failing payment. Answers first, decoration never.
- **Mood**: precise, calm, unhurried. Avoid: "startup hero".
- **Type**: the `tefo-design` faces (DM Sans for prose, Fraunces for display) and IBM Plex Mono for every value you could type. Body 15px, 68ch measure.
- **Colour**: ivory canvas (light) or night (dark) with night-coloured code blocks in both. Gold for money callouts and the active tab. Contrast is checked by the design package.
- **Signature move**: every money field carries a live "cents to shillings" explainer, and every code sample has a Try it that says plainly it is simulated.

## Layout
Three columns from 1024px: navigation (260px), content (readable column), on this page (220px). Under 1024px the navigation opens as a drawer and the on-this-page list becomes a collapsed disclosure at the top of the article. Header: logo, environment switcher, search (Cmd/Ctrl K), status, theme.

## Page types
| Type | Route | Notes |
| --- | --- | --- |
| Home | `/` | Hero request panel, paths by job |
| Guide | `/docs/<slug>/` | Markdown, with a widget for errors and go-live |
| Quickstart | `/docs/quickstart/` | Progress tracker (saved on this device), four languages |
| Recipes | `/docs/recipes/`, `/docs/recipes/<id>/` | Goal, steps, expected result |
| Reference | `/docs/reference/<resource>/` | Object, endpoints, fields with units and enum tables, Try it |
| Webhook events | `/docs/webhook-events/` | Catalogue with payloads and a signature verifier |
| Errors | `/docs/errors/` | Explorer: code, meaning, cause, fix |
| Changelog, status, downloads | `/docs/changelog/`, `/docs/status/`, `/docs/downloads/` | |

## Rules specific to docs
1. One source of truth. `src/content/api.ts` (reference, enums, errors, events), `src/content/*.ts` (quickstart, recipes, checklist, changelog) and `src/content/guides/*.md` feed the pages, the search index, the OpenAPI file, the Postman collection, `llms.txt` and the per-page Markdown. Nothing is typed twice.
2. All environment values come from `src/content/config.ts`. A base URL that is not set is shown as a placeholder, never invented.
3. "Proposed" is shown wherever the README says it: the endpoints and the webhook scheme, until the backend matches. Nothing says Tefo is live, licensed or holds money.
4. Try it is labelled **Simulated** every time. It never sends a request and never accepts a live key.
5. Pages are static. No layout shift: code panels reserve their height, the theme is set before paint.
6. WCAG 2.2 AA: skip link, landmarks, visible focus, search and code tabs are fully keyboard operable (arrow keys, Home, End), reduced motion respected, targets 44px.

## Not in scope
A real sandbox URL, a feedback endpoint and a public status page do not exist yet. See `BACKEND-GAPS.md`.
