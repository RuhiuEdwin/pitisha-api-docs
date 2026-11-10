# tefo-design

The shared design system for Tefo (Zyra Tech): tokens, three surfaces, React primitives and brand assets. One source of truth for the landing page, the partners portal, the admin portal and the API docs. See [DESIGN.md](DESIGN.md) for the idea and the rules, [TOKENS.md](TOKENS.md) for every value with measured contrast, and [MIGRATION.md](MIGRATION.md) for what each app deletes.

## What is in it

| Path | What |
| --- | --- |
| `src/tokens.css` | **Source of truth.** Primitives, then roles per surface and theme, then reduced motion. |
| `src/theme.css` | Tailwind v4 `@theme inline`. Keeps the portals' class names (`bg-night`, `text-gold`, `text-err`) and adds role names (`bg-canvas`, `text-fg-muted`). |
| `src/tokens.ts` | **Generated** from `tokens.css` (`npm run tokens`). Same values for TypeScript, charts and tests. |
| `src/fonts.css`, `fonts/` | IBM Plex Sans (300, 400, 500, 600) and Mono (400, 500). Latin subset, WOFF2, about 60 KB in all, `font-display: swap`. OFL licence included. |
| `src/base.css` | Applies the surface to the page, focus ring, type roles (`pd-display`, `pd-h1`, `pd-num`), docs prose, global reduced motion. |
| `src/components.css` | Styles for every primitive. Plain CSS on the tokens. No CSS-in-JS. |
| `src/components/`, `src/lib/` | React primitives and the pure logic behind them (money, table, navigation, sparkline). |
| `assets/` | Logo mark and lockups, favicon set, web manifest, Open Graph default, Nairobi skyline SVG, rails and signal-line illustration. |
| `reference/` | The reference page: every token and component in every surface and theme. `npm run reference`. |
| `screenshots/` | The reference page at 375px and 1440px. `npm run reference` then `scripts/screenshots.sh`. |

## Surfaces and themes

```html
<html lang="en" data-surface="app" data-theme="light">
```

| `data-surface` | For | Default theme |
| --- | --- | --- |
| `marketing` | landing page: dark, cinematic, 17px body, light bands allowed | dark |
| `app` | portals: ivory canvas, navy sidebar, dense, 14px body | light |
| `docs` | API docs: readable, 15px body, 68ch measure | light |

`data-theme="light|dark"` can go on `<html>` or on any element inside it, so a light band inside the dark landing page is `<section data-theme="light" class="pd-scope">`. Theme is chosen by the app (a toggle, a saved choice). The system does not switch on `prefers-color-scheme` by itself.

Motion follows the person: under `prefers-reduced-motion: reduce`, or inside `[data-motion="reduce"]`, durations collapse to ~0 and nothing loops.

## Install

The package is TypeScript source plus CSS. It has no build step, so any install method that copies the folder works.

**Local development, next to the apps** (what the partners-portal pilot uses):

```bash
# in the app
npm install ../tefo-design --install-links
```

`--install-links` copies the package instead of symlinking it. Turbopack refuses CSS that resolves outside the app's folder, so a symlink fails the build ("outside configured roots"). Put `install-links=true` in the app's `.npmrc` to make it permanent. After you change the design package, run `npm install` in the app again to refresh the copy.

**Vercel and CI** (the sibling folder does not exist there, so `file:../tefo-design` will not install):

```json
"tefo-design": "github:<org>/tefo-design#v0.1.0"
```

A git dependency installs cleanly because there is no `prepare` or build script, so npm does not need the package's dev dependencies. It was not possible to test a Vercel deploy from this session. If the repo is private, Vercel needs credentials to clone it; the usual route is to publish the package to a private registry and put `//registry.example/:_authToken=${NPM_TOKEN}` in `.npmrc`. Pin to a tag, never a branch.

## Use it

**Next.js with Tailwind v4** (partners portal, admin portal, docs):

