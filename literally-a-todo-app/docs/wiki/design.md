---
name: Utilitarian Monospace
colors:
  surface: "#f9f9f9"
  surface-dim: "#dadada"
  surface-bright: "#f9f9f9"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f3f4"
  surface-container: "#eeeeee"
  surface-container-high: "#e8e8e8"
  surface-container-highest: "#e2e2e2"
  on-surface: "#1a1c1c"
  on-surface-variant: "#4c4546"
  inverse-surface: "#2f3131"
  inverse-on-surface: "#f0f1f1"
  outline: "#7e7576"
  outline-variant: "#cfc4c5"
  surface-tint: "#5e5e5e"
  primary: "#000000"
  on-primary: "#ffffff"
  primary-container: "#1b1b1b"
  on-primary-container: "#848484"
  inverse-primary: "#c6c6c6"
  secondary: "#4b53bc"
  on-secondary: "#ffffff"
  secondary-container: "#8991fe"
  on-secondary-container: "#1b218f"
  tertiary: "#000000"
  on-tertiary: "#ffffff"
  tertiary-container: "#1a1c1c"
  on-tertiary-container: "#838484"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#e2e2e2"
  primary-fixed-dim: "#c6c6c6"
  on-primary-fixed: "#1b1b1b"
  on-primary-fixed-variant: "#474747"
  secondary-fixed: "#e0e0ff"
  secondary-fixed-dim: "#bfc2ff"
  on-secondary-fixed: "#00006e"
  on-secondary-fixed-variant: "#3239a3"
  tertiary-fixed: "#e3e2e2"
  tertiary-fixed-dim: "#c7c6c6"
  on-tertiary-fixed: "#1a1c1c"
  on-tertiary-fixed-variant: "#464747"
  background: "#f9f9f9"
  on-background: "#1a1c1c"
  surface-variant: "#e2e2e2"
typography:
  headline-lg:
    fontFamily:
      ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas,
      monospace
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 36px
  headline-md:
    fontFamily:
      ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas,
      monospace
    fontSize: 18px
    fontWeight: "700"
    lineHeight: 36px
  body-md:
    fontFamily:
      ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas,
      monospace
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 36px
  label-md:
    fontFamily:
      ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas,
      monospace
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 20px
  code:
    fontFamily:
      ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas,
      monospace
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 36px
spacing:
  row-height: 36px
  padding-base: 8px
  gap-sm: 4px
  container-margin: 16px
  separator-thickness: 1px
---

## Brand & Style

This design system is a high-density, utilitarian framework designed for maximum efficiency and clarity. It strips away the decorative excesses of modern web design—eliminating gradients, shadows, and rounded corners—in favor of a strict, grid-based aesthetic inspired by classic workstation interfaces.

The personality is clinical and precise. It treats information as the primary citizen, using clear borders and monospaced typography to create a sense of structural integrity. It is intended for power users and developers who prioritize speed, scannability, and functional density over visual flair.

## Colors

The palette is strictly binary and functional. High-contrast black (#000000) is used for all structural elements, including text, borders, and icons. This ensures maximum legibility and a "drawn-on-paper" feel.

Muted gray (#999999) serves exclusively to denote secondary or inactive states, such as placeholders and disabled inputs. The background is a sterile, plain white (#FFFFFF) to provide a neutral canvas that avoids visual noise. While #000080 is available for critical brand accents, its usage should be sparse, keeping the focus on the black-and-white logic of the interface.

## Typography

This design system employs a global monospaced font stack to reinforce its technical, utilitarian roots. Monospaced characters ensure that data columns align perfectly, facilitating faster scanning of lists and tables.

All text is rendered in black (#000) with a standard row height of 36px to maintain a rigid vertical rhythm. Headlines use the same font family but are distinguished by weight rather than excessive size variations. For items marked as "completed," the typography is transformed with a 0.5 opacity and a strikethrough (line-through) decoration.

## Layout & Spacing

The layout philosophy is centered on a "tight" vertical grid. A fixed row height of 36px is applied to all interactive elements, including list items, input fields, and buttons, ensuring a predictable and compact interface.

Internal padding is standardized at 8px, providing just enough breathing room to prevent visual crowding while maintaining high information density. The layout does not use fluid, organic spacing; instead, it relies on a hard-edged grid where elements are separated by clear borders or defined gutters.

## Elevation & Depth

Depth is conveyed through structural containment rather than shadows or light play. The design system is intentionally flat.

Hierarchy is established through:

- **Borders:** 1px solid black (#000) borders define the boundaries of interactive components.
- **Tonal Logic:** Active states for tabs are marked by a 2px solid black bottom border, while background fills remain white.
- **Layering:** When elements must overlap (like menus), they use a white background with a black border to "cut" through the content behind them without the use of drop shadows.

## Shapes

The shape language is strictly rectangular. All corners are sharp (0px radius). This geometric rigidity reflects the "pixel-perfect" nature of early GUI design and emphasizes the utilitarian reset of the system. There are no exceptions for buttons, inputs, or containers.

## Components

### Rows & Lists

All rows must be exactly 36px tall with 8px horizontal padding. Content within rows should be vertically centered.

### Checkboxes

Styled according to @base-ui/react standards but restricted to a sharp, square aesthetic. Checked states use a solid black fill or a heavy black checkmark, while the container remains a 1px black square.

### Icon Buttons

Icon buttons are stripped of all chrome. They have no background fill and no border. Icons should be 20px in size and rendered in solid black. On hover, the cursor changes to a pointer, but the visual state remains unchanged to maintain the system's "quiet" profile.

### Tabs

Tabs are purely typographic with no background shading. The active tab is indicated by a `border-bottom: 2px solid #000`. Inactive tabs have no bottom border, though the entire tab bar sits atop a 1px separator.

### Inputs & Inline Editing

"Phantom" inputs are used for inline editing. They appear as plain text until focused, at which point a 1px black border appears. Placeholders must use the muted gray (#999) color.

### Separators

Separators follow the @base-ui/react model: a simple 1px solid line. Horizontal separators should span the full width of their container, while vertical separators are used sparingly to divide content within a 36px row.

### Status & Completion

Completed tasks or items are reduced to 0.5 opacity with a line-through decoration applied to all text within that row. This provides immediate visual feedback of state change without needing complex iconography.
