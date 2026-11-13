# Task 07: The todo app serves its icon font itself

**Depends on:** [brief 04](../done/04-the-web-app-to-tailwind.md) (the one stylesheet and its layers) and [brief 06](../done/06-a-redesign-with-hallmark-on-the-estate-board.md) (Azeret Mono is already self-hosted from `@fontsource`).

**Runs before:** nothing. **Origin:** the todo `self-host-the-icon-font` (2026-11-11), promoted on 2026-11-13 and removed from `todos/`. Brief 04's builder asked it (board question 2 on `mini-projects-04`) and the controller decided yes, as its own small brief.

**Before you start:** run `brief-board guide` ([corpus/CLAUDE.md](../../CLAUDE.md)).

## Context

The app loads Material Symbols from Google Fonts through an `@import url()` in `literally-a-todo-app/frontend/src/styles/index.css`. That costs three things:

- **Offline, every glyph renders as its ligature word.** `components/Icon.tsx` clips the word to a one-em box, so it can't cover the next button, but the icon is still missing.
- **The page asks a third party for the font on every visit.**
- **`vite build` hoists the remote `@import` above the `@layer` statement,** so the `vendor` layer is declared first in the build, below Tailwind's reset. The dev server keeps the written order. A local file is inlined by Tailwind and keeps its place.

## Decisions

Decided 2026-11-13 (controller): self-host from an `@fontsource` package at an exact pin, the estate's rule and the way Azeret Mono already ships. The glyph set the app needs is small, so use the package's smallest variant that covers it.

## Files you OWN

- `literally-a-todo-app/frontend/src/styles/index.css`, `frontend/package.json` and both lockfiles it touches.
- `literally-a-todo-app/frontend/e2e/drag.spec.ts` (point the font block at the local file).
- `literally-a-todo-app/frontend/src/components/Icon.tsx` (its comment only, if it names Google).
- Docs that name the remote font: `literally-a-todo-app/docs/wiki/frontend-rules.md`, `design-rules.md`.
- Corpus: [wiki/status.md](../../wiki/status.md), [log.md](../../log.md).

## Files you must NOT touch

- `backend/`, every other project, the redesign's tokens and the components' behaviour.

## What to do

1. Install the Material Symbols outlined font from `@fontsource` (the `material-symbols-outlined` package of `@fontsource` or `@fontsource-variable`), pinned exactly. Import its CSS from a local file in `layer(vendor)`, replacing the remote `@import`. Keep the look: same glyphs, same size and weight.
2. Subset it if the package allows (a fixed-axis or woff2-only variant instead of the full variable font). Record the font's size before and after in the log.
3. `e2e/drag.spec.ts` blocks the font to prove a click still lands. Keep that spec and point it at the local file.
4. Check the layer order in the built CSS, not only in dev, and that nothing in `dist/` or the source names a remote font host.

## Acceptance

- [ ] The package is at an exact version (no range) in `package.json`.
- [ ] No request leaves the machine for a font: the built CSS and `index.html` hold no off-site font URL.
- [ ] The glyphs look the same as before (a screenshot of the list rows, compared by eye).
- [ ] `npm run check` passes in `literally-a-todo-app/`, the frontend's Playwright specs pass with `--workers=2`, and `bash corpus/lint.sh` ends clean.

## Outcome (2026-11-13)

Built in commit `7a95c9d`. `frontend/src/styles/index.css` imports `@fontsource/material-symbols-outlined/400.css` (pinned 5.3.9, exact) in `layer(vendor)` where the Google `@import url()` was; `e2e/drag.spec.ts` now aborts the local font file; `design-rules.md` no longer says Google Fonts. In the build the layers come out in the written order (theme, base, vendor, components, utilities), and `dist/` and the source name no off-site font URL. In a browser against the dev server the font loaded from the app's own origin and the icons drew.

- **Size:** the package has no glyph subset, so the font is the full latin 400 file: 323 kB woff2 (a 380 kB woff fallback is bundled but browsers with woff2 never fetch it). The previous size is not recorded: the Google file was remote and not fetched. A real subset would mean committing a font file that is not the package's, so it was left out.
- **One difference:** the static font has no variable axes, so the optical size is fixed at 24 where Google's served 20 to 48 by font size, and `FILL` is gone. `Checkbox.tsx` still sets `font-variation-settings: 'FILL' 1` on the `check` glyph, which has no enclosed area and looks the same either way, so it was left alone as outside the brief's files. The variable package would keep the axes at 1.1 MB.
- **Checks:** `npm run check` in `literally-a-todo-app` exits 0, and the frontend's Playwright run passes 30 specs (32 shot specs skipped by design) with 2 workers on a private port.
