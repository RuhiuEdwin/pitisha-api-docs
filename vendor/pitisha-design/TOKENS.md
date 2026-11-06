# Tokens

> Generated from `src/tokens.css` by `npm run tokens`. Do not edit by hand. Contrast ratios below are computed, not estimated, and the test suite fails if any pair drops below its threshold.

## How to use

- Set `data-surface="marketing|app|docs"` and `data-theme="light|dark"` on `<html>` (or any wrapper). With no `data-theme`, marketing is dark and app and docs are light.
- Read roles through CSS variables (`var(--pd-bg)`, `var(--pd-fg-muted)`) or the Tailwind utilities from `theme.css` (`bg-canvas`, `text-fg-muted`). Never hard-code a hex value.
- Brand names from the old portal theme (`night`, `ivory`, `gold`, `ink`, `muted`, `line`, `err`, `ok`, `warn`) still exist as Tailwind colours, so existing class names keep working.

## Palette (primitives)

| Token | Value |
| --- | --- |
| `--pd-night-950` | `#0b2b2a` |
| `--pd-night-900` | `#0f3634` |
| `--pd-night-800` | `#12413f` |
| `--pd-night-700` | `#1b5a56` |
| `--pd-ivory-50` | `#ffffff` |
| `--pd-ivory-100` | `#f3ebdd` |
| `--pd-ivory-200` | `#ece3d2` |
| `--pd-ivory-300` | `#d9cfbd` |
| `--pd-ivory-400` | `#c9d6cf` |
| `--pd-ink-900` | `#0b2b2a` |
| `--pd-slate-600` | `#44605e` |
| `--pd-slate-500` | `#6f8581` |
| `--pd-gold-100` | `#e3f7f1` |
| `--pd-gold-300` | `#7fe3cb` |
| `--pd-gold-600` | `#0e6f5e` |
| `--pd-sky-100` | `#e1ece9` |
| `--pd-sky-300` | `#c9d6cf` |
| `--pd-sky-700` | `#1b5a56` |
| `--pd-green-100` | `#e3f1e8` |
| `--pd-green-300` | `#7fe3cb` |
| `--pd-green-700` | `#1f6b45` |
| `--pd-green-950` | `#0f3a33` |
| `--pd-amber-100` | `#f8ecd2` |
| `--pd-amber-300` | `#f2c879` |
| `--pd-amber-700` | `#8a5300` |
| `--pd-amber-950` | `#3a2a07` |
| `--pd-red-100` | `#f9e4e0` |
| `--pd-red-300` | `#ff9c8f` |
| `--pd-red-600` | `#b3261e` |
| `--pd-red-700` | `#a82019` |
| `--pd-red-950` | `#3a1512` |
| `--pd-sky-950` | `#163d3b` |
| `--pd-line-night` | `rgba(243, 235, 221, 0.18)` |
| `--pd-line-night-strong` | `rgba(243, 235, 221, 0.46)` |
| `--pd-scrim` | `rgba(11, 43, 42, 0.64)` |

Gold is money in motion. Sky is the rails. Red appears only for failures (`red-*` tokens are used by the failure and error roles and nowhere else).

## Type

Families: IBM Plex Sans and IBM Plex Mono, self-hosted (Latin subset, WOFF2, about 60 KB for all six files). Money uses `font-variant-numeric: tabular-nums` through `--pd-num-features`.

| Token | Value |
| --- | --- |
| `--pd-text-2xs` | `0.6875rem` |
| `--pd-text-xs` | `0.75rem` |
| `--pd-text-sm` | `0.8125rem` |
| `--pd-text-md` | `0.875rem` |
| `--pd-text-lg` | `1rem` |
| `--pd-text-xl` | `1.125rem` |
| `--pd-text-2xl` | `clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)` |
| `--pd-text-3xl` | `clamp(1.5rem, 1.2rem + 1.2vw, 2rem)` |
| `--pd-text-4xl` | `clamp(2rem, 5.2vw, 3.6rem)` |
| `--pd-text-display` | `clamp(2.8rem, 9.4vw, 7.6rem)` |
| `--pd-weight-light` | `300` |
| `--pd-weight-regular` | `400` |
| `--pd-weight-medium` | `500` |
| `--pd-weight-semibold` | `700` |
| `--pd-leading-tight` | `1.06` |
| `--pd-leading-snug` | `1.25` |
| `--pd-leading-normal` | `1.5` |
| `--pd-leading-relaxed` | `1.65` |
| `--pd-tracking-display` | `-0.045em` |
| `--pd-tracking-heading` | `-0.03em` |
| `--pd-tracking-normal` | `0` |
| `--pd-tracking-caps` | `0.08em` |

Body size by surface: marketing 17px, app 14px, docs 15px.

## Space, radii, borders, layout, z-index, breakpoints

