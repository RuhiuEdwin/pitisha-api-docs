# Tefo design system: DESIGN.md

One identity, one source of truth, four apps (landing, partners portal, admin portal, API docs).

## Idea
Deep teal night, ivory page, one mint line for money in motion.
`night` is the deep teal, `ivory` is the page, **`gold` (mint/aqua) is money in motion**, **`sky` (mist) is the rails**, **red is only ever a failure**. The names `gold` and `sky` are historical; the values are in `src/tokens.css`.

## Rules that never bend
1. `src/tokens.css` is the only place a value is defined. `tokens.ts`, the Tailwind `@theme`, and `TOKENS.md` are generated from it or checked against it.
2. Three surfaces, switched by `data-surface` (`marketing` | `app` | `docs`) and `data-theme` (`light` | `dark`). Defaults: marketing is dark, app and docs are light.
3. Status is always icon plus word, never colour alone. Red appears only for failures.
4. Every number is money in integer cents (`Money`), tabular, never a float.
5. 44px minimum targets, visible focus (>= 2px, 3:1), full keyboard use, reduced motion respected (motion tokens go to ~0).
6. No runtime CSS-in-JS. Plain CSS variables and `pd-` classes. Components ship as TypeScript source.
7. Nothing here changes what an app does. It changes how it looks and how consistently it behaves.

## Surfaces
| Surface | Feel | Body | Default theme |
| --- | --- | --- | --- |
| marketing | big light type, skyline | 17px | dark |
| app | ivory canvas, navy sidebar, dense | 14px | light |
| docs | readable, 68ch measure | 15px | light |

## Not in scope
The landing page layout and scroll choreography (GSAP/Lenis; the landing uses only `fonts.css` and the font files from this package), charts (Recharts stays in the portals), and anything about backend behaviour.
