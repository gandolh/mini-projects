# mini-projects (literally-a-todo-app): two directions

Written 2026-11-12 by the art director. Repo: mini-projects, brief 06 (`corpus/briefs/todo/`). Scope: the todo app's one page. Recorded limits both keep: "Utilitarian monospace" (`corpus/wiki/decisions.md`), so mono is the material and gate 64 is answered. Also kept: 0 px radius with no exceptions, no shadows, no gradients (`docs/wiki/design-rules.md`). Brief 03 makes the filter a `RadioGroup` labelled `Show` (Q41, Q57: it switches what one list shows, so it's not tabs or navigation). The theme switch is a `RadioGroup` labelled `Theme`, Light / Dark / System (Q18). Material Symbols Outlined stays the icon set; comps draw its glyphs as inline SVG. Behaviour, handlers and copy are fixed. The order is one user order, so no sorting, grouping, sections, counts, dates or progress. Today's hexes are a Material-generated scheme (`#ba1a1a` is M3's error tone; `#1a1c1c`, `#2f3131`, `#f9f9f9` and `#f3f3f4` are its neutral tones), so every hex moves in A as well.

## 1. Today's strengths (keep all of them)

1. **The list is the page.** One framed card, centred and capped at 672 px, holds every row and the add row. Nothing competes with it.
2. **Visible structure from rules.** The header band ends on a 1 px ink rule, the card has a 1 px ink frame, and row dividers sit a step lighter. Header, content and footer read as separate parts in both themes; in dark the card lifts off the page at 1.31:1.
3. **The filter is always in view and obvious.** It sits in the header, and the chosen choice is bold with a 2 px ink underline.
4. **Adding and editing happen in place.** One click on `Add a new task...` or on a title opens an input right there. Enter saves, Escape cancels, and there's no dialog.
5. **Done reads at a glance.** A done task stays in place, ticked and struck through.
6. **Row actions keep out of the way.** On desktop they show on hover and focus; on touch they're always there. Move up and Move down give a way to reorder without dragging. The theme switch is in plain view with text labels.

Faults both directions fix:
- **Contrast.** `#999` on white is 2.85:1, which fails for the placeholder, the inactive filter and theme choices, and `No tasks.`. Done rows sit at 50% opacity, which takes their text and tick under 4.5:1.
- **Footer.** It's 10 px capitals at 50% opacity, and it only repeats the title.
- **Phone targets.** At 390 they're 36 px rows, 20 px icon buttons and a 16 px checkbox, against the estate's 48 px rule. Phone body text is 14 px.
- **Text.** Titles truncate. The title is in CSS capitals; set source case, `Literally a todo app`.
- **Toast.** At 390 it covers the header and the first row.
- **Focus.** No focus ring is designed, so it's left to the browser.
- **Face.** The system mono stack is a different face on every OS.

## 2. The main screen

The list with its shell, route `/`, in `board/shots/mini-projects/`: `light-1280-list-hover.png` and `light-390-list-hover.png` (dark: `dark-1280-list-hover.png`, `dark-390-list-hover.png`). State references for the Direction sheet: `*-edit-row`, `*-add-open`, `*-empty-filter` and `*-toast-error`. Each shot is a viewport, 1280×800 or 390×844.

## 3. The content fixture (word for word from the shots and `frontend/src/`)

Small on purpose: six tasks (two done), three filter choices, three theme choices, one hovered row. Don't add tasks, counts or a heading.

- **Title:** `Literally a todo app`, source case.
- **Filter** (`RadioGroup` labelled `Show`): `All` (chosen), `Active`, `Completed`.
- **Rows,** in this order:
  1. `Plan the week's meals`: open. Move up disabled.
  2. `Water the plants`: done.
  3. `Reply to the landlord`: open, under the pointer at 1280.
  4. `Book a dentist appointment`: open.
  5. `Fix the bike light`: done.
  6. `Renew the library card`: open. Move down disabled.
- **Row parts.** The checkbox is named by its task. The title is a button that opens the edit field. The actions, by their `aria-label`s: `Drag to reorder`, `Move up`, `Move down`, `Delete`. In edit mode, `Save` (tooltip `Save (Enter)`).
- **Add row:** `Add a new task...`, closed. When open, the same text is the placeholder, with `Save`.
- **Theme** (`RadioGroup` labelled `Theme`): `Light`, `Dark`, `System`. Light is chosen in the light comp, Dark in the dark comp.
- **States for the Direction sheet:**
  - loading: `Loading...`;
  - empty filter: `Completed` chosen, `No tasks.`;
  - error toast: `Failed to update todo`, with `Dismiss`, and `Failed to delete todo`;
  - the edit row, with `Reply to the landlord` in the field;
  - the open add field.