| Token | Value |
| --- | --- |
| `--pd-space-0` | `0` |
| `--pd-space-1` | `4px` |
| `--pd-space-2` | `8px` |
| `--pd-space-3` | `12px` |
| `--pd-space-4` | `16px` |
| `--pd-space-5` | `24px` |
| `--pd-space-6` | `32px` |
| `--pd-space-7` | `48px` |
| `--pd-space-8` | `80px` |
| `--pd-space-9` | `120px` |
| `--pd-radius-xs` | `6px` |
| `--pd-radius-sm` | `10px` |
| `--pd-radius-md` | `14px` |
| `--pd-radius-lg` | `20px` |
| `--pd-radius-pill` | `999px` |
| `--pd-border-w` | `1px` |
| `--pd-border-w-strong` | `1.5px` |
| `--pd-focus-w` | `3px` |
| `--pd-focus-offset` | `2px` |
| `--pd-target-min` | `44px` |
| `--pd-gutter` | `max(16px, env(safe-area-inset-left, 0px))` |
| `--pd-content-max` | `1180px` |
| `--pd-measure` | `68ch` |
| `--pd-sidebar-w` | `248px` |
| `--pd-topbar-h` | `56px` |
| `--pd-bp-sm` | `640px` |
| `--pd-bp-md` | `768px` |
| `--pd-bp-lg` | `1024px` |
| `--pd-bp-xl` | `1280px` |
| `--pd-z-base` | `0` |
| `--pd-z-raised` | `10` |
| `--pd-z-sticky` | `20` |
| `--pd-z-nav` | `30` |
| `--pd-z-drawer` | `40` |
| `--pd-z-overlay` | `50` |
| `--pd-z-dialog` | `60` |
| `--pd-z-toast` | `70` |
| `--pd-z-skip` | `90` |

## Motion

Four durations and one easing. Under `prefers-reduced-motion: reduce`, or inside `[data-motion="reduce"]`, every duration becomes `0.01ms` and components do not loop or auto-play anything.

| Token | Value |
| --- | --- |
| `--pd-dur-fast` | `120ms` |
| `--pd-dur-base` | `200ms` |
| `--pd-dur-slow` | `400ms` |
| `--pd-dur-cinematic` | `800ms` |
| `--pd-ease` | `cubic-bezier(0.2, 0.7, 0.2, 1)` |

## Roles by surface and theme

