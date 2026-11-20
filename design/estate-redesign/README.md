# The redesign: "Greenbar sheet"

This folder is the design record of Todo app's redesign. The estate redesign board, where it was drawn and approved, is a private canvas; this is a copy of the app's page on it plus the build behind that page. The owner approved it on 2026-11-13, and [brief 06](../../corpus/briefs/done/06-a-redesign-with-hallmark-on-the-estate-board.md) built it. The code is now the source of truth: where the app and these files differ, the app wins, and later work may have moved a screen on. Read this folder to see what was decided and why before reshaping a screen.

## The owner's decisions

The owner approved the whole board on 2026-11-13, with every question standing at what the board proposed unless they reopened it. The questions this app's page asked:

- **Ask:** 1. Phone row actions: at 390, Move up, Move down and Delete go into a ⋮ menu named `More actions for <title>` on every row, and the drag handle stays inline. Four 44 px targets would leave about 100 px for a title. It is the app's first menu and it ends "actions always shown on touch". OK?
2. Approve this direction? Greenbar sheet reopens the recorded page shell and adds a pale green tint to the black-and-white palette (the two reopened stickies say what and where). Or keep only the runner-up, Utilitarian settled?
3. One Google mono face, Azeret Mono, replaces the system mono stack so every OS shows the same letters. OK?
- **Reopened:** Recorded (design-rules.md, App Shell): "Theme switch: Light, Dark, System on the footer's right", "Content container: max-width 672px, border 1px solid #000" and "Footer: sticky bottom, 36px". Proposed: the filter moves into the sheet's head band, the add row comes first, the footer goes, the Theme switch moves to the header (under the sheet on the phone), and the sheet is 720 px with a 1 px line edge.
- **Reopened:** Recorded (design.md): "The palette is strictly binary and functional. High-contrast black is used for all structural elements." Proposed: ink stays the only action colour, and a pale green tints the surfaces only (OKLCH hue about 138): page, sheet, bands and head. It is a surface tint, not an accent.
- **Reopened:** Recorded (wiki/decisions.md, brief 03): the toast is "top centre, one at a time, closed after 5 s". Proposed: on the phone it is a bottom bar with a 16 px inset, so it never covers the header or the first row; at 1280 it stays top centre. The 5 s and the one-at-a-time rule are unchanged.

Where the files below disagree, the later layer wins: the owner's decisions, then the controller's rulings, then the judges' rulings, then the directions file.

## What is here

| Path | What it holds |
|---|---|
| `directions/mini-projects.md` | The director's brief: both directions (the winner is the one built), the shared fixture and the screens to draw. |
| `judge/mini-projects/RESULT.md` | The blind judging against today and the rulings that came with the win. |
| `critiques/mini-projects-controller.md`, `critiques/mini-projects.md` | The design critic's review against today, and the controller's rulings over it. |
| `manifests/mini-projects.tokens.css`, `manifests/mini-projects.tokens-map.md` | The token hand-off in the app's own names, and the renamed, new and unused tokens. |
| `manifests/mini-projects.board-notes.md` | What the board said beside the screens: the asks, decisions, reopened rules, open questions, the contrast table and the runner-up. |
| `work/mini-projects/twins/*.html` | Each drawn screen as static HTML, light and dark: open one in a browser. |
| `work/mini-projects/shots/` | The twins rendered at 1280 and 390, light and dark, WebP. `direction.webp` is the board's direction sheet. |
| `shots/mini-projects/` | Today's screens as the board showed them before the redesign. |

People's names and data in the pictures come from seeded demo accounts or are invented.

## Not here

The sketches and the judges' images, the runner-up's build (its notes are in the board's notes), the build's scripts, and the screenshots taken while it was built. They stay in the estate build folder.
