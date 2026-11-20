# mini-projects tokens: board role to app token

The set is `mini-projects.tokens.css`. It keeps `light-dark()` and `color-scheme`, as `frontend/src/styles/index.css` does today, so there is no `[data-theme="dark"]` block.

## Renamed or remapped (board role → app token)

- ground → `--color-surface` (the page; today `#f9f9f9`)
- surface → `--color-surface-lowest` (the sheet, header, odd rows; today `#fff`)
- band → `--color-surface-low` (even rows; the name stays, its value and its use change)
- ink → `--color-on-surface`
- accent (ink) → `--color-primary`
- focus (ink) → `--color-primary` (no token of its own: the ring is `outline: 2px solid var(--color-primary)`)
- on-accent → `--color-on-primary`
- ink-muted → `--color-muted` (today `#999` at 2.85:1; now `#56615a`)
- type: title 18/24 700 → `--text-title` (was 13 px), rows 14/22 → `--text-body`, labels 12/16 500 → `--text-label`
- mono face → `--font-mono` (Azeret Mono first, then the system stack)

## New tokens (component that needs it)

- `--color-surface-high`: the sheet's head band (the `Show` filter row, `components/FilterTabs.tsx` in its new place).
- `--color-line`: the sheet's edge, the header's bottom rule, the theme card's edge, icon-button hover fill.
- `--color-outline`: the checkbox, text field and segment edges.
- `--color-danger`: the `Delete` menu item and the toast's error icon.
- `--text-body-phone`: rows, the add field and the edit field at 390.
- `--text-title--font-weight`, `--text-label--font-weight` and the `--text-*--line-height` pairs: the board pairs each size with a line height; today a 36 px `--leading-row` is inherited instead.

## App tokens the design no longer uses (keep or drop is the code brief's call)

- `--text-footer`: the footer is gone (the title and the Theme switch moved).
- `--leading-row` (2.25rem, the 36 px row): rows are 40 px at 1280 and 48 px or more at 390, set per size above; the row height itself is a component class, not a token.
- `--color-primary` stays but is now green-black ink (`#131a15`), no longer pure `#000`.
- Radius and shadow: the cleared scales stay empty; no new token.
- `--z-index-sticky` and `--z-index-toast` stay: the sticky header, filter head and add row share the sticky layer in order, the toast is above them.

## Handoff notes for the code brief

- The page background must fill the screen: `min-height: 100dvh` on the app's root (the twin's ground ended at 800 px and left a white strip at 390x844).
- Row height is a component rule, not a token: 36 px for a mouse at 1024 px and wider, 40 px below that, 48 px under `(hover: none)` or under 640 px. No token changed in this round.