| Role | marketing light | marketing dark | app light | app dark | docs light | docs dark |
| --- | --- | --- | --- | --- | --- | --- |
| `--pd-bg` | `#f3ebdd` | `#0b2b2a` | `#f3ebdd` | `#0f3634` | `#ffffff` | `#0b2b2a` |
| `--pd-bg-raised` | `#ffffff` | `#0f3634` | `#ffffff` | `#12413f` | `#ffffff` | `#0f3634` |
| `--pd-bg-sunken` | `#ece3d2` | `#12413f` | `#ece3d2` | `#0b2b2a` | `#f3ebdd` | `#0f3634` |
| `--pd-fg` | `#0b2b2a` | `#f3ebdd` | `#0b2b2a` | `#f3ebdd` | `#0b2b2a` | `#f3ebdd` |
| `--pd-fg-muted` | `#44605e` | `#c9d6cf` | `#44605e` | `#c9d6cf` | `#44605e` | `#c9d6cf` |
| `--pd-border` | `#d9cfbd` | `rgba(243, 235, 221, 0.18)` | `#d9cfbd` | `rgba(243, 235, 221, 0.18)` | `#d9cfbd` | `rgba(243, 235, 221, 0.18)` |
| `--pd-border-strong` | `#6f8581` | `rgba(243, 235, 221, 0.46)` | `#6f8581` | `rgba(243, 235, 221, 0.46)` | `#6f8581` | `rgba(243, 235, 221, 0.46)` |
| `--pd-primary` | `#0b2b2a` | `#7fe3cb` | `#0b2b2a` | `#7fe3cb` | `#0b2b2a` | `#7fe3cb` |
| `--pd-primary-fg` | `#f3ebdd` | `#0b2b2a` | `#f3ebdd` | `#0b2b2a` | `#f3ebdd` | `#0b2b2a` |
| `--pd-accent` | `#7fe3cb` | `#7fe3cb` | `#7fe3cb` | `#7fe3cb` | `#7fe3cb` | `#7fe3cb` |
| `--pd-accent-fg` | `#0b2b2a` | `#0b2b2a` | `#0b2b2a` | `#0b2b2a` | `#0b2b2a` | `#0b2b2a` |
| `--pd-accent-text` | `#0e6f5e` | `#7fe3cb` | `#0e6f5e` | `#7fe3cb` | `#0e6f5e` | `#7fe3cb` |
| `--pd-link` | `#1b5a56` | `#c9d6cf` | `#1b5a56` | `#c9d6cf` | `#0b2b2a` | `#c9d6cf` |
| `--pd-focus` | `#0b2b2a` | `#7fe3cb` | `#0b2b2a` | `#7fe3cb` | `#0b2b2a` | `#7fe3cb` |
| `--pd-ok` | `#1f6b45` | `#7fe3cb` | `#1f6b45` | `#7fe3cb` | `#1f6b45` | `#7fe3cb` |
| `--pd-ok-bg` | `#e3f1e8` | `#0f3a33` | `#e3f1e8` | `#0f3a33` | `#e3f1e8` | `#0f3a33` |
| `--pd-warn` | `#8a5300` | `#f2c879` | `#8a5300` | `#f2c879` | `#8a5300` | `#f2c879` |
| `--pd-warn-bg` | `#f8ecd2` | `#3a2a07` | `#f8ecd2` | `#3a2a07` | `#f8ecd2` | `#3a2a07` |
| `--pd-err` | `#a82019` | `#ff9c8f` | `#a82019` | `#ff9c8f` | `#a82019` | `#ff9c8f` |
| `--pd-err-bg` | `#f9e4e0` | `#3a1512` | `#f9e4e0` | `#3a1512` | `#f9e4e0` | `#3a1512` |
| `--pd-info` | `#1b5a56` | `#c9d6cf` | `#1b5a56` | `#c9d6cf` | `#1b5a56` | `#c9d6cf` |
| `--pd-info-bg` | `#e1ece9` | `#163d3b` | `#e1ece9` | `#163d3b` | `#e1ece9` | `#163d3b` |
| `--pd-series-money` | `#0e6f5e` | `#7fe3cb` | `#0e6f5e` | `#7fe3cb` | `#0e6f5e` | `#7fe3cb` |
| `--pd-series-rail` | `#1b5a56` | `#c9d6cf` | `#1b5a56` | `#c9d6cf` | `#1b5a56` | `#c9d6cf` |
| `--pd-series-neutral` | `#44605e` | `#c9d6cf` | `#44605e` | `#c9d6cf` | `#44605e` | `#c9d6cf` |
| `--pd-sidebar-bg` | `#0b2b2a` | `#0b2b2a` | `#ffffff` | `#0b2b2a` | `#f3ebdd` | `#0b2b2a` |
| `--pd-sidebar-fg` | `#f3ebdd` | `#f3ebdd` | `#0b2b2a` | `#f3ebdd` | `#0b2b2a` | `#f3ebdd` |
| `--pd-sidebar-muted` | `#c9d6cf` | `#c9d6cf` | `#44605e` | `#c9d6cf` | `#44605e` | `#c9d6cf` |
| `--pd-sidebar-active-bg` | `#12413f` | `#12413f` | `#f8ecd2` | `#3a2a07` | `#ece3d2` | `#12413f` |
| `--pd-sidebar-border` | `rgba(243, 235, 221, 0.18)` | `rgba(243, 235, 221, 0.18)` | `#d9cfbd` | `rgba(243, 235, 221, 0.18)` | `#d9cfbd` | `rgba(243, 235, 221, 0.18)` |
| `--pd-code-bg` | `#0b2b2a` | `#0f3634` | `#0b2b2a` | `#0b2b2a` | `#0b2b2a` | `#0f3634` |
| `--pd-code-fg` | `#f3ebdd` | `#f3ebdd` | `#f3ebdd` | `#f3ebdd` | `#f3ebdd` | `#f3ebdd` |
| `--pd-code-muted` | `#c9d6cf` | `#c9d6cf` | `#c9d6cf` | `#c9d6cf` | `#c9d6cf` | `#c9d6cf` |
| `--pd-banner-bg` | `#7fe3cb` | `#7fe3cb` | `#7fe3cb` | `#7fe3cb` | `#7fe3cb` | `#7fe3cb` |
| `--pd-banner-fg` | `#0b2b2a` | `#0b2b2a` | `#0b2b2a` | `#0b2b2a` | `#0b2b2a` | `#0b2b2a` |

## Accessibility: WCAG 2.2 AA

| Criterion | How it is met |
| --- | --- |
| 1.4.3 Contrast (minimum), 4.5:1 | Every text role pair is measured below for all six surface and theme combinations. |
| 1.4.11 Non-text contrast, 3:1 | Control boundaries (`border-strong`), focus rings and chart series are measured below. The decorative `--pd-border` hairline is not a control boundary and is not held to 3:1; inputs use `--pd-border-strong`. |
| 1.4.1 Use of colour | `StatusPill` always renders an icon plus a word. Red is used for failures only. |
| 2.4.7 and 2.4.13 Focus visible and appearance | A 3px ring with a 2px offset in `--pd-focus`, measured at 3:1 or better against canvas and cards. Gold in dark themes, ink in light. |
| 2.5.8 Target size (minimum) | Interactive controls are at least 44px (`--pd-target-min`), above the 24px AA floor. |
| 2.3.3 and reduced motion | Motion tokens collapse to ~0 under `prefers-reduced-motion` and `[data-motion="reduce"]`. Skeleton shimmer, spinners and toasts do not animate. |
| 1.4.4 and 1.4.10 Resize and reflow | Type is in `rem`. Components reflow at 375px with no horizontal page scroll. Tables scroll inside their own region. |

Result: **198 of 198 pairs pass** (0 failing). Thresholds: text 4.5:1, UI 3:1. Translucent colours are composited over the background they sit on before measuring.

### marketing / light

