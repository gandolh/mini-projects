---
title: The todo app serves its icon font itself
created: 2026-11-11
status: open
tags: [literally-a-todo-app, icons, offline]
---

# The todo app serves its icon font itself

Brief 04's builder asked this (board question 2 on `mini-projects-04`), and the controller decided yes, as its own small brief.

## Context

The app loads Material Symbols from Google Fonts through an `@import url()` in `frontend/src/styles/index.css`. That costs three things:

- **Offline, every glyph renders as its ligature word.** `components/Icon.tsx` clips the word to a one-em box, so it can't cover the next button, but the icon is still missing.
- **The page asks a third party for the font on every visit.**
- **`vite build` hoists the remote `@import` above the `@layer` statement,** so the `vendor` layer is declared first in the build, below Tailwind's reset. The dev server keeps the written order. A local file is inlined by Tailwind and keeps its place.

## What to do

- Install the `material-symbols` npm package, pinned exactly, and import its outlined font CSS from a local file in `layer(vendor)`. Keep the `.material-symbols-outlined { font-size: 24px }` rule the app already relies on.
- Subset it if the package allows, and record the font's size before and after in the log.
- `e2e/drag.spec.ts` blocks the font to prove a click still lands. Keep that spec, and point it at the local file.
- Check the layer order in the built CSS, not only in dev.
