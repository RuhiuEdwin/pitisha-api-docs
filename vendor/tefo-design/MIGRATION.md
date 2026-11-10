# Migration

How the four apps' CSS was reconciled, and what each app deletes when it adopts `tefo-design`. Only the partners portal has been migrated (the pilot). The others are described here and not touched.

## What was found

I read both portals' `src/app/globals.css` (57 lines each) and `tefo-api-docs/src/app/globals.css` in full, and only the first 140 lines of `tefo-landing/src/styles.css` (560 lines; see the landing section).

| Question | Finding | Decision |
| --- | --- | --- |
| Are the two portals' CSS the same? | Yes. `diff` shows no difference. | One theme serves both. |
| Do the portals "match the landing page"? | By copy, not by construction. Same hexes, different names (`--night` vs `--color-night`). | Hexes kept, names unified under `--pd-*`. Tailwind names the portals use are kept in `theme.css`. |
| Landing `--text` vs portal `--color-ink` | Same `#0A1628`. | `--pd-ink-900`; role `--pd-fg`. |
| Landing `--muted-l` vs portal `--color-muted` | Same `#46566B`. | `--pd-slate-600`; role `--pd-fg-muted`. |
| Landing `--line-l` vs portal `--color-line` | Same `#D3DAE6`. | `--pd-ivory-300`; role `--pd-border`. |
| Night line on dark: landing `.16`, portal `.12` | Differ. | `.16` (the landing's, which is the stronger, more visible hairline). `--color-line-d` now resolves to it, a small visible change on the portals' sidebar dividers. |
| Landing `--muted-d` `#D0DAE8` | Landing only. | `--pd-ivory-400`, role `--pd-fg-muted` on dark. |
| Landing `--err-d` `#FFA498` and `--err-fill` `#B3261E` vs portal `--color-err` `#8A1008` | Different jobs: failure text on dark, red fill, failure text on light. | Three red primitives (`red-300`, `red-600`, `red-700`), picked by role (`--pd-err` follows the theme). |
| Portal `ok`, `warn` and their tints | Portals and docs only. | Kept (`green-700/100`, `amber-700/100`), plus dark-theme pairs that the apps did not have. |
| Gold `#E3BF74`, `gold-d` `#8A6420`, sky `#8DB9FF` | Same everywhere. | Kept. Added `sky-700` `#1F4F96`: sky on ivory is far below 4.5:1, so links on light needed a darker blue. |
| Radii: landing 14 and 20, portal 14 | Agree. | `radius-md` 14, `radius-lg` 20, plus `sm` 10 and `xs` 6 for controls and code. |
| Focus ring: landing 3px, offset 3px, ink or gold; portals and docs 2px, offset 2px, ink | Differ. | 3px on marketing, 2px on app and docs, offset 2px, ink on light and gold on dark. All at least 3:1 (see TOKENS.md). |
| Body type: landing 17px, portals 14px, docs 15px | By design. | Per surface: `--pd-body-size`. |
| Spacing: landing `--s1`..`--s9`; portals use Tailwind's scale | Different systems. | The landing ramp became `--pd-space-*` (4px base). Tailwind's own spacing is unchanged. |
| Breakpoints: landing uses 800, 900 and 1000px; Tailwind defaults elsewhere | Inconsistent. | `sm` 640, `md` 768, `lg` 1024, `xl` 1280, the Tailwind defaults. The landing's media queries can move to these as it is touched. |
| Reduced motion | Portals and docs each had a copy of the same rule. Landing handles its own (GSAP). | One rule in `base.css` for anything inside a `data-surface`. |
| Fonts | Each app imports six `@fontsource` CSS files (full Latin set). | One self-hosted, subset set in this package. |
| `.num` (portals), `.mono` and `.vh` (landing), `.skip` (landing) | Same ideas, different names. | `pd-num`, `pd-mono`, `pd-vh`, `pd-skip`. |
| Docs `.prose` | Docs only. | `pd-prose` in `base.css`, token-based, light and dark. |
| Docs code block | Always night. | `CodeBlock` and `--pd-code-*` (night in both themes). |

## Partners portal (done, the pilot)

Changed:

- `package.json`: added `"tefo-design": "file:../tefo-design"`, removed `@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-mono`.
- `.npmrc`: `install-links=true` (see README: Turbopack rejects symlinked CSS).
- `next.config.ts`: `transpilePackages: ["tefo-design"]`.
- `src/app/layout.tsx`: deleted the six `@fontsource` imports; `<html data-surface="app" data-theme="light">`.
- `src/app/globals.css`: deleted the `@theme` block, `html { color-scheme }`, `body` rules, `:focus-visible`, and the reduced-motion rule. It is now three imports and `.num`.

Kept on purpose, so the pilot changes how it looks and not how it behaves: every component in `src/components/ui` and `src/components/layout`, `lib/money.ts`, `lib/format.ts`, the Tailwind class names, and the `.num` class.

Visible differences to expect: `--color-line-d` is now `.16` instead of `.12` alpha; the 2px focus ring is unchanged; fonts are the subset files (same glyphs for Latin text; characters outside the subset fall back to the system font, so check any text with accents or symbols not in ASCII and common punctuation).

Verified: `npm run lint`, `npx tsc --noEmit` and `npm run build` pass. The login page renders with the new fonts, 14px body and `data-surface="app"`. Pages behind sign-in need the backend running and were not exercised.

Next, in this app, in this order (each is safe on its own):

1. Replace `components/ui/badge.tsx` status usages with `StatusPill`. Check the label text first: the pile and no-match wording changes to "In the pile" and "No match".
2. Replace `components/ui/data-table.tsx` with `Table` where the TanStack features are not needed; keep TanStack where server-side sorting is.
3. Replace `components/layout/shell.tsx` with `AppShell` (pass `userRole`, `Link`, `onNavigate`), and add `DemoBanner`.
4. Replace `lib/money.ts` display helpers with `formatMoney` and `<Money />`. Keep `toMinor` and `validKes`; they belong to forms.
5. Delete `.num` once nothing uses it (37 uses today); use `pd-num` or `<Money />`.
6. Delete `components/ui/{button,field,modal,empty,state}.tsx` after their screens move to `Button`, `Field`, `Dialog`, `EmptyState`, `Skeleton`.

## Admin portal

Its `globals.css` is byte-identical to the partners portal's, so the steps are the same and the diff will be too: add the dependency and `.npmrc`, `transpilePackages`, remove the `@fontsource` imports from `layout.tsx`, set `data-surface="app"`, replace `globals.css` with the three imports and `.num`. It also uses `qrcode.react`; no change needed. Likely admin-only additions: a `data-theme="dark"` toggle, which the tokens already support.

## API docs (`tefo-api-docs`)

- `package.json`: add the dependency, remove the two `@fontsource` packages. Keep `shiki` (pass its HTML to `CodeBlock` through `highlighted`).
- `next.config.ts`: `transpilePackages`. The site is a static export; nothing in the package needs a server.
- `layout.tsx`: delete the `@fontsource` imports; `<html data-surface="docs" data-theme="light">`.
- `globals.css`: delete the `@theme` block, the `html` and `body` rules, `:focus-visible`, reduced motion, and the `.prose` rules (use `className="pd-prose"`); keep `scroll-padding-top: 88px` and `scroll-behavior: smooth` (they are docs behaviour, not tokens). Delete `.code-dark` once code blocks use `CodeBlock`.
- Colour classes: `bg-ivory`, `text-ink`, `border-line`, `text-muted`, `text-ok`, `text-err` keep working through `theme.css`.

## Landing page (`tefo-landing`)

The landing page is plain CSS, so it takes the variables, not Tailwind.

- `package.json`: add the dependency; remove the `@fontsource` packages and the font imports in `main.js` or wherever they are.
- Import `tefo-design/styles.css` before `styles.css`. Set `<html data-surface="marketing">`.
- Delete the `:root{...}` token block at the top of `styles.css` and rename uses:

| Old | New |
| --- | --- |
| `--night`, `--deep`, `--panel`, `--panel2` | `--pd-night-950`, `--pd-night-900`, `--pd-night-800`, `--pd-night-700` |
| `--sky`, `--gold`, `--gold-d` | `--pd-sky-300`, `--pd-gold-300`, `--pd-gold-600` |
| `--ivory`, `--paper`, `--row` | `--pd-ivory-100`, `--pd-ivory-50`, `--pd-ivory-200` |
| `--text`, `--muted-l`, `--muted-d` | `--pd-ink-900`, `--pd-slate-600`, `--pd-ivory-400` |
| `--line-l`, `--line-d`, `--line-ds` | `--pd-ivory-300`, `--pd-line-night`, `--pd-line-night-strong` |
| `--err-d`, `--err-fill` | `--pd-red-300`, `--pd-red-600` |
| `--sans`, `--mono` | `--pd-font-sans`, `--pd-font-mono` |
| `--s1`..`--s9` | `--pd-space-1`..`--pd-space-9` |
| `--r-panel`, `--r-tile` | `--pd-radius-lg`, `--pd-radius-md` |
| `--gl`, `--gr` | `--pd-gutter` |
| `--focus` | `--pd-focus` |
| `.dark` / `.light` classes and `--muted` | `data-theme="dark"` / `"light"` with `--pd-fg-muted` |

- Delete `*{box-sizing}`, the `body` rule, `:focus-visible`, `.vh` and `.skip` (use `pd-vh`, `pd-skip`). `.btn` can stay or become `pd-btn` plus `data-size="lg"`.
- Keep everything about layout, GSAP and Lenis. This package takes no part in choreography.
- Swap `public/favicon.svg`, `apple-touch-icon.png` and `og.png` for `assets/` files, and replace `nairobi-skyline.png` with `assets/nairobi-skyline.svg` if the SVG is preferred. Compare it against the existing artwork first: the SVG is a simplified silhouette.
- I read the first 140 lines and skimmed the rest of this 560-line file; run `grep -nE "var\(--(night|deep|panel|sky|gold|ivory|paper|row|text|muted|line|err|s[0-9]|r-)" src/styles.css` to find every use before deleting the block.