| Pair | Use | Foreground | Background | Ratio | Needs | |
| --- | --- | --- | --- | --- | --- | --- |
| `fg` on `bg` | Body text on canvas | `#0b2b2a` | `#f3ebdd` | 12.73:1 | 4.5:1 | pass |
| `fg` on `bg-raised` | Body text on cards | `#0b2b2a` | `#ffffff` | 15.07:1 | 4.5:1 | pass |
| `fg` on `bg-sunken` | Body text on table headers and hover rows | `#0b2b2a` | `#ece3d2` | 11.83:1 | 4.5:1 | pass |
| `fg-muted` on `bg` | Secondary text on canvas | `#44605e` | `#f3ebdd` | 5.76:1 | 4.5:1 | pass |
| `fg-muted` on `bg-raised` | Secondary text on cards | `#44605e` | `#ffffff` | 6.82:1 | 4.5:1 | pass |
| `fg-muted` on `bg-sunken` | Secondary text on sunken areas | `#44605e` | `#ece3d2` | 5.35:1 | 4.5:1 | pass |
| `link` on `bg` | Links on canvas | `#1b5a56` | `#f3ebdd` | 6.71:1 | 4.5:1 | pass |
| `link` on `bg-raised` | Links on cards | `#1b5a56` | `#ffffff` | 7.94:1 | 4.5:1 | pass |
| `accent-text` on `bg` | Gold text on canvas | `#0e6f5e` | `#f3ebdd` | 5.14:1 | 4.5:1 | pass |
| `accent-text` on `bg-raised` | Gold text on cards | `#0e6f5e` | `#ffffff` | 6.08:1 | 4.5:1 | pass |
| `primary-fg` on `primary` | Primary button label | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `accent-fg` on `accent` | Gold button label | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `ok` on `ok-bg` | Success status | `#1f6b45` | `#e3f1e8` | 5.55:1 | 4.5:1 | pass |
| `warn` on `warn-bg` | Warning status | `#8a5300` | `#f8ecd2` | 5.40:1 | 4.5:1 | pass |
| `err` on `err-bg` | Failure status | `#a82019` | `#f9e4e0` | 5.96:1 | 4.5:1 | pass |
| `info` on `info-bg` | Info status | `#1b5a56` | `#e1ece9` | 6.57:1 | 4.5:1 | pass |
| `ok` on `bg-raised` | Success text on cards | `#1f6b45` | `#ffffff` | 6.47:1 | 4.5:1 | pass |
| `warn` on `bg-raised` | Warning text on cards | `#8a5300` | `#ffffff` | 6.33:1 | 4.5:1 | pass |
| `err` on `bg-raised` | Failure text on cards | `#a82019` | `#ffffff` | 7.28:1 | 4.5:1 | pass |
| `banner-fg` on `banner-bg` | Demo banner | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-bg` | Sidebar item | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-bg` | Sidebar group label | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-active-bg` | Sidebar active item | `#f3ebdd` | `#12413f` | 9.57:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-active-bg` | Sidebar muted on active | `#c9d6cf` | `#12413f` | 7.55:1 | 4.5:1 | pass |
| `code-fg` on `code-bg` | Code | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `code-muted` on `code-bg` | Code comments and line labels | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `focus` on `bg` | Focus ring on canvas | `#0b2b2a` | `#f3ebdd` | 12.73:1 | 3:1 | pass |
| `focus` on `bg-raised` | Focus ring on cards | `#0b2b2a` | `#ffffff` | 15.07:1 | 3:1 | pass |
| `border-strong` on `bg` | Input and control boundary on canvas | `#6f8581` | `#f3ebdd` | 3.32:1 | 3:1 | pass |
| `border-strong` on `bg-raised` | Input and control boundary on cards | `#6f8581` | `#ffffff` | 3.93:1 | 3:1 | pass |
| `series-money` on `bg-raised` | Chart: money line | `#0e6f5e` | `#ffffff` | 6.08:1 | 3:1 | pass |
| `series-rail` on `bg-raised` | Chart: rail line | `#1b5a56` | `#ffffff` | 7.94:1 | 3:1 | pass |
| `series-neutral` on `bg-raised` | Chart: neutral line | `#44605e` | `#ffffff` | 6.82:1 | 3:1 | pass |

### marketing / dark (default)

