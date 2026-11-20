fix

# mini-projects (Todo app), Greenbar sheet: design critique, 2026-11-12

Read: today's shots, light and dark, at 1280 and 390. The twins rendered headless at 1280x800, 768, 390x844, 360x800 and 320x640, on the 6-task fixture and on a 24-task copy, with the proposed fixes injected and re-measured. Also the Direction sheet, the manifest's screens and stickies, RESULT.md, and today's `TodoItem.tsx`, `App.tsx`, `ui/Button.tsx` and `ui/Checkbox.tsx` (read only).

The direction holds up: the sheet owns its controls and the phone is a real phone design. What's owed: density at 1280, pinned chrome on the phone, touch tablets, a jumpy edit row, and the title element.

## Regressions against today

### 1. The first screen holds fewer tasks

Measured on the 24-task copy. Today's figures come from its shots and `h-9` classes, not a live run, and there is no 360 shot of today. All of today's rows are one line because today truncates titles. The build wraps one title in six.

| Viewport | Today | Build | Build with the fixes below |
|---|---|---|---|
| 1280x800 | 19 rows; first task at y 69 | 15 rows; first task at y 181 | 18 rows; first task at y 145 |
| 390x844 | 19 rows (36 px, under the 48 px rule) | 13 rows; first task at y 178 | 13 rows |
| 360x800 | 18 rows | 12 rows | 12 rows |

**At 1280 the four rows go two ways.**
- The shell costs about two rows: the header is 56 instead of 36, the head band adds 48 and the add row adds 44. No footer gives 36 back.
- The 40 px rows cost about two more, at +4 px a row.
- **Fix:** header 56 to 48; header-to-sheet gap 32 to 16; head band 48 to 40 (segments are already 32 px); add row 44 to 40; rows 36 px at 1024 px and wider with `pointer: fine` (14/22 text, 7 px padding, still a `min-height`, so titles wrap).
- Measured with the fix: **18 rows against today's 19**, with the filter and the add row always in view. Today hides the add row past about 19 tasks.
- The 36 px row departs from the direction's 40, which the judges never ruled on. Keep 40 and the trims alone give 16.

**On the phone, no fix is owed for the first screen.** Trimming the header to 48 and the head band to 56 moves the first task up to y 166, but it gains no whole row at 390 or 360 (measured). The loss is the 48 px target rule plus wrapped titles, which fixes a recorded fault: at 48 px, today's shell would show 14 rows. Leave those heights as built.

### 2. More of the phone is pinned while scrolling

Pinned height is 165 px (header 56, head band 60, add row 49). Today pins 108 (header 72, footer 36). With the keyboard up for the add field, the pinned part is about 30% of what's left. The phone header carries only the title.

**Fix:** under 640 px, let the header scroll away, and pin the head band at `top: 0` with the add row under it. Measured: pinned height drops to 105, below today's, about one more 48 px row while scrolling. Filter and add row stay in view.

### 3. Touch tablets lose the row actions

The twin switches to the phone row (48 px rows, ⋮ menu, grip column) on width alone, at 640 px. At 768 and wider, actions show only on hover and targets are 40 px. Nothing in the twin or the tokens map is keyed to `hover: none`.

Today shows the actions at every width when the screen has no hover (`[@media(hover:none)]:opacity-100` in `TodoItem.tsx`). On an Android tablet the build hides Move, Delete and Drag.

**Fix:** use the phone row under `(hover: none)` at every width, not only under 640 px. Otherwise, at least show `.acts` with 44x48 targets under `(hover: none)`.

### 4. The edit row jumps

- **Today** the 24 px input sits inside the 36 px row, so nothing moves. **The build** grows the edit row from 40 to 48 at 1280 and from 48 to 56 on the phone, so every row below shifts 8 px on the click (sheet bottom 422 to 430; phone theme card 499 to 507). On the phone the grip column is hidden, so the checkbox slides 44 px left, from x 79 to x 35.
- **Fix at 1280:** a 32 px field with a 2 px ink frame and a 32 px Save, inside the row's own height.
- **Fix on the phone:** keep the grip slot as an empty 44 px column. The field takes the title's slot, Save takes the ⋮ slot, and the row stays 48 with a 40 px field.

### 5. Changes the judges ruled to keep (no fix owed)

- **Phone row actions take two taps:** Move up, Move down and Delete now need the ⋮ menu first, the right price for 48 px targets. **The phone theme switch sits at the page end:** with 24 tasks it's at y 1423, where today's sticky footer kept it in view (both ruling 4).

Grouping is stronger than today, not flatter: the head band is a toolbar on its own tone, the sheet lifts off the ground in both themes, and the hover bar marks the row. Today's 1 px ink frame becomes a 1 px `line` edge, and the bands carry the structure, so the edge needs no change.

## Priority issues (ranked by cost to the user)

