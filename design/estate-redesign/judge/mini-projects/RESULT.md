# mini-projects (Todo app): judge result (2026-11-12)

Two opus judges, j2 reversed; all 12 verdicts agree.

| Pair | 1280 light | 390 dark |
|---|---|---|
| T vs A | A (G3 in j1: today's quiet text at about 2.8:1) | A |
| B vs T | B (G3 in j1) | B |
| A vs B | B | B |

Wins: **B 4, A 2, T 0.** Winner B "Greenbar sheet"; runner-up A "Utilitarian, settled". Today lost on legibility (pale inactive filters, tiny grey caps in the footer) and on touch (hover-only row icons on the phone).

## What both judges asked of B (the controller's rulings for the full build)

1. **The banding stays regular, the hover stands apart.** Both judges read zebra plus a hover tint as irregular rows. Keep strict alternation (it is B's signature), and draw hover and focus as their own state that no band can be mistaken for: a 2 px ink bar at the row's left edge plus the row's actions, with no tint of its own.
2. **One solid block in the header.** The chosen filter keeps the ink fill; the chosen theme segment is an outline (ink border, surface fill), so the header carries one heavy block, not two.
3. **Phone row gutter:** close the gap between the grip and the checkbox (the grip sits right next to it, or beside the ⋮ menu at the right edge, your call by what keeps 48 px targets), so fewer titles wrap. Measure the wraps at 390 and 360. Never truncate a title.
4. **Keep:** the add row first in the card, the filter in the list's own head band, one card on a toned page, the theme switch in its own card under the list on the phone, a ⋮ `More actions for <title>` menu on every phone row, solid high-contrast checks.
5. **Ask stickies:** the directions file's three owner questions (the per-row menu on phones, B reopening the page layout and the green tint, one Google mono face).