| Pair | Use | Foreground | Background | Ratio | Needs | |
| --- | --- | --- | --- | --- | --- | --- |
| `fg` on `bg` | Body text on canvas | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `fg` on `bg-raised` | Body text on cards | `#f3ebdd` | `#0f3634` | 11.10:1 | 4.5:1 | pass |
| `fg` on `bg-sunken` | Body text on table headers and hover rows | `#f3ebdd` | `#12413f` | 9.57:1 | 4.5:1 | pass |
| `fg-muted` on `bg` | Secondary text on canvas | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `fg-muted` on `bg-raised` | Secondary text on cards | `#c9d6cf` | `#0f3634` | 8.77:1 | 4.5:1 | pass |
| `fg-muted` on `bg-sunken` | Secondary text on sunken areas | `#c9d6cf` | `#12413f` | 7.55:1 | 4.5:1 | pass |
| `link` on `bg` | Links on canvas | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `link` on `bg-raised` | Links on cards | `#c9d6cf` | `#0f3634` | 8.77:1 | 4.5:1 | pass |
| `accent-text` on `bg` | Gold text on canvas | `#7fe3cb` | `#0b2b2a` | 9.87:1 | 4.5:1 | pass |
| `accent-text` on `bg-raised` | Gold text on cards | `#7fe3cb` | `#0f3634` | 8.61:1 | 4.5:1 | pass |
| `primary-fg` on `primary` | Primary button label | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `accent-fg` on `accent` | Gold button label | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `ok` on `ok-bg` | Success status | `#7fe3cb` | `#0f3a33` | 8.22:1 | 4.5:1 | pass |
| `warn` on `warn-bg` | Warning status | `#f2c879` | `#3a2a07` | 8.79:1 | 4.5:1 | pass |
| `err` on `err-bg` | Failure status | `#ff9c8f` | `#3a1512` | 8.03:1 | 4.5:1 | pass |
| `info` on `info-bg` | Info status | `#c9d6cf` | `#163d3b` | 7.93:1 | 4.5:1 | pass |
| `ok` on `bg-raised` | Success text on cards | `#7fe3cb` | `#0f3634` | 8.61:1 | 4.5:1 | pass |
| `warn` on `bg-raised` | Warning text on cards | `#f2c879` | `#0f3634` | 8.33:1 | 4.5:1 | pass |
| `err` on `bg-raised` | Failure text on cards | `#ff9c8f` | `#0f3634` | 6.51:1 | 4.5:1 | pass |
| `banner-fg` on `banner-bg` | Demo banner | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-bg` | Sidebar item | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-bg` | Sidebar group label | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-active-bg` | Sidebar active item | `#f3ebdd` | `#12413f` | 9.57:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-active-bg` | Sidebar muted on active | `#c9d6cf` | `#12413f` | 7.55:1 | 4.5:1 | pass |
| `code-fg` on `code-bg` | Code | `#f3ebdd` | `#0f3634` | 11.10:1 | 4.5:1 | pass |
| `code-muted` on `code-bg` | Code comments and line labels | `#c9d6cf` | `#0f3634` | 8.77:1 | 4.5:1 | pass |
| `focus` on `bg` | Focus ring on canvas | `#7fe3cb` | `#0b2b2a` | 9.87:1 | 3:1 | pass |
| `focus` on `bg-raised` | Focus ring on cards | `#7fe3cb` | `#0f3634` | 8.61:1 | 3:1 | pass |
| `border-strong` on `bg` | Input and control boundary on canvas | `rgba(243, 235, 221, 0.46)` | `#0b2b2a` | 3.82:1 | 3:1 | pass |
| `border-strong` on `bg-raised` | Input and control boundary on cards | `rgba(243, 235, 221, 0.46)` | `#0f3634` | 3.57:1 | 3:1 | pass |
| `series-money` on `bg-raised` | Chart: money line | `#7fe3cb` | `#0f3634` | 8.61:1 | 3:1 | pass |
| `series-rail` on `bg-raised` | Chart: rail line | `#c9d6cf` | `#0f3634` | 8.77:1 | 3:1 | pass |
| `series-neutral` on `bg-raised` | Chart: neutral line | `#c9d6cf` | `#0f3634` | 8.77:1 | 3:1 | pass |

### app / light (default)