1. **Touch tablets** (regression 3): at 768 and wider on a touch screen, Move, Delete and Drag can't be reached. Key the phone row to `hover: none`.
2. **Density at 1280** (regression 1): the trims and the 36 px pointer rows give 18 rows against today's 19.
3. **Pinned chrome on the phone** (regression 2): unpin the title-only header under 640 px. That takes the pinned height from 165 to 105.
4. **The edit row** (regression 4). Also, the 360 comp draws the field wrapping "Reply to the landlord" onto two lines. The app's `<input>` can't wrap, so draw one line whose text scrolls; behaviour is fixed.
5. **The title element and gate 49a:** see the next section.
6. **"Completed" spills its 79 px segment at 320** (`scrollWidth` is larger than `clientWidth`), and sloplint checks 320. **Fix**, measured: under 375 px, set the head band to gap 8 and padding 0 4 px 0 8 px, and the segment buttons to 2 px side padding. The segments become 82 to 83 px with no overflow, and the visible `Show` label stays.
7. **Nothing shows that a title can be edited.** It's the same as today (`cursor: text` only).
   - **Fix:** on hover (`pointer: fine`) and on `:focus-visible`, give the title a 1 px dotted `outline` underline, offset 4 px.
   - **Handoff:** the twin's ground stops at 800 px (`.td{min-height:800px}`), which leaves a 44 px white strip at 390x844. The app needs `min-height: 100dvh`.

## Gate 49a: the task title (for the controller)

**Today:**
- `TodoItem.tsx` renders the title through `ui/Button`, which is Base UI's Button, a real `<button>`. It's set to `flex-1 truncate`, so the title is cut to one line, a fault the direction lists.
- `ui/Checkbox` takes the same title as its `aria-label`, as does the twin's, so both announce two controls named "Plan the week's meals" and only one edits. The build differs from today only in wrapping.

**What a title that opens edit should be:**
- **An activating control, not plain text.** It runs an in-page action and needs keyboard focus. A link is wrong (nothing navigates), a `span` with `onClick` loses the keyboard, and a `<label>` for the checkbox would turn every tap on a title into ticking the task.
- **Wrapped, not truncated.** Wrapping inside a button is valid HTML and accessible. WCAG 1.4.10 and 1.4.4 favour wrapping over clipping.

**The clash:**
- The rule is in `hallmark/references/gates.md` (line 169) and `responsive.md`: 49a is a **Floor**, and its only remedies are "shorten it; `white-space: nowrap`". Both cut the user's words.
- The ruling "Never truncate a title" (ruling 3) wins. Don't use `nowrap` and don't shorten.
- Also don't use sloplint's skip for buttons that hold block children (`sloplint-render.mjs`, line 491). It would pass the gate while leaving the same thing in place.

**Recommended build, which meets the floor and the ruling honestly:**
- Show the title as text: `<span class="title-text">{title}</span>`. It wraps freely.
- Lay one `<button type="button" aria-label="Edit {title}">` over the whole title cell: `position: absolute; inset: 0`, no text content, with the focus ring on the cell.
- The wrapping text is now content, not a button label, which is what 49a means. It also fixes the name clash: the checkbox stays "Plan the week's meals", and the edit control becomes "Edit Plan the week's meals", which contains the visible title (WCAG 2.5.3), so voice control works too.
- `Edit {title}` is new copy, so record it in a Decision sticky. Behaviour is unchanged: one click opens the field.

**Fallback:** keep the `<button>` with the title as its content and add a visually hidden ", edit". That needs gate 49a's scope rewritten to exclude user content, and a floor shouldn't be bent for one app.

## Strengths to keep

1. **The sheet owns its controls.** The filter sits in the head band and the add row comes first. Both stay in view at any list length.
2. **Greenbar banding instead of dividers.** Hover is a 2 px ink bar with no tint, so no band reads as hover (ruling 1 met).
3. **One heavy block.** The chosen filter is the only solid ink fill and the theme is an outline (ruling 2 met). Done rows are ink-muted and struck through with a solid check, with no opacity.
4. **A real phone design, and a designed dark theme.** The phone has 48 px rows, a ⋮ menu, wrapping titles, a bottom toast and one column. Ruling 3 is met: grip and checkbox are adjacent 44 px targets, and titles wrap once in six at 390 and 360 (four in six at 320), none truncated. In dark, ground `#131712`, sheet `#1f251e` and head `#2b332a` step lighter as they lift, and the surfaces still separate.

## Heuristic scores (0-4)

| Heuristic | Score | Why |
|---|---|---|
| Visibility of system status | 3 | Chosen filter, hover bar, done state, loading row and toasts all show. |
| Match with the real world | 3 | Plain words and a visible `Show` label. |
| User control and freedom | 2 | Escape cancels an edit, but Delete has no undo (as today). |
| Consistency and standards | 3 | Segmented RadioGroups, a ⋮ menu on Android, Light / Dark / System. |
| Error prevention | 2 | Delete is one click at 1280, with no undo. |
| Recognition rather than recall | 2 | Click to edit has no cue, and the actions are hover-only, on touch tablets too. |
| Flexibility and efficiency | 3 | Drag, Move up and Move down, Enter and Escape. |
| Aesthetic and minimalist design | 3 | One sheet and one accent, but chrome crowds content at 1280. |
| Error recovery | 2 | "Failed to update todo" offers no retry. |
| Help and documentation | 3 | Self-evident for a one-list app. |

Total: 26 of 40.

**Detector.** I ran a copy of `detect.mjs` with the parser packages from presentation-sites, so it was not degraded. I dismissed every finding:
- **`cramped-padding`** (6 per screen, 50 on the Direction sheet) on `.seg`, `.sheet`, `.sh`, `.toast`, `.fld`, `.add` and `.row`: full-bleed bands and segmented controls by design. **`clipped-overflow-container`** on `html` and `body`: sticky children. Both false positives.
- **`flat-type-hierarchy`** (12/14/16/18). At any one width only three sizes apply, because 16 is phone-only. The recorded "Utilitarian monospace" decision puts hierarchy in weight and ink.

Don't dilute these while fixing: the banded sheet that carries its own filter and add row, the single ink block, and titles that wrap and are never truncated.