```ts
// next.config.ts
const nextConfig = { transpilePackages: ["tefo-design"] };
```
```css
/* globals.css */
@import "tailwindcss";
@import "tefo-design/styles.css";
@import "tefo-design/theme.css";
```
```tsx
// layout.tsx
<html lang="en" data-surface="app" data-theme="light">
```
```tsx
import { AppShell, Money, StatusPill, Table } from "tefo-design";
```

**Vite** (landing page; CSS only is enough):

```js
import "tefo-design/styles.css";
```
```html
<html data-surface="marketing">
```

Components that use state, effects or browser APIs (`AppShell`, `Table`, `Dialog`, `ToastProvider`, `CodeBlock`) start with `"use client"`, so they can be imported from a server component.

## Primitives

| Component | Notes |
| --- | --- |
| `Money` | `cents` (number, bigint or digit string) to `KES 1,500.00`. Throws on fractional cents. Tabular figures. `formatMoney`, `majorString` (for CSV) and `parseKes` (for inputs) are exported too. |
| `StatusPill` | `matched`, `pile`, `no_match`, `pending`, `failed`. Icon plus word always. Red only for `failed`. Meanings and next steps are in `STATUS`. |
| `Table` | Sort, search, column control, pagination, CSV export, loading and empty states, keyboard-focusable scroll region, `aria-sort`. CSV cells that start with `= + - @` are neutralised. |
| `KpiTile` | Label, value, one plain sentence saying how the number is worked out, trend with arrow and words, optional chart and action. |
| `Sparkline` | SVG with a text alternative (low, high, latest). A line only; use a table next to it for exact values. |
| `Timeline` | Each step has an icon and a word (Done, In progress, Waiting, Failed). |
| `EmptyState`, `Skeleton` | Empty states say what is going on and what happens next. Skeletons are hidden from assistive tech; set `aria-busy` on the region. |
| `Dialog` | Native `<dialog>`: focus trap, Escape, focus return. `variant="drawer"` for detail views and the mobile menu. |
| `ToastProvider`, `useToast` | Polite live region. Failures stay until dismissed. Timers pause on hover and focus. |
| `Field`, `Input`, `Select`, `Textarea` | Wires label, hint and error to the control. Errors read "Problem: ..." so they are not colour alone. |
| `Button` | `primary`, `accent`, `secondary`, `ghost`, `danger`. 44px target (small buttons are 36px with a 44px hit area). Renders an anchor when given `href`. |
| `CodeBlock` | Tabs, copy with spoken confirmation, scrollable by keyboard. Pass `highlighted` per tab to use Shiki. |
| `DemoBanner` | Always visible. Not dismissible, on purpose. |
| `AppShell` | Sidebar groups, top bar, command palette (Ctrl or Cmd K), mobile drawer under 1024px, role-aware navigation (`userRole` hides items; the server must still enforce permissions). Pass `Link` (next/link) and `onNavigate` (router.push). |

## Scripts

```bash
npm run tokens          # regenerate src/tokens.ts and TOKENS.md from tokens.css
npm run assets          # rasterise favicons, manifest and og-default.png from assets/*.svg
npm run lint
npm run typecheck
npm test                # logic, contrast (fails if any pair drops below WCAG AA), generated-file sync, server rendering
npm run reference       # http://127.0.0.1:5199
npm run reference:build
npm run check           # all of the above
```

`assets/logo-lockup*.svg`, `nairobi-skyline.svg`, `rails-signal-line.svg` and `og-default.svg` come from `scripts/make-svg-assets.py` (text is converted to outlines so it renders the same everywhere). The output is committed; only change it if you are changing the artwork.

## Changing a token

1. Edit `src/tokens.css` only.
2. `npm run tokens`. If a contrast pair now fails, it exits with an error and names the pair.
3. `npm test`.
4. Bump the version and tag. Apps move by changing the tag.