| Pair | Use | Foreground | Background | Ratio | Needs | |
| --- | --- | --- | --- | --- | --- | --- |
| `fg` on `bg` | Body text on canvas | `#0b2b2a` | `#f3ebdd` | 12.73:1 | 4.5:1 | pass |
| `fg` on `bg-raised` | Body text on cards | `#0b2b2a` | `#ffffff` | 15.07:1 | 4.5:1 | pass |
| `fg` on `bg-sunken` | Body text on table headers and hover rows | `#0b2b2a` | `#ece3d2` | 11.83:1 | 4.5:1 | pass |
| `fg-muted` on `bg` | Secondary text on canvas | `#44605e` | `#f3ebdd` | 5.76:1 | 4.5:1 | pass |
| `fg-muted` on `bg-raised` | Secondary text on cards | `#44605e` | `#ffffff` | 6.82:1 | 4.5:1 | pass |
| `fg-muted` on `bg-sunken` | Secondary text on sunken areas | `#44605e` | `#ece3d2` | 5.35:1 | 4.5:1 | pass |
| `link` on `bg` | Links on canvas | `#1b5a56` | `#f3ebdd` | 6.71:1 | 4.5:1 | pass |
| `link` on `bg-raised` | Links on cards | `#1b5a56` | `#ffffff` | 7.94:1 | 4.5:1 | pass |
| `accent-text` on `bg` | Gold text on canvas | `#0e6f5e` | `#f3ebdd` | 5.14:1 | 4.5:1 | pass |
| `accent-text` on `bg-raised` | Gold text on cards | `#0e6f5e` | `#ffffff` | 6.08:1 | 4.5:1 | pass |
| `primary-fg` on `primary` | Primary button label | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `accent-fg` on `accent` | Gold button label | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `ok` on `ok-bg` | Success status | `#1f6b45` | `#e3f1e8` | 5.55:1 | 4.5:1 | pass |
| `warn` on `warn-bg` | Warning status | `#8a5300` | `#f8ecd2` | 5.40:1 | 4.5:1 | pass |
| `err` on `err-bg` | Failure status | `#a82019` | `#f9e4e0` | 5.96:1 | 4.5:1 | pass |
| `info` on `info-bg` | Info status | `#1b5a56` | `#e1ece9` | 6.57:1 | 4.5:1 | pass |
| `ok` on `bg-raised` | Success text on cards | `#1f6b45` | `#ffffff` | 6.47:1 | 4.5:1 | pass |
| `warn` on `bg-raised` | Warning text on cards | `#8a5300` | `#ffffff` | 6.33:1 | 4.5:1 | pass |
| `err` on `bg-raised` | Failure text on cards | `#a82019` | `#ffffff` | 7.28:1 | 4.5:1 | pass |
| `banner-fg` on `banner-bg` | Demo banner | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-bg` | Sidebar item | `#0b2b2a` | `#ffffff` | 15.07:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-bg` | Sidebar group label | `#44605e` | `#ffffff` | 6.82:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-active-bg` | Sidebar active item | `#0b2b2a` | `#f8ecd2` | 12.86:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-active-bg` | Sidebar muted on active | `#44605e` | `#f8ecd2` | 5.82:1 | 4.5:1 | pass |
| `code-fg` on `code-bg` | Code | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `code-muted` on `code-bg` | Code comments and line labels | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `focus` on `bg` | Focus ring on canvas | `#0b2b2a` | `#f3ebdd` | 12.73:1 | 3:1 | pass |
| `focus` on `bg-raised` | Focus ring on cards | `#0b2b2a` | `#ffffff` | 15.07:1 | 3:1 | pass |
| `border-strong` on `bg` | Input and control boundary on canvas | `#6f8581` | `#f3ebdd` | 3.32:1 | 3:1 | pass |
| `border-strong` on `bg-raised` | Input and control boundary on cards | `#6f8581` | `#ffffff` | 3.93:1 | 3:1 | pass |
| `series-money` on `bg-raised` | Chart: money line | `#0e6f5e` | `#ffffff` | 6.08:1 | 3:1 | pass |
| `series-rail` on `bg-raised` | Chart: rail line | `#1b5a56` | `#ffffff` | 7.94:1 | 3:1 | pass |
| `series-neutral` on `bg-raised` | Chart: neutral line | `#44605e` | `#ffffff` | 6.82:1 | 3:1 | pass |

### app / dark

| Pair | Use | Foreground | Background | Ratio | Needs | |
| --- | --- | --- | --- | --- | --- | --- |
| `fg` on `bg` | Body text on canvas | `#f3ebdd` | `#0f3634` | 11.10:1 | 4.5:1 | pass |
| `fg` on `bg-raised` | Body text on cards | `#f3ebdd` | `#12413f` | 9.57:1 | 4.5:1 | pass |
| `fg` on `bg-sunken` | Body text on table headers and hover rows | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `fg-muted` on `bg` | Secondary text on canvas | `#c9d6cf` | `#0f3634` | 8.77:1 | 4.5:1 | pass |
| `fg-muted` on `bg-raised` | Secondary text on cards | `#c9d6cf` | `#12413f` | 7.55:1 | 4.5:1 | pass |
| `fg-muted` on `bg-sunken` | Secondary text on sunken areas | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `link` on `bg` | Links on canvas | `#c9d6cf` | `#0f3634` | 8.77:1 | 4.5:1 | pass |
| `link` on `bg-raised` | Links on cards | `#c9d6cf` | `#12413f` | 7.55:1 | 4.5:1 | pass |
| `accent-text` on `bg` | Gold text on canvas | `#7fe3cb` | `#0f3634` | 8.61:1 | 4.5:1 | pass |
| `accent-text` on `bg-raised` | Gold text on cards | `#7fe3cb` | `#12413f` | 7.42:1 | 4.5:1 | pass |
| `primary-fg` on `primary` | Primary button label | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `accent-fg` on `accent` | Gold button label | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `ok` on `ok-bg` | Success status | `#7fe3cb` | `#0f3a33` | 8.22:1 | 4.5:1 | pass |
| `warn` on `warn-bg` | Warning status | `#f2c879` | `#3a2a07` | 8.79:1 | 4.5:1 | pass |
| `err` on `err-bg` | Failure status | `#ff9c8f` | `#3a1512` | 8.03:1 | 4.5:1 | pass |
| `info` on `info-bg` | Info status | `#c9d6cf` | `#163d3b` | 7.93:1 | 4.5:1 | pass |
| `ok` on `bg-raised` | Success text on cards | `#7fe3cb` | `#12413f` | 7.42:1 | 4.5:1 | pass |
| `warn` on `bg-raised` | Warning text on cards | `#f2c879` | `#12413f` | 7.18:1 | 4.5:1 | pass |
| `err` on `bg-raised` | Failure text on cards | `#ff9c8f` | `#12413f` | 5.61:1 | 4.5:1 | pass |
| `banner-fg` on `banner-bg` | Demo banner | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-bg` | Sidebar item | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-bg` | Sidebar group label | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-active-bg` | Sidebar active item | `#f3ebdd` | `#3a2a07` | 11.71:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-active-bg` | Sidebar muted on active | `#c9d6cf` | `#3a2a07` | 9.25:1 | 4.5:1 | pass |
| `code-fg` on `code-bg` | Code | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `code-muted` on `code-bg` | Code comments and line labels | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `focus` on `bg` | Focus ring on canvas | `#7fe3cb` | `#0f3634` | 8.61:1 | 3:1 | pass |
| `focus` on `bg-raised` | Focus ring on cards | `#7fe3cb` | `#12413f` | 7.42:1 | 3:1 | pass |
| `border-strong` on `bg` | Input and control boundary on canvas | `rgba(243, 235, 221, 0.46)` | `#0f3634` | 3.57:1 | 3:1 | pass |
| `border-strong` on `bg-raised` | Input and control boundary on cards | `rgba(243, 235, 221, 0.46)` | `#12413f` | 3.30:1 | 3:1 | pass |
| `series-money` on `bg-raised` | Chart: money line | `#7fe3cb` | `#12413f` | 7.42:1 | 3:1 | pass |
| `series-rail` on `bg-raised` | Chart: rail line | `#c9d6cf` | `#12413f` | 7.55:1 | 3:1 | pass |
| `series-neutral` on `bg-raised` | Chart: neutral line | `#c9d6cf` | `#12413f` | 7.55:1 | 3:1 | pass |

