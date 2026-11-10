# Task 06: A redesign with Hallmark, on the estate board

**Depends on:**

- In this repo: [brief 04](04-the-web-app-to-tailwind.md), which moves the app to Tailwind v4 with a token set and adds the Light / Dark / System switch, and [brief 03](03-base-ui-by-the-conventions.md), which settles the Base UI wrappers in `components/ui/`. A redesign is then mostly a new token set and layout.
- In the owner's skills library:
  - brief 24, which vendors Hallmark as the design skill and adopts taste-skill 2.5's ideas (palettes and type dealt by trade, its copy layer);
  - the estate redesign board: one artifact with a page per app, owned by the skills library.
- The owner's answer of 2026-11-10 (Q39): no bake-off; Hallmark redesigns every web UI, keeping what is useful from taste-skill 2.5, and the owner approves each app on the board before any code changes.

**Runs before:** nothing. **Runs after:** 01 to 04, the redesign last. Brief 05 is server-only and does not block it.

**Before you start:** run `brief-board guide` ([CLAUDE.md](../../CLAUDE.md)).

## Context

`literally-a-todo-app` is one page: a task list with a filter, an add field, per-row actions and a theme switch. It is the smallest web UI in the estate, so its proposal is a single page on the board. The other four projects in this repo are out of scope: `git-helper-ui` has a client but no brief of this set covers it, and the rest have no web UI.

### The screens (read 2026-11-10, `frontend/src/`)

| Screen | What it shows | File |
|---|---|---|
| The page | the header with the title and the filter, the card, the footer with the theme switch; every state below sits inside it | `App.tsx`, `components/FilterTabs.tsx` |
| The list | rows with a checkbox, the title, the drag handle, Move up, Move down and Delete (visible on hover, on focus and on touch) | `components/TodoList.tsx`, `components/TodoItem.tsx` |
| A row in edit mode | the title input with Save | `components/TodoItem.tsx` |
| The add field | closed ("Add a new task...") and open | `components/AddTodoField.tsx` |
| An empty filter | no rows for Active or Completed | `components/TodoList.tsx` |
| The error toast | "Failed to update todo" when a request fails | `components/ui/Toast.tsx` |
| The phone layout at 390 px | the title and the filter on separate rows | `App.tsx` (after brief 04's step 6) |

### What the design docs fix today

- [design-rules.md](../../../literally-a-todo-app/docs/wiki/design-rules.md) and [design.md](../../../literally-a-todo-app/docs/wiki/design.md) record the system: one monospace stack, a 36 px row, 8 px padding, a 1 px border, **0 px radius with no exceptions, no shadows and no gradients**, and six colours in use. `designs/todoapp.html` is the original mock-up. Brief 04 adds the dark values and moves the tokens to `frontend/src/styles/index.css`.
- The theme switch is the owner's call of 2026-11-10 (Q18): Light / Dark / System, light on a first visit, `data-theme` through `@custom-variant`. Brief 04 builds it, and the switch is a `RadioGroup` like the filter (Q41, Q57).
- The README image comes from the steps in [docs/images/shots.md](../../../docs/images/shots.md).

"Utilitarian monospace" is the app's identity (`wiki/decisions.md` (brief 02 creates it), "Utilitarian monospace, styled with Tailwind v4", written by brief 04). The redesign stays inside it unless the owner reopens it on the board.

## Decisions

Decided 2026-11-10 (owner, Q39): Hallmark, with taste-skill 2.5's useful parts; the owner approves on the board before any code. Default: the proposal keeps the monospace stack, the list-as-the-page layout and the one-screen scope. Dropping the 0 px radius rule, the monospace stack or the no-shadow rule is flagged on the board as a reopened decision.

## Files you OWN

- `frontend/src/styles/index.css` (the tokens) and the components listed above, one commit each.
- `literally-a-todo-app/docs/wiki/design-rules.md` and `design.md`, recorded from the shipped result.
- Corpus: `wiki/decisions.md` (the look, if it changes), [wiki/status.md](../../wiki/status.md), [log.md](../../log.md).

## Files you must NOT touch

- `backend/`, and every other project.
- Behaviour: handlers, query hooks, API calls, and the wrappers' logic in `components/ui/`.
- The task wording and labels, unless the board approves a change. No invented tasks, counts or claims.

## What to do

1. **Today.** Take Playwright screenshots of every screen above at 1280 and 390 px, in light and dark, kept out of git. Include a row under the pointer, the editing row, the open add field, an empty filter and the toast.
2. **Propose.** With Hallmark (and taste-skill 2.5's trade palettes and copy layer where they help), make a proposal for the page and its states, inside the recorded decisions. Check each against the Floor: contrast, a visible focus ring, a reduced-motion path, no invented facts, no broken phone layout.
3. **Board.** Put the proposal on this app's page of the estate board, beside today's screenshots at both widths.
4. **Approval.** The owner approves on the board. Nothing below starts before that, and the approval is recorded in `log.md` with its date.
5. **Build.** First as a token change in `styles/index.css` (colours, type, spacing, both themes), then one component per commit. Keep the Base UI wrappers, the row actions on touch and keyboard focus, and the theme switch working.

## Acceptance

- [ ] The owner's approval is on the board and recorded in `log.md` with the date.
- [ ] Contrast: every text and icon pair in both themes clears 4.5:1 (3:1 for large text and UI parts), measured with a script over the built tokens and listed in the outcome note.
- [ ] A Playwright spec tabs through the page and asserts a visible focus ring on every stop, including the row actions.
- [ ] A Playwright spec with `reducedMotion: "reduce"` asserts no running animation or transition.
- [ ] A Playwright spec at 390 px asserts `document.documentElement.scrollWidth <= window.innerWidth`.
- [ ] Every task title and label shown comes from the data or the copy; the outcome note lists none invented.
- [ ] `npm run check` passes in `literally-a-todo-app/frontend`, the e2e specs from briefs 02 and 03 still pass, and `bash corpus/lint.sh` ends clean.

## Interplay

- Brief 04 owns the layers, the token names and the theme switch; this brief changes the tokens and layout on top. The switch must survive in both themes.
- Brief 03's `RadioGroup` is the filter and the switch; a redesign restyles it and keeps its roles and keyboard behaviour.
- Brief 02's formatter and lint run on every redesign commit.
- The todo [todo-header-overlaps-on-phones](../../todos/todo-header-overlaps-on-phones.md) is closed by brief 04. A redesign must not bring the overlap back at 390 px.
