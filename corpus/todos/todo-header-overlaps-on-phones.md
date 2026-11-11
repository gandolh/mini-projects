---
title: The todo app's title runs into its tabs on a phone, and lint has two errors
created: 2026-11-01
status: done
tags: [literally-a-todo-app, layout, lint]
---

# The todo app's title runs into its tabs on a phone, and lint has two errors

Found on 2026-11-01 while taking the README images. At 390 px wide the header's "LITERALLY A TODO APP" and the All, Active and Completed tabs draw on top of each other, so the README shows the desktop layout only.

## Context

- [App.tsx](../../literally-a-todo-app/frontend/src/App.tsx) centres the tabs with `position: absolute; left: 50%; transform: translateX(-50%)`, so they ignore the title beside them.
- `npm run lint` in `literally-a-todo-app/frontend/` fails with two errors in [TodoList.tsx](../../literally-a-todo-app/frontend/src/components/TodoList.tsx): a `setState` called straight inside an effect at line 18, `react-hooks/set-state-in-effect`, and a value modified at line 105, `react-hooks/immutability`. The app still builds and works.
- `src/App.css` is the Vite template's stylesheet and none of its classes are used by the app.

## Acceptance

At 390 px the title and the tabs do not overlap, for example with the tabs on their own row, and `npm run lint` passes.

## Outcome (2026-11-11)

Done. The two lint errors went with brief 02. Brief 04 fixed the header: below Tailwind's `sm` breakpoint the tabs take
a row of their own under the title, and `frontend/e2e/header.spec.ts` checks both widths. Checked at 390 px and on an
emulated Pixel 7 (Chrome's Android profile); a check on a real Android phone is the owner's.