### docs / light (default)

| Pair | Use | Foreground | Background | Ratio | Needs | |
| --- | --- | --- | --- | --- | --- | --- |
| `fg` on `bg` | Body text on canvas | `#0b2b2a` | `#ffffff` | 15.07:1 | 4.5:1 | pass |
| `fg` on `bg-raised` | Body text on cards | `#0b2b2a` | `#ffffff` | 15.07:1 | 4.5:1 | pass |
| `fg` on `bg-sunken` | Body text on table headers and hover rows | `#0b2b2a` | `#f3ebdd` | 12.73:1 | 4.5:1 | pass |
| `fg-muted` on `bg` | Secondary text on canvas | `#44605e` | `#ffffff` | 6.82:1 | 4.5:1 | pass |
| `fg-muted` on `bg-raised` | Secondary text on cards | `#44605e` | `#ffffff` | 6.82:1 | 4.5:1 | pass |
| `fg-muted` on `bg-sunken` | Secondary text on sunken areas | `#44605e` | `#f3ebdd` | 5.76:1 | 4.5:1 | pass |
| `link` on `bg` | Links on canvas | `#0b2b2a` | `#ffffff` | 15.07:1 | 4.5:1 | pass |
| `link` on `bg-raised` | Links on cards | `#0b2b2a` | `#ffffff` | 15.07:1 | 4.5:1 | pass |
| `accent-text` on `bg` | Gold text on canvas | `#0e6f5e` | `#ffffff` | 6.08:1 | 4.5:1 | pass |
| `accent-text` on `bg-raised` | Gold text on cards | `#0e6f5e` | `#ffffff` | 6.08:1 | 4.5:1 | pass |
| `primary-fg` on `primary` | Primary button label | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `accent-fg` on `accent` | Gold button label | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `ok` on `ok-bg` | Success status | `#1f6b45` | `#e3f1e8` | 5.55:1 | 4.5:1 | pass |
| `warn` on `warn-bg` | Warning status | `#8a5300` | `#f8ecd2` | 5.40:1 | 4.5:1 | pass |
| `err` on `err-bg` | Failure status | `#a82019` | `#f9e4e0` | 5.96:1 | 4.5:1 | pass |
| `info` on `info-bg` | Info status | `#1b5a56` | `#e1ece9` | 6.57:1 | 4.5:1 | pass |
| `ok` on `bg-raised` | Success text on cards | `#1f6b45` | `#ffffff` | 6.47:1 | 4.5:1 | pass |
| `warn` on `bg-raised` | Warning text on cards | `#8a5300` | `#ffffff` | 6.33:1 | 4.5:1 | pass |
| `err` on `bg-raised` | Failure text on cards | `#a82019` | `#ffffff` | 7.28:1 | 4.5:1 | pass |
| `banner-fg` on `banner-bg` | Demo banner | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-bg` | Sidebar item | `#0b2b2a` | `#f3ebdd` | 12.73:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-bg` | Sidebar group label | `#44605e` | `#f3ebdd` | 5.76:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-active-bg` | Sidebar active item | `#0b2b2a` | `#ece3d2` | 11.83:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-active-bg` | Sidebar muted on active | `#44605e` | `#ece3d2` | 5.35:1 | 4.5:1 | pass |
| `code-fg` on `code-bg` | Code | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `code-muted` on `code-bg` | Code comments and line labels | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `focus` on `bg` | Focus ring on canvas | `#0b2b2a` | `#ffffff` | 15.07:1 | 3:1 | pass |
| `focus` on `bg-raised` | Focus ring on cards | `#0b2b2a` | `#ffffff` | 15.07:1 | 3:1 | pass |
| `border-strong` on `bg` | Input and control boundary on canvas | `#6f8581` | `#ffffff` | 3.93:1 | 3:1 | pass |
| `border-strong` on `bg-raised` | Input and control boundary on cards | `#6f8581` | `#ffffff` | 3.93:1 | 3:1 | pass |
| `series-money` on `bg-raised` | Chart: money line | `#0e6f5e` | `#ffffff` | 6.08:1 | 3:1 | pass |
| `series-rail` on `bg-raised` | Chart: rail line | `#1b5a56` | `#ffffff` | 7.94:1 | 3:1 | pass |
| `series-neutral` on `bg-raised` | Chart: neutral line | `#44605e` | `#ffffff` | 6.82:1 | 3:1 | pass |

