# Design Rules & Conventions

Direction "Greenbar sheet" (brief 06, approved 2026-11-13). The tokens live in `frontend/src/styles/index.css`, in
Tailwind's `@theme`; this page names them and the rules the screens follow. [design.md](design.md) holds the character.
`designs/todoapp.html` is the original mock-up, kept as history.

## Typography

Azeret Mono, self-hosted from `@fontsource/azeret-mono` 5.3.0 (400, 500, 700), then `ui-monospace, monospace`.

| Token | Size / line | Weight | Used for |
|---|---|---|---|
| `text-title` | 18 / 24 | 700 | the page title |
| `text-body` | 14 / 22 | 400 | rows, the add row and fields with a mouse |
| `text-body-phone` | 16 / 24 | 400 | rows, fields and menu items on touch and under 640 px |
| `text-label` | 12 / 16 | 500 | Show, Theme, the segments |
| `text-icon` / `text-tick` | 20 / 16 | | glyphs, no line height |

The 14 px and its 22 px line sit on `body`, so `html` keeps the reader's own font size.

## Colors

Each colour is a `--color-*` token, a `light-dark()` pair: the theme switch (Light, Dark or System, light on a first
visit) sets `data-theme` on `<html>`, and `color-scheme` picks the value. No component needs a `dark:` class.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `primary` | `#131a15` | `#e8ede9` | Ink, the one action colour: the chosen filter, the checked box, the hover bar, the focus ring, icons |
| `on-primary` | `#fcfefb` | `#131712` | Text and the tick on ink |
| `on-surface` | `#131a15` | `#e8ede9` | Text |
| `muted` | `#56615a` | `#9fa9a2` | Done titles, the add row, placeholders, Show and Theme labels, disabled icons |
| `surface` | `#edf0ec` | `#131712` | The page behind the sheet |
| `surface-lowest` | `#fcfefb` | `#1f251e` | The sheet, the header, odd rows, menus, the toast, the theme card |
| `surface-low` | `#f0f6ee` | `#262d25` | Even rows: the greenbar |
| `surface-high` | `#e4ece1` | `#2b332a` | The sheet's head band, a highlighted menu item |
| `line` | `#c2cbc4` | `#3b443e` | The sheet's and cards' 1 px edge, the header's bottom rule, an icon button's hover fill |
| `outline` | `#6f7a72` | `#75807a` | Checkbox, field and segment edges (never text) |
| `danger` | `#a32a20` | `#f08a7e` | Delete in the menu and the toast's error icon, always beside a label |

Contrast, measured over the built tokens by `e2e/floor.spec.ts`: text pairs clear 4.5:1 (lowest 5.34 light, 5.37 dark),
edges, icons and the focus ring clear 3:1 (lowest 3.70 light, 3.18 dark).

## Spacing

- Row height: **36 px** for a mouse at 1024 px and up (`dense`), **40 px** between, **48 px** on touch or under 640 px
- Header 48 px, head band 40 px, add row 40 px (60 and 49 px on a phone)
- The sheet is **720 px** wide (`max-w-3xl` minus the page's 24 px gutters), with a 1 px `line` edge; gutters are 12 px
  under 640 px and 4 px under 375 px
- Phone rows: a 44 px grip, a 44 px checkbox, the title, a 44 px ⋮ (the grip is 40 px under 375 px); titles wrap and are
  never truncated

## Shape and depth

- All corners: **0 px radius**. No exceptions.
- No elevation and no gradients. Depth comes from tone (the greenbar, the head band) and a 1 px edge. The two 2 px ink
  frames (the chosen theme, a field) are inset rings, not shadows.

## Icons

- Material Symbols Outlined (Google Fonts), 20 px, ink. A hovered icon button takes the `line` fill; a pressed one
  inverts to ink.

## Components

### Rows
- Strict greenbar: odd rows `surface-lowest`, even rows `surface-low`, no dividers, by place in the list on screen
- Hover and focus: a 2 px ink bar at the row's left edge, plus the row's actions; no tint
- Actions (`opacity: 0` by default, `1` on hover, while focus is in the row, while editing, and always on touch): the grip,
  Move up, Move down, Delete. On touch the grip moves to the row's start and Move up, Move down and Delete go behind the
  ⋮ menu (`More actions for <title>`)
- Done: the title is `muted` and struck through; the row keeps its tone

### Title
- Plain wrapping text under a button laid over it (`Edit <title>`); a 1 px dotted underline on hover and focus

### Checkboxes
- An 18 px square with a 1 px `outline` edge inside a 40 px hit target (36 dense, 44 by 48 on touch)
- Checked: ink fill and a tick in `on-primary`

### Edit row
- The row never changes height and the checkbox never moves; the field has a 2 px ink frame, holds one line and scrolls
  its text. Enter saves, Escape cancels. Save is an icon button with a 1 px ink edge

### Menu
- Move up, Move down, Delete: 48 px items, an icon then the label, a 1 px ink frame, 240 px wide. Delete is `danger`

### Filter and theme (segmented RadioGroups)
- Show: the chosen filter is the one solid ink block. Theme: the chosen theme is a 2 px ink frame on the surface

### Empty and loading
- `No tasks.` and `Loading...` sit on a 48 px row in `muted`, under the add row

### Toast
- Wide screens: top centre under the header. Under 640 px: a bottom bar with a 16 px inset. A 2 px ink frame, the error
  icon, the message and a Dismiss button; an error stays until it is dismissed

### App Shell
- Header: sticky, 48 px, `line` rule below; the title left, the theme switch right. Under 640 px the header scrolls away
  and the switch moves into its own card under the sheet
- The sheet: a sticky head band (Show and the filter), then the add row sticky under it, then the rows
- The ground fills the screen (`min-height: 100dvh`); there is no footer