- **Phone, 390.** On touch every row shows its actions, not only row 3; the 390 shot was taken with a pointer. Four 48 px actions plus a 48 px checkbox leave about 100 px of title, and `Book a dentist appointment` needs about 250 px at 16 px mono.
  - Both directions keep `Drag to reorder` inline. Move up, Move down and Delete go into one menu button per row, named `More actions for <title>`. That name is new copy, so put it in a Decision sticky.
  - Titles wrap to a second line and never truncate. The row grows, and its controls align to the first line.
  - Width check: 16 px gutters, the checkbox, the handle and the menu leave about 200 px, roughly 20 characters at 16 px. `Plan the week's meals`, `Reply to the landlord`, `Book a dentist appointment` and `Renew the library card` wrap to two lines. `Water the plants` and `Fix the bike light` stay on one.

## 4. Directions

### A. Utilitarian, settled (Evolve today)
- **Idea:** today's drawn grid of ink rules, set in one real mono face, with every grey readable and every phone target at 48 px.
- **Skeleton:** today's.
  - **1280.** A sticky 40 px header band on `surface` across the full width, ending on a 1 px `frame` rule. The title is on the left; the `Show` filter is centred, with a 2 px ink underline that sits exactly on the rule. Main is a 672 px column, 32 px from the header. The card is `surface` with a 1 px `frame` edge. Rows are 36 px with `line` dividers, and `Add a new task...` is the card's last row with a plus glyph. Then a sticky footer band of 40 px on `surface`, with a `frame` top rule, the title at 12 px on the left and the `Theme` switch on the right. Row actions on hover and focus, as today.
  - **390.** The header takes two rows: the title (48 px), then the filter as three equal segments, 48 px tall. The card has 16 px gutters and rows of at least 48 px. The footer is 48 px. The toast moves to the bottom, just above the footer, and never covers the header.
- **Type:** Red Hat Mono (Google) at 400, 500 and 700; fallback `ui-monospace, monospace`. Three sizes: 14/20 for rows, filter and title at 1280 (title and chosen filter at 700); 16/24 for rows and filter at 390; 12/16 for the footer title and the theme choices. Hierarchy comes from weight and ink, as design.md says.
- **Palette** (light / dark):
  - ground `#eff0f1` / `#141617`;
  - surface `#ffffff` / `#212427`;
  - surface-hover `#f5f6f7` / `#2a2e32`;
  - ink `#121416` / `#eceef0`;
  - ink-muted `#5b6168` / `#a3a9b0`;
  - line `#c5c9ce` / `#40454b`;
  - frame `#121416` / `#bfc4c9`;
  - accent = ink, with on-accent `#ffffff` / `#141617`;
  - danger `#a32a20` / `#f08a7e`;
  - focus = ink, 2 px with a 2 px offset.

  Pre-checked with WCAG 2 luminance:
  - ink on surface 18.5 / 13.4;
  - ink-muted on surface 6.26 / 6.58, and on ground 5.49 / 7.66;
  - surface on ground 1.14 / 1.16, with the frame edge too;
  - line on surface 1.66 / 1.61;
  - danger on surface 7.22 / 6.42.

  Re-run `contrast.mjs`.
- **Checkbox:** an 18 px square with a 1 px `frame` edge, in a 36 px target at 1280 and 48 px at 390.
- **Done rows:** the title in ink-muted with a line through it. The box stays a full ink square with an on-accent tick. No opacity.
- **Signature:** the drawn grid made exact. One ink draws the header rule, the card frame, the chosen filter's underline and the ticked box, all on a 4 px grid. Nothing else carries weight.
- **Reference:** `opencode.ai`, for monospace as the whole product's voice. Nothing of its palette or face.
- **Reopens:** nothing recorded. Revised records: the phone row menu (§3); the toast at the bottom on phones (brief 03 put it top centre); header and footer at 40 px (design-rules says 36); done rows in ink-muted instead of opacity 0.5; a plus glyph on the add row; Red Hat Mono in place of the system mono stack.

### B. Greenbar sheet
- **Idea:** the list becomes one sheet that carries its own controls, the filter in its head and the add row first, its rows banded like line-printer paper so the eye keeps its row.
- **Skeleton:**
  - **1280.** A 56 px header band on `surface` with a `line` bottom edge: the title on the left (18 px, 700) and the `Theme` switch on the right as a labelled segmented control. There's no footer. The main column is 720 px, 32 px below the header, and holds the sheet: `surface` with a 1 px `line` edge.
  - **The sheet's head.** A head band on `head` holds the visible label `Show` and the filter as three segments, with the chosen one filled in ink and its label in on-accent. Under the head is `Add a new task...` as the sheet's first row, a plus glyph and the text in a 44 px row with an `outline` edge when open.
  - **The rows.** The tasks are in 40 px rows, banded: odd rows `surface`, even rows `band`, with no dividers. The hovered row (row 3) sits on `head` and shows its actions. Row actions show on hover and focus. The checkbox is an 18 px square with an `outline` edge, filled in ink when done.
  - **390.**
    - The header is 56 px and holds the title only.
    - The sheet keeps 12 px gutters, so ground and its `line` edge show at both sides. Its head band holds the filter as three equal 48 px segments. The head and the add row stick under the header while the rows scroll.
    - The rows are 48 px or more. The drag handle sits at the left edge as a grip column, and the menu button is on the right.
    - The labelled `Theme` switch moves under the sheet as the page's last row, with 48 px segments, not sticky.
    - The toast is a bottom bar with a 16 px inset.
  - **Not a rail:** the filter isn't navigation (Q41), so it stays on the list it filters.
