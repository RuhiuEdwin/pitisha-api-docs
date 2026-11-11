# Adopting tefo-design

How an app uses this package, how the vendored copies are kept in sync, and which CSS names were unified. All four apps (landing, partners portal, admin portal, API docs) now depend on a vendored copy.

## Vendored copies

Each app has `vendor/tefo-design` and `"tefo-design": "file:vendor/tefo-design"` in `package.json`, plus `install-links=true` in `.npmrc` (Turbopack rejects symlinked CSS). The copy holds `src/`, `fonts/`, `assets/`, `package.json`, `README.md`, `TOKENS.md`, `DESIGN.md` and `MIGRATION.md`. The partners portal keeps a shorter README of its own and no `DESIGN.md` or `MIGRATION.md`.

When this package changes, copy the changed files into every `vendor/tefo-design` where the file already exists and still matches the previous version, then run `npm install` in the app. Never edit a vendored file in place: change it here first.

## Next.js with Tailwind v4 (portals and API docs)

- `next.config.ts`: `transpilePackages: ["tefo-design"]`.
- `layout.tsx`: `<html data-surface="app" data-theme="light">` (portals) or `data-surface="docs"` (API docs). No `@fontsource` imports; fonts come from `tefo-design/styles.css`.
- `globals.css`: `@import "tailwindcss"; @import "tefo-design/styles.css"; @import "tefo-design/theme.css";` and only app-specific rules after that.
- Tailwind colour classes the apps already used (`bg-ivory`, `text-ink`, `border-line`, `text-muted`, `text-ok`, `text-err`) keep working through `theme.css`.
- API docs: pass the HTML from `shiki` to `CodeBlock` through `highlighted`, and use `className="pd-prose"` for prose.

## Plain CSS (landing)

The landing page uses only `tefo-design/fonts.css` and the font files. Its own colours and layout live in `src/site.css`.

## Names unified under `--pd-*`

| Old (per app) | Now |
| --- | --- |
| `--night`, `--deep`, `--panel`, `--panel2` | `--pd-night-950`, `-900`, `-800`, `-700` |
| `--sky`, `--gold`, `--gold-d` | `--pd-sky-300`, `--pd-gold-300`, `--pd-gold-600` |
| `--ivory`, `--paper`, `--row` | `--pd-ivory-100`, `--pd-ivory-50`, `--pd-ivory-200` |
| `--text`, `--muted-l`, `--muted-d` | `--pd-ink-900`, `--pd-slate-600`, `--pd-ivory-400` |
| `--line-l`, `--line-d`, `--line-ds` | `--pd-ivory-300`, `--pd-line-night`, `--pd-line-night-strong` |
| `--err-d`, `--err-fill` | `--pd-red-300`, `--pd-red-600` |
| `--sans`, `--mono` | `--pd-font-sans`, `--pd-font-mono` |
| `--s1`..`--s9` | `--pd-space-1`..`--pd-space-9` |
| `.num`, `.mono`, `.vh`, `.skip` | `pd-num`, `pd-mono`, `pd-vh`, `pd-skip` |
| `.prose` (docs) | `pd-prose` |

Decisions that still hold:

- Three red primitives (`red-300`, `red-600`, `red-700`) chosen by role. `--pd-err` follows the theme.
- Radii: `xs` 6, `sm` 10, `md` 14, `lg` 20. Breakpoints are Tailwind's: 640, 768, 1024, 1280.
- Focus ring: 3px on marketing, 2px on app and docs, offset 2px, ink on light and mint on dark, at least 3:1 (see TOKENS.md).
- Body size per surface: 17px marketing, 14px app, 15px docs.
- One reduced-motion rule in `base.css` for anything inside a `data-surface`.
