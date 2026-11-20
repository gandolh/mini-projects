# mini-projects: the controller's rulings over the critic (2026-11-12)

The critic's verdict is fix; its file is board/critiques/mini-projects.md. Everything in it stands, including the smaller items (Completed at 320, an edit hint, the page background), with these rulings:

1. **Touch at every width (critic 1): accept.** The phone row (48 px rows, ⋮ menu, grip column, actions at rest) applies under `(hover: none)` at any width; draw a note on the Direction sheet showing the 768 touch case.
2. **Desktop density (critic 2): accept the measured fix,** 36 px rows for a mouse at 1024 px and wider, header 48, head band 40, add row 40, so 18 rows show at 1280x800. The 36 px row overrides the direction's 40; the density rule decides it.
3. **Phone (critic 3): accept.** Under 640 px the title-only header scrolls away; the head band and add row stay pinned.
4. **Edit row (critic 4): accept.** No height jump, the checkbox doesn't move, one-line field at every width.
5. **Gate 49a (critic 5): accept the recommendation.** The title is plain wrapping text; a `<button aria-label="Edit {title}">` covers the title cell. That passes the floor without truncating and ends the duplicate name with the checkbox. Add a Decision sticky for the new string `Edit {title}`. Don't use the linter's block-child skip. Remove the owner question about the title element.
6. Update the tokens files if a token changed, re-run every Floor check, and report the first-screen rows at 1280x800, 390x844 and 360x800.
