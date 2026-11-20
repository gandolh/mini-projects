# The board's notes: Todo app

The estate redesign board is a private canvas. This file copies what its page for this app said beside the screens: the owner's asks, the decisions, the rules the design reopened, the open questions and the Floor. The owner's answers are in [README.md](../README.md#the-owners-decisions).

## Asks to the owner

- 1. Phone row actions: at 390, Move up, Move down and Delete go into a ⋮ menu named `More actions for <title>` on every row, and the drag handle stays inline. Four 44 px targets would leave about 100 px for a title. It is the app's first menu and it ends "actions always shown on touch". OK?
  2. Approve this direction? Greenbar sheet reopens the recorded page shell and adds a pale green tint to the black-and-white palette (the two reopened stickies say what and where). Or keep only the runner-up, Utilitarian settled?
  3. One Google mono face, Azeret Mono, replaces the system mono stack so every OS shows the same letters. OK? (beside `mini-projects-direction`)

## Decisions

- Banding stays strictly regular: odd rows surface, even rows band, no dividers. Hover and focus are their own state, a 2 px ink bar at the row's left edge plus the row's actions, with no tint, so no band can be mistaken for hover (the judges' first ruling). (beside `mini-projects-proposed-list-1280`)
- The header carries one solid block: the chosen filter is filled in ink. The chosen theme is an outline (a 2 px ink frame on the surface fill), so the two choices never compete. (beside `mini-projects-proposed-list-1280`)
- The `Show` filter stays in view because the sheet's head band is sticky under the header at every width; the add row sticks under it. Filter is a RadioGroup labelled Show, Theme a RadioGroup labelled Theme, as today. (beside `mini-projects-proposed-list-1280`)
- Phone rows: a grip column at the left (44 px), the checkbox (44 px), the title, and the ⋮ menu button (44 px), all in rows of 48 px or more, with controls aligned to the first line. `More actions for <title>` is new copy; the menu holds Move up, Move down and Delete as drawn on the Direction sheet. The theme switch sits in its own card under the sheet, last on the page; nothing is fixed to the bottom, so no content hides under a bar. Under 640 px the title-only header scrolls away and only the head band and add row stay pinned (105 px, today pins 108). The gutter is 12 px, and 4 px under 375, so at 390 one title in six wraps (Book a dentist appointment) and at 360 two (that one and Renew the library card); none is truncated. (beside `mini-projects-proposed-list-390`)
- A title is plain wrapping text with one `<button aria-label="Edit <title>">` laid over its cell. `Edit <title>` is new copy: it contains the visible title (voice control works), and it ends the duplicate name with the checkbox, which stays named by the task. Hover and keyboard focus draw a 1 px dotted underline on the title as the cue that it edits; one click still opens the field. (beside `mini-projects-proposed-list-1280`)
- Density at 1280: header 48, head band 40, add row 40, and 36 px rows for a mouse at 1024 px and wider (the direction said 40; the density rule decides), so 18 of a 24-task list show on 1280x800 against today's 19, with the filter and add row always in view. Under 1024 or on touch, rows are 40 or 48. (beside `mini-projects-proposed-list-1280`)
- Touch at every width: under `(hover: none)` the phone row (48 px rows, grip column, actions at rest, the ⋮ menu) applies at any width, as today shows its actions on touch. The Direction sheet draws the 768 px touch case. The edit row never changes height or moves the checkbox: at 1280 a 32 px field and Save in the 36 px row; on the phone the grip slot stays empty, the field takes the title slot and Save the ⋮ slot. (beside `mini-projects-direction`)
- Edit row: the title field takes a 2 px ink frame and the row's ink bar; at 1280 it keeps today's drag, Move up, Move down and Delete beside a Save button, on the phone only the grip slot (empty), the checkbox, the field and Save show; the field is one line and scrolls its text. Enter saves and Escape cancels as today; no touch Cancel is drawn, as there is none today. (beside `mini-projects-proposed-edit-row-1280`)
- Empty filter: Completed chosen, the add row stays first, then `No tasks.` in ink-muted on its own 48 px row. Today's copy is kept; first-use and no-results wording is not split, since the app has one string. (beside `mini-projects-proposed-empty-filter-1280`)
- Azeret Mono (Google Fonts) at 400, 500 and 700 in four sizes: 18/24 title, 14/22 rows at 1280, 16/24 rows at 390, 12/16 labels. The icons are drawn here as strokes; the app keeps the Material Symbols Outlined font and its glyph names. (beside `mini-projects-direction`)

## Reopened rules

- Recorded (design-rules.md, App Shell): "Theme switch: Light, Dark, System on the footer's right", "Content container: max-width 672px, border 1px solid #000" and "Footer: sticky bottom, 36px". Proposed: the filter moves into the sheet's head band, the add row comes first, the footer goes, the Theme switch moves to the header (under the sheet on the phone), and the sheet is 720 px with a 1 px line edge. (beside `mini-projects-direction`)
- Recorded (design.md): "The palette is strictly binary and functional. High-contrast black is used for all structural elements." Proposed: ink stays the only action colour, and a pale green tints the surfaces only (OKLCH hue about 138): page, sheet, bands and head. It is a surface tint, not an accent. (beside `mini-projects-direction`)
- Recorded (wiki/decisions.md, brief 03): the toast is "top centre, one at a time, closed after 5 s". Proposed: on the phone it is a bottom bar with a 16 px inset, so it never covers the header or the first row; at 1280 it stays top centre. The 5 s and the one-at-a-time rule are unchanged. (beside `mini-projects-proposed-list-390`)

## The Floor

- Contrast is scripted over 24 pairs, both themes: text min 5.34 light and 5.37 dark, edges, icons and focus ring min 3.70 and 3.18. Surface on ground is 1.13 light and 1.16 dark, with a line edge of 1.45 and 1.80 against the page. No page overflow at 1280, 1024, 768, 390 or 360 in either theme, and no control spills its own box (the edit field scrolls its text, as an input does). First screen on 24 tasks: 18 rows at 1280x800 (today 19), 13 at 390x844 and 11 at 360x800. Phone targets are 44 px wide or more (the grip is 40 under 375) and 48 px tall. Sloplint on the three Proposed pages, both themes: 0 FAIL and no REFLEX. The touch row also holds at 768 on a touch screen, and the add field and every edit field stay one line. (beside `mini-projects-direction`)

## Other notes

- Proposals, not today's strings: the field error `Enter a task.` and the label `New task` on the Direction sheet's input specimen, and the loading row's styling (its text, `Loading...`, is today's).
- Handoff: manifests/mini-projects.tokens.css and mini-projects.tokens-map.md carry the tokens in the app's own names (light-dark() colours, as its stylesheet does).
- Numbered markers 1 to 5 on the 1280 list: 1 the chosen theme as an outline, 2 the chosen filter as the one solid block, 3 the add row first, 4 hover as an ink bar with the actions, 5 a done row in ink-muted with a line through it.

## Contrast, as measured

| Pair | Light | Dark | Needs |
|---|---|---|---|
| ink on surface | 17.46 | 13.21 | 4.5 |
| ink on band (even row) | 16.12 | 11.94 | 4.5 |
| ink on head (head band, Show) | 14.65 | 11.01 | 4.5 |
| ink on ground | 15.41 | 15.29 | 4.5 |
| ink-muted on surface (add row, placeholder) | 6.37 | 6.46 | 4.5 |
| ink-muted on band (done title) | 5.88 | 5.84 | 4.5 |
| ink-muted on head (Show label) | 5.34 | 5.39 | 4.5 |
| ink-muted on ground | 5.62 | 7.48 | 4.5 |
| on-accent on accent (chosen filter, tick) | 17.46 | 15.29 | 4.5 |
| danger on surface (Delete, error icon) | 7.12 | 6.44 | 4.5 |
| danger on band | 6.57 | 5.82 | 4.5 |
| danger on head (Delete in a hovered menu row) | 5.98 | 5.37 | 4.5 |
| on-callout on callout (board marker) | 6.46 | 8.3 | 4.5 |
| outline on surface (checkbox, field edge) | 4.4 | 3.82 | 3 |
| outline on band (checkbox edge) | 4.07 | 3.45 | 3 |
| outline on head (segment edge) | 3.7 | 3.18 | 3 |
| ink on surface (chosen theme frame, hover bar, focus ring) | 17.46 | 13.21 | 3 |
| focus ring on band | 16.12 | 11.94 | 3 |
| focus ring on head | 14.65 | 11.01 | 3 |
| focus ring on ground | 15.41 | 15.29 | 3 |
| surface on ground (sheet, header, theme card) | 1.13 | 1.16 | 1.09 |
| line edge on ground (sheet edge) | 1.45 | 1.8 | 1.3 |
| head on surface (head band) | 1.19 | 1.2 | 1.09 |
| band on surface (zebra, not a surface) | 1.08 | 1.11 | 1.05 |

## The runner-up

**Runner-up: A, Utilitarian, settled (sketch only, not built)**

Note: how this direction was picked. Two directions were sketched (A evolve today, B the greenbar sheet) and two judges compared every pair against today, in both orders, at 1280 light and 390 dark. All 12 verdicts agreed: B won 4 of 4, A 2, today 0 (today's pale filters and tiny grey footer caps failed legibility). A lost to B on grouping: B puts the filter and the add row at the top of one banded card. Say so here if you'd rather keep today's layout (A) with only the type and colour fixed.

## The artboards on the board

- Direction · Greenbar sheet
- List · 1280 · light · today
- List · 390 · light · today
- A row in edit · 1280 · light · today
- A row in edit · 390 · light · today
- Empty filter · 1280 · light · today
- Empty filter · 390 · light · today
- List · 1280 · light · proposed
- List · 390 · dark · proposed
- A row in edit · 1280 · light · proposed
- A row in edit · 390 · dark · proposed
- Empty filter · 1280 · light · proposed
- Empty filter · 390 · dark · proposed
- Runner-up A, Utilitarian, settled · light 1280 (sketch)
- Runner-up A, Utilitarian, settled · dark 390 (sketch)