### docs / dark

| Pair | Use | Foreground | Background | Ratio | Needs | |
| --- | --- | --- | --- | --- | --- | --- |
| `fg` on `bg` | Body text on canvas | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `fg` on `bg-raised` | Body text on cards | `#f3ebdd` | `#0f3634` | 11.10:1 | 4.5:1 | pass |
| `fg` on `bg-sunken` | Body text on table headers and hover rows | `#f3ebdd` | `#0f3634` | 11.10:1 | 4.5:1 | pass |
| `fg-muted` on `bg` | Secondary text on canvas | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `fg-muted` on `bg-raised` | Secondary text on cards | `#c9d6cf` | `#0f3634` | 8.77:1 | 4.5:1 | pass |
| `fg-muted` on `bg-sunken` | Secondary text on sunken areas | `#c9d6cf` | `#0f3634` | 8.77:1 | 4.5:1 | pass |
| `link` on `bg` | Links on canvas | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `link` on `bg-raised` | Links on cards | `#c9d6cf` | `#0f3634` | 8.77:1 | 4.5:1 | pass |
| `accent-text` on `bg` | Gold text on canvas | `#7fe3cb` | `#0b2b2a` | 9.87:1 | 4.5:1 | pass |
| `accent-text` on `bg-raised` | Gold text on cards | `#7fe3cb` | `#0f3634` | 8.61:1 | 4.5:1 | pass |
| `primary-fg` on `primary` | Primary button label | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `accent-fg` on `accent` | Gold button label | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `ok` on `ok-bg` | Success status | `#7fe3cb` | `#0f3a33` | 8.22:1 | 4.5:1 | pass |
| `warn` on `warn-bg` | Warning status | `#f2c879` | `#3a2a07` | 8.79:1 | 4.5:1 | pass |
| `err` on `err-bg` | Failure status | `#ff9c8f` | `#3a1512` | 8.03:1 | 4.5:1 | pass |
| `info` on `info-bg` | Info status | `#c9d6cf` | `#163d3b` | 7.93:1 | 4.5:1 | pass |
| `ok` on `bg-raised` | Success text on cards | `#7fe3cb` | `#0f3634` | 8.61:1 | 4.5:1 | pass |
| `warn` on `bg-raised` | Warning text on cards | `#f2c879` | `#0f3634` | 8.33:1 | 4.5:1 | pass |
| `err` on `bg-raised` | Failure text on cards | `#ff9c8f` | `#0f3634` | 6.51:1 | 4.5:1 | pass |
| `banner-fg` on `banner-bg` | Demo banner | `#0b2b2a` | `#7fe3cb` | 9.87:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-bg` | Sidebar item | `#f3ebdd` | `#0b2b2a` | 12.73:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-bg` | Sidebar group label | `#c9d6cf` | `#0b2b2a` | 10.05:1 | 4.5:1 | pass |
| `sidebar-fg` on `sidebar-active-bg` | Sidebar active item | `#f3ebdd` | `#12413f` | 9.57:1 | 4.5:1 | pass |
| `sidebar-muted` on `sidebar-active-bg` | Sidebar muted on active | `#c9d6cf` | `#12413f` | 7.55:1 | 4.5:1 | pass |
| `code-fg` on `code-bg` | Code | `#f3ebdd` | `#0f3634` | 11.10:1 | 4.5:1 | pass |
| `code-muted` on `code-bg` | Code comments and line labels | `#c9d6cf` | `#0f3634` | 8.77:1 | 4.5:1 | pass |
| `focus` on `bg` | Focus ring on canvas | `#7fe3cb` | `#0b2b2a` | 9.87:1 | 3:1 | pass |
| `focus` on `bg-raised` | Focus ring on cards | `#7fe3cb` | `#0f3634` | 8.61:1 | 3:1 | pass |
| `border-strong` on `bg` | Input and control boundary on canvas | `rgba(243, 235, 221, 0.46)` | `#0b2b2a` | 3.82:1 | 3:1 | pass |
| `border-strong` on `bg-raised` | Input and control boundary on cards | `rgba(243, 235, 221, 0.46)` | `#0f3634` | 3.57:1 | 3:1 | pass |
| `series-money` on `bg-raised` | Chart: money line | `#7fe3cb` | `#0f3634` | 8.61:1 | 3:1 | pass |
| `series-rail` on `bg-raised` | Chart: rail line | `#c9d6cf` | `#0f3634` | 8.77:1 | 3:1 | pass |
| `series-neutral` on `bg-raised` | Chart: neutral line | `#c9d6cf` | `#0f3634` | 8.77:1 | 3:1 | pass |
