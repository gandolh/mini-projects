# Design Rules & Conventions

Reference: `docs/wiki/design.md` (full token set), `designs/todoapp.html` (HTML mockup).

## Typography

Font stack (all roles): `ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas, monospace`

| Role | Size | Weight | Line-height |
|---|---|---|---|
| headline-lg | 24px | 700 | 36px |
| headline-md | 18px | 700 | 36px |
| body-md | 14px | 400 | 36px |
| label-md | 12px | 400 | 20px |

## Colors

| Token | Value | Usage |
|---|---|---|
| primary | `#000000` | Text, borders, icons |
| on-surface | `#1a1c1c` | Body text |
| muted-gray | `#999999` | Placeholders, separators, inactive tabs |
| surface | `#f9f9f9` | Page background |
| surface-container-lowest | `#ffffff` | Card / content container background |
| error | `#ba1a1a` | Error states |

## Spacing

- Row height: **36px**
- Horizontal padding: **8px**
- Gap (small): **4px**
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
- Right-side action buttons: `opacity: 0` by default, `opacity: 1` on row hover

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
- Header: sticky, 36px, `border-bottom: 1px solid #000`
- Content container: `max-width: 672px`, centered, `border: 1px solid #000`, white background
- Footer: sticky bottom, 36px, `border-top: 1px solid #000`, `opacity: 0.5`, 10px uppercase monospace