- **Type:** Azeret Mono (Google) at 400, 500 and 700; fallback `ui-monospace, monospace`. Four sizes: 18/24 at 700 for the title; 14/22 for rows at 1280; 16/24 for rows at 390; 12/16 at 500 for `Show`, the theme choices and the segments at 1280.
- **Palette** (light / dark). The surfaces lean a little green, at OKLCH h 137-145 in both themes; the text is near neutral (h 152-155, chroma 0.015 or less). Ink stays the only action colour, and green only tints surfaces. It's a surface tint, not an accent family, and it is kept off satchel's Claude green (h 160) and almanac's moss (h 122).
  - ground `#edf0ec` / `#131712`;
  - surface `#ffffff` / `#1f251e`;
  - band `#f0f6ee` / `#262d25`;
  - head (also the hovered row) `#e4ece1` / `#2b332a`;
  - ink `#131a15` / `#e8ede9`;
  - ink-muted `#56615a` / `#9fa9a2`;
  - line `#c2cbc4` / `#3b443e`;
  - outline `#6f7a72` / `#75807a` (fields and checkbox edge, never text);
  - accent = ink, with on-accent `#ffffff` / `#131712`;
  - danger `#a32a20` / `#f08a7e`;
  - focus = ink.

  Pre-checked:
  - ink on surface 17.7 / 13.2;
  - ink-muted on band 5.88 / 5.84, and on head 5.34 / 5.39;
  - sheet on ground 1.15 / 1.16, with a `line` edge 1.45 / 1.80 against ground;
  - head on surface 1.21 / 1.20;
  - band on surface 1.10 / 1.11 (a zebra, not a surface);
  - outline on head 3.70 / 3.18;
  - danger on surface 7.22 / 6.44.
- **Done rows:** as in A.
- **Signature:** greenbar banding. Pale green and white rows alternate down the sheet, and the bands replace the dividers. No tractor holes, perforations or paper texture: it's zebra striping (research 2.11), taken from the fanfold paper monospace was printed on.
- **Reference:** `ibm`, for Carbon's square, productive tiles and dense rows. Nothing of its blue or its Plex.
- **Reopens:** design-rules' App Shell (the filter moves into the sheet's head, the footer goes, and the theme switch moves to the header, under the sheet at 390); the add row first, with a plus glyph; bands in place of the 1 px `#999` dividers; a 12 px container margin at 390; the toast at the bottom on phones (brief 03); done rows as in A; and design.md's "strictly binary" palette gains a green tint. No radius, no shadow, mono kept.

## 5. Owner questions (for the ask sticky, reopened first)

1. **Phone row actions, both directions.** At 390, Move up, Move down and Delete go into a `More actions for <title>` menu, and the drag handle stays inline. Four 48 px targets leave about 100 px for a title. Is that OK? It would be the app's first menu, and it ends "all row actions always shown on touch".
2. **B's shell.** B puts the filter in the list's head and the add row first, drops the footer, moves the theme switch to the header, and adds a pale green band to the black-and-white palette. Is B allowed to reopen the recorded shell, or should the board keep only A?
3. **The face.** One Google mono, loaded like the icon font already is, replaces the system mono stack, so every OS shows the same letters: Red Hat Mono in A, Azeret Mono in B. Is that OK?

## 6. Registry lines

| mini-projects (A) | Utilitarian, settled | Red Hat Mono | Red Hat Mono | ink (today's black, no hue) | 40 px header band, title left, `Show` filter centred on the ink rule; one ink-framed 672 px card of 36 px rows with the add row last; footer band with the theme switch; phone header in two rows, row menu |
| mini-projects (B) | Greenbar sheet | Azeret Mono | Azeret Mono | ink (today's); pale green surface tint only, h ≈ 138 | 56 px header with the title and the theme switch, no footer; one 720 px sheet with a head band (`Show` filter), the add row first, green-banded rows with no dividers; phone sheet with 12 px gutters and a sticky head, a grip column, a row menu, and the theme switch under the sheet |
