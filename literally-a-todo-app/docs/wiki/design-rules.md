# Design Rules & Conventions

Reference: `docs/wiki/design.md` (full token set), `designs/todoapp.html` (HTML mockup). The tokens the app uses
live in `frontend/src/styles/index.css`, in Tailwind's `@theme`; this page names them.

## Typography

Font stack (all roles): `ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas, monospace`

| Role | Size | Weight | Line-height |
|---|---|---|---|
| headline-lg | 24px | 700 | 36px |
| headline-md | 18px | 700 | 36px |
| body-md | 14px | 400 | 36px |
| label-md | 12px | 400 | 20px |

In the app: `text-body` (14 px), `text-title` (13 px, the header), `text-footer` (10 px), `text-label` (12 px),
`text-icon` (20 px) and `text-tick` (14 px), in rem at the browser's 16 px root. The 14 px and the 36 px line height
(`--leading-row`) sit on `body`, so `html` keeps the reader's own font size.
## Colors

Each colour is a `--color-*` token in `styles/index.css` (`bg-surface`, `text-muted`, `border-primary`), a
`light-dark()` pair: the theme switch (Light, Dark or System, light on a first visit) sets `data-theme` on `<html>`,
and `color-scheme` picks the value. No component needs a `dark:` class.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `primary` | `#000000` | `#f0f1f1` | Text, borders, icons, the checked checkbox |
| `on-surface` | `#1a1c1c` | `#f0f1f1` | Body text |
| `muted` (design file: muted-gray) | `#999999` | `#999999` | Placeholders, separators, inactive tabs, disabled icons |
| `surface` | `#f9f9f9` | `#1a1c1c` | Page background |
| `surface-lowest` (surface-container-lowest) | `#ffffff` | `#2f3131` | Card, header, footer, toast; the tick |
| `surface-low` (surface-container-low) | `#f3f3f4` | `#3a3c3c` | Unused today |
| error | `#ba1a1a` | | Documented, not used by the app |

The dark page, card and text values are the design file's inverse tokens (`on-surface`, `inverse-surface`,
`inverse-on-surface`); `#999` keeps about 6.5:1 on the dark page. Borders stay 1 px in dark, light on dark.

## Spacing

- Row height: **36px** (`h-9`: Tailwind's 0.25rem spacing at the 16 px root)
- Horizontal padding: **8px** (`px-2`)
- Gap (small): **4px** (`gap-1`)
- Container margin: **16px**
- Separator thickness: **1px**

## Shape

- All corners: **0px radius** (sharp). No exceptions.

## Elevation

- No shadows, no gradients
- Hierarchy via borders only: `1px solid #000` for containers, `1px solid #999` for row separators
- Active tab: `border-bottom: 2px solid #000`
- Overlapping elements: white background + black border

## Icons

- Library: **Material Symbols Outlined** (Google Fonts CDN)
- Size: **20px**
- Color: `#000000`
- Hover: cursor pointer only — no visual state change

## Components

### Rows
- `height: 36px`, `padding: 0 8px`, `border-bottom: 1px solid #999`
- Hover: `background: #f9f9f9`
- Right-side action buttons: `opacity: 0` by default, `opacity: 1` on row hover, while focus is in the row, and
  always on a touch screen (no hover there)

### Checkboxes
- 16×16px square, `border: 1px solid #000`, 0px radius
- Checked: `background: #000`, white `check` icon (14px, FILL=1)

### Inputs (inline/phantom)
- Phantom: plain text, no border
- Active: `border: 1px solid #000`, no background change, no box-shadow
- Placeholder: `color: #999`

### Completed Items
- Row: `opacity: 0.5`
- Text: `text-decoration: line-through`

### Tabs (filter)
- Active: `border-bottom: 2px solid #000`, `font-weight: 700`
- Inactive: `color: #999`, no bottom border

### App Shell
- Header: sticky, 36px, `border-bottom: 1px solid #000`; below 640 px the tabs take a second row
- Theme switch: Light, Dark, System on the footer's right, styled as the filter tabs
- Content container: `max-width: 672px`, centered, `border: 1px solid #000`, white background
- Footer: sticky bottom, 36px, `border-top: 1px solid #000`, `opacity: 0.5`, 10px uppercase monospace
