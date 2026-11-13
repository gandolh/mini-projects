---
name: Greenbar Sheet
colors:
  primary: "#131a15"
  on-primary: "#fcfefb"
  on-surface: "#131a15"
  muted: "#56615a"
  surface: "#edf0ec"
  surface-lowest: "#fcfefb"
  surface-low: "#f0f6ee"
  surface-high: "#e4ece1"
  line: "#c2cbc4"
  outline: "#6f7a72"
  danger: "#a32a20"
  dark-primary: "#e8ede9"
  dark-on-primary: "#131712"
  dark-surface: "#131712"
  dark-surface-lowest: "#1f251e"
  dark-surface-low: "#262d25"
  dark-surface-high: "#2b332a"
  dark-muted: "#9fa9a2"
  dark-line: "#3b443e"
  dark-outline: "#75807a"
  dark-danger: "#f08a7e"
typography:
  headline:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: 18px
    fontWeight: "700"
    lineHeight: 24px
  body-md:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 22px
  body-phone:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-md:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
spacing:
  row-height: 36px
  row-height-mid: 40px
  row-height-touch: 48px
  header: 48px
  head-band: 40px
  sheet-width: 720px
---

## Brand & Style

A high-density, utilitarian monospace list, drawn as a green-bar printout: one sheet on a pale ground, alternate rows banded like continuous-feed paper. It keeps the app's original character (sharp corners, no shadows, no gradients, monospace) and adds Azeret Mono, a tinted surface family and a head band that carries the filter. The personality is clinical and calm, for someone who wants the list and nothing else.

## Colors

The app's tokens, with their dark values, are in [design-rules.md](design-rules.md) and in
`frontend/src/styles/index.css`. The front matter above is the whole set.

Ink (`#131a15`) is the only action colour: text, icons, the chosen filter block, the checked box, the hover bar and the focus ring are all ink. A pale green (hue about 138) tints the surfaces only: the ground, the sheet, the head band and the band rows. Banding is strict greenbar, odd rows surface and even rows band, with no dividers. Muted green-grey carries secondary text, and one red, `danger`, appears only beside a label.

## Typography

Azeret Mono throughout (self-hosted), with four sizes: a 18 px bold title, 14 px rows, 12 px labels, and 16 px rows and fields on touch. Hierarchy comes from weight, not size.

## Layout & Spacing

The page is one 720 px sheet. A mouse at 1024 px and up gets 36 px rows, 40 px between, and touch or under 640 px gets 48 px rows with 44 px targets. The header is 48 px, the head band and the add row 40 px. Under 640 px the title header scrolls away and the head band and add row stay pinned.

## Elevation & Depth

The design is flat. Depth comes from tone and a 1 px `line` edge: the sheet against the ground, the head band against the rows. A menu and the toast use a 1 px or 2 px ink frame to cut through the content behind them. No shadow is used.

## Shapes

All corners are sharp, 0 px radius, with no exceptions for buttons, inputs, menus or the toast.

## Components

### Rows & Lists

Strict alternation of `surface-lowest` and `surface-low`. Hover and focus draw a 2 px ink bar at the row's left edge and reveal the row's actions. A done task's title is muted and struck through.

### Checkboxes

An 18 px square with a 1 px `outline` edge in a larger hit target; checked, it fills with ink and shows a tick.

### Icon Buttons

20 px glyphs in ink, no border. Hover fills the button with `line`; pressed inverts it to ink. On touch a ⋮ button opens a menu of Move up, Move down and Delete; the grip stays inline.

### Segmented groups

Show (the filter) marks its choice with one solid ink block; Theme marks its choice with a 2 px ink frame on the surface.

### Inputs & Inline Editing

The add field and the edit field take a 2 px ink frame, hold one line and scroll their text. The edit field floats over the title so the row never changes height.

### Status & Completion

A done task keeps its row tone; only its title turns muted and struck through. Failures raise a toast with the error icon and a Dismiss button; it stays until dismissed.
