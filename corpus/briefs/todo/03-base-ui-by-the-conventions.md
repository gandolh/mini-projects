# Task 03: The todo app's Base UI by the conventions

**Depends on:**

- In this repo: brief 01 (Base UI pinned at 1.9.0) and brief 02 (the harness, the formatter, the Playwright setup its decision 12 adds, and `.claude/rules/web.md`).
- In the owner's skills library:
  - brief 02, *A base-ui skill, styled with Tailwind*: rules 1-13, the references and `check-base-ui.mjs`;
  - brief 15, *Enforce the base-ui and code-structure skills in every repo*: the checker runs `--warn-only` until this brief is done.
- The owner's grilling of 2026-11-10 and its technical calls: Q15 (Base UI only under `ui/`), Q16 (where native controls stay), Q41 and Q57 (the filter's control), Q59 (where wrappers live), Q60 (tests), Q47 and Q49.

**Runs before:** 04. This brief changes structure and behaviour. Brief 04 then changes only the styling, so its before and after screenshots compare like with like.

**Before you start:** run `brief-board guide` ([CLAUDE.md](../../CLAUDE.md)).

## Context

The owner's call of 2026-11-09 is Base UI everywhere at 1.9.0, with the base-ui skill's conventions enforced in each repo. The todo app uses three Base UI parts through three wrappers. This brief moves them to where the conventions put them, closes the gaps the audit below found, and fixes the drag handle, which brief 01 left to it. It does not move styling to Tailwind; that is brief 04. The wrappers keep their inline `style` props here.

### The audit against rules 1-13 (read 2026-11-10, on `frontend/src`, after the 1.9.0 bump on a scratch copy)

Paths are under `literally-a-todo-app/frontend/src/`.

| Rule | Violations | Where |
|---|---|---|
| 1. Exact pin | 0 once brief 01 lands | `frontend/package.json:13` is `^1.4.1` today |
| 2. Subpath imports | 0 | `components/shared/Button.tsx:1` (`/button`), `Checkbox.tsx:1` (`/checkbox`), `Separator.tsx:1` (`/separator`) |
| 3. Base UI only under `ui/` | **3** | the three files above sit in `components/shared/`, not `components/ui/` |
| 4. Tailwind on the parts | all of it | There is no Tailwind. The three wrappers style with `style={{…}}`. **Brief 04's work.** |
| 5. One stylesheet, no inline `style` | **31 inline `style={` props in 8 files** | `App.tsx` 7, `TodoItem.tsx` 11, `AddTodoField.tsx` 4, `TodoList.tsx` 3, `FilterTabs.tsx` 2, `shared/Checkbox.tsx` 2, `shared/Button.tsx` 1, `shared/Separator.tsx` 1. Plus `index.css`, and `App.css` until brief 02 deletes it. **Brief 04's work.** |
| 6. Semantic tokens | 31 raw hex values | `#000` 12, `#999` 9, `#fff` 6, `#f9f9f9` 2, `#1a1c1c` 1, `#f3f3f4` 1. **Brief 04's work.** |
| 7. Motion | 2 transitions | `index.css:43`, `components/TodoList.tsx:128`. **Brief 04's work.** |
| 8. Floating parts portalled | 0 | No Base UI popup exists. The toast is sonner's (rule 13's row). |
| 9. A trigger around a component uses `render` | 0 | No `Trigger` anywhere. |
| 10. `Select.Root` with `items` | 0 | No select. |
| 11. No `window.confirm`, `alert`, `prompt` | 0 | Delete is one click with no confirm and no undo (`TodoItem.tsx:62-64`). That is a behaviour, not a violation. |
| 12. Dialogs, and `aria-label` on every icon-only control | **7** | No dialog exists. The icon-only controls fail: see "Accessible names" below. |
| 13. Base UI over hand-built widgets | **3** | See below. |

Commands: `grep -rn "@base-ui" frontend/src`, `grep -rn "style={" frontend/src --include=*.tsx | wc -l` (prints 31), `grep -rnoE "#[0-9a-fA-F]{3,6}\b" frontend/src --include=*.tsx --include=*.css`, `grep -rnE "confirm\(|alert\(|prompt\(" frontend/src` (prints nothing).

**Rule 13's three:**

1. **The filter, `components/FilterTabs.tsx`. This is Q41 and Q57's filter that switches what a list shows, and today it is not a widget at all.** It is a `<nav>` (line 17) holding three `shared/Button`s (line 19), one per entry of `TABS` (lines 9-13). The chosen filter lives in `App.tsx:10` (`useState<Filter>('all')`). Nothing in the markup says which one is chosen: no `role`, no `aria-selected`, `aria-pressed` or `aria-current`. The chosen one is drawn by inline style only (border, weight and colour, lines 24-27). Each button is its own Tab stop and there are no arrow keys. The nav is centred in the header with `position: absolute; left: 50%` (`App.tsx:32`), which is also the cause of the phone overlap in the corpus todo [todo-header-overlaps-on-phones](../../todos/todo-header-overlaps-on-phones.md).
2. **The toast is sonner.** `App.tsx:2` and `:72` (`<Toaster position="top-center" />`), and `toast.error(...)` at `TodoItem.tsx:58` and `:63`. sonner is a third-party toast that injects its own CSS at run time, which rule 5's one stylesheet can't hold. Base UI 1.9.0 ships `Toast` (`@base-ui/react/toast`, with `createToastManager`).
3. **Two click-only elements that act as buttons:** `AddTodoField.tsx:38` (a `<div onClick={activate}>`, "Add a new task...") and `TodoItem.tsx:105` (a `<span onClick={startEdit}>` holding the title). Neither takes focus or a key, so a keyboard user can't add or rename a task. They become native buttons through the `Button` wrapper (the text input stays native, Q16).

### Accessible names (rule 12's last bullet, and the wrapper's own bugs)

- **The icon glyphs are text.** Material Symbols draws an icon from a ligature, so the button's content is the word `keyboard_arrow_up`. A button's accessible name comes from its content before its `title`, so a screen reader announces the ligature word, not "Move up". The glyph spans are at `AddTodoField.tsx:90`, `TodoItem.tsx:125, 131, 136, 141, 148` and `shared/Checkbox.tsx:29`. None has `aria-hidden`.
- **Six icon-only buttons have no `aria-label`:** the drag handle (`TodoItem.tsx:124`, no `title` either), Move up (130), Move down (135), Delete (140), the edit's Save (146) and the add field's Save (`AddTodoField.tsx:85`). Five have a `title`, which is a tooltip, not a name.
- **The checkbox has no name at all.** `shared/Checkbox.tsx:10` renders `Checkbox.Root` with no label, and `TodoItem.tsx:81` passes only `checked` and `onChange`.
- **The wrapper `Button` drops every prop it doesn't list.** `shared/Button.tsx:4-12` names seven (`variant`, `onClick`, `onMouseDown`, `children`, `style`, `title`, `disabled`; brief 01 counts six without `variant`), and line 14 destructures them. `aria-label`, `className`, `ref` and the drag handle's pointer handlers are discarded.

### The drag handle (brief 01's lead)

Brief 01 recorded that a scripted drag of 72 px in Chrome left the order unchanged on 1.4.1, with the cause unconfirmed. Read on 2026-11-10:

- `TodoItem.tsx:124` spreads `dragHandleProps` (use-gesture's `bind()`, `TodoList.tsx:121`) onto `Button variant="icon"`. The wrapper never passes them on (above), so `onPointerDown` never reaches the DOM. That alone explains a drag that never starts.
- 01 also saw a control that forwarded the rest fail the same script. So there may be a second cause. Candidates, in the order step 6 checks them:
  1. the handlers are dropped (certain);
  2. the handle has no `touch-action: none`, so on a touch screen the browser scrolls instead of dragging (use-gesture's documented requirement). The owner's main phone is Android, so this one matters;
  3. `TodoList.tsx:114` clamps `to` at 0 but not at the list length (`splice` tolerates it, so harmless);
  4. `onDragEnter` and `onDragLeave` at `TodoList.tsx:130-131` are HTML5 drag events that never fire here, because nothing is `draggable`. The `dragOver` state at line 100 is never true, so the row highlight at line 126 is dead code.

### What it does not use

Base UI's `Field`, `Input`, `Tooltip`, `Dialog` and `AlertDialog` are not used and, by the defaults below, not adopted. The two text inputs (`AddTodoField.tsx:67`, `TodoItem.tsx:85`) stay native (Q16).

## Decisions

Items marked "decided" are final. The rest are defaults this brief builds.

1. **Base UI only under `ui/`** (decided 2026-11-10, technical call, Q15) and **wrappers in `components/ui/`** (technical call, Q59): flat. `components/shared/` goes.
2. **The filter** (decided 2026-11-10, technical call, Q41 and Q57). A filter that switches what a list shows is a Base UI `RadioGroup` with `Radio` items, because arrow keys may choose and one item is always chosen. `Tabs` is for a control that switches panels, and this one has one list and no panels, so `Tabs` is rejected. The wrapper is `ui/RadioGroup.tsx`, and brief 04's theme switch uses the same wrapper. It gives one Tab stop, arrow keys and `role="radiogroup"` with `aria-checked`. `FilterTabs` keeps its name; its props stay `filter` and `onFilterChange`, and it draws the three radios as a row of tab-like buttons (the look is brief 04's). Step 1 confirms on a scratch copy the `data-checked` attribute the styling will key off.
3. **The toast** (rule 13). Default: replace sonner with Base UI `Toast`, behind one wrapper that keeps the call `toast.error(message)`. Same text, top centre, one at a time, about 5 s. `sonner` leaves `package.json`. The alternative is to keep sonner and record it in `scripts/conventions.json`, which leaves a runtime-injected stylesheet that brief 04 can't style.
4. **The click-only elements** become buttons. Default: yes, both, with no visible change (same text, same size). The add field's "placeholder" row becomes a `Button` that looks as it does today.
5. **Icon names.** Default: a small `components/Icon.tsx` (not Base UI, so not under `ui/`) renders the glyph with `aria-hidden`, and every icon-only button gets an `aria-label`. The `title` tooltips stay as they are. Base UI `Tooltip`s are a visual change and touch screens have no hover, so not here.
6. **`focusableWhenDisabled`** on the first row's Move up and the last row's Move down. Default: no. A disabled arrow staying out of the Tab order is fine, and nothing explains why it is disabled.
7. **Tests** (decided 2026-11-10, technical call, Q60). vitest with jsdom and Testing Library, added in this brief, only for wrappers that hold logic: `Button` forwarding, `Checkbox`'s label, `RadioGroup`, `Toast`, and the pure drop function. Flows stay in Playwright, in the `frontend/e2e/` setup brief 02 adds: Enter and Space on the two new buttons, finding every icon-only button and the checkbox by role and name, and a failed update showing its toast. Tests select by role, and `data-testid` only where no role fits (Q62).
8. **Drag in the tests** (decided 2026-11-10, technical call, Q60). The drop arithmetic becomes a pure function with a unit test, and the real gesture is a Playwright spec kept in `frontend/e2e/`, run with a mouse and with Android touch emulation against a stateful `page.route` mock of `/api/todos`, whose order the spec reads back. A throwaway pass against the real backend on a scratch copy goes in the log.

## The wrapper set: `frontend/src/components/ui/`

| File | What it is | From |
|---|---|---|
| `Button.tsx` | Base UI `Button`. Takes `ComponentProps<typeof BaseButton>` plus `variant`, and passes the rest on, `ref` included. Removes the `as object` cast at `TodoItem.tsx:124`. | `components/shared/Button.tsx`, moved and widened |
| `Checkbox.tsx` | Base UI `Checkbox`. `label` (required) becomes `aria-label`. The `checked &&` inside `Indicator` (line 27) goes, because `Indicator` mounts only when checked. | `components/shared/Checkbox.tsx`, moved |
| `Separator.tsx` | Base UI `Separator`, unchanged. | `components/shared/Separator.tsx`, moved |
| `RadioGroup.tsx` | Base UI `RadioGroup` and `Radio`: `value`, `onValueChange`, `items` of `{ label, value }`. | new; `FilterTabs` uses it, and brief 04's theme switch |
| `Toast.tsx` | Base UI `Toast` with a module-level `createToastManager()`. Exports `toast.error(message)` and `<Toaster />`, which renders `Toast.Provider`, `Portal` and `Viewport`. | new; replaces sonner |

`Icon.tsx`, `AddTodoField.tsx`, `FilterTabs.tsx`, `TodoItem.tsx` and `TodoList.tsx` stay in `components/`. `FilterTabs` keeps its name and props and becomes a thin user of `ui/RadioGroup`.

## Files you OWN

- `frontend/src/components/ui/**` (new), the three files moved out of `components/shared/`, and every import of them (`App.tsx:6`, `FilterTabs.tsx:2`, `AddTodoField.tsx:3`, `TodoItem.tsx:5-6`).
- `frontend/src/components/FilterTabs.tsx`, `AddTodoField.tsx`, `TodoItem.tsx`, `TodoList.tsx` and `frontend/src/App.tsx`, for the behaviour changes below.
- `frontend/src/components/Icon.tsx` (new).
- The tests for all of the above, in `frontend/src/**/*.test.tsx`.
- `frontend/package.json` and its lockfile: remove `sonner` if decision 3 stands. No new Base UI dependency: `radio-group`, `radio` and `toast` ship in 1.9.0. New dev dependencies: `vitest`, `jsdom` and Testing Library, pinned.
- `scripts/conventions.json` at `literally-a-todo-app/` if an exception is needed, and the `check-base-ui` entry in `literally-a-todo-app/package.json` (the scripts-only file brief 02 creates).
- `literally-a-todo-app/.claude/rules/web.md` (the wrapper lines).
- `literally-a-todo-app/docs/wiki/frontend-rules.md`: the file layout and the stack list.
- Corpus: `wiki/decisions.md` (brief 02 creates it), [wiki/status.md](../../wiki/status.md), [log.md](../../log.md).

## Files you must NOT touch

- `literally-a-todo-app/backend/`, and every other project.
- Styling: the inline `style` props, `index.css`, colours, sizes. A change that needs a visual change is a finding for the log, not a restyle. Brief 04 owns it.
- `frontend/src/api/todos.ts` and `frontend/src/hooks/useTodos.ts`, apart from what brief 02's step 3 already changed.
- The text inputs and the optimistic-update logic.

## What to do

One commit per numbered step. After each, `npm run check` in `frontend/` passes, with `check-base-ui` `--warn-only`.

1. **Before.**
   - Run `check-base-ui` strict and record its counts by rule. Expect rule 3 at 3, and rules 5 and 6 at whatever the checker counts.
   - On a scratch copy, confirm the `data-checked` attribute on `Radio.Root` in 1.9.0, and that `Toast.createToastManager` can be called from outside React (read `node_modules/@base-ui/react/toast/createToastManager.d.ts`).
   - Run the drag script on the unchanged app (step 6's script) and record that the order does not change.
   - Take screenshots at 1280 and 390 px: the list, a row under the pointer, the editing row, the add field open, an empty filter, and a failed update's toast (stop the backend, tick one). Keep them out of git.
2. **Move the wrappers** with `git mv` into `components/ui/`, and update the imports. Rule 3 reaches 0.
3. **`Button` forwards the rest.** Widen the props, pass `ref` and everything else on, drop the cast at `TodoItem.tsx:124`. Test: a button given `aria-label` and `data-x` shows both in the DOM.
4. **Names.** Add `Icon.tsx`. Give every icon-only button an `aria-label` ("Drag to reorder", "Move up", "Move down", "Delete", "Save"). `Checkbox` takes `label`, and `TodoItem` passes the task's title. Tests: `getByRole("button", { name: "Move up" })`, `getByRole("checkbox", { name: <title> })`, and no element's accessible name equals a ligature such as `keyboard_arrow_up`.
5. **Buttons for the two click-only elements** (`AddTodoField.tsx:38`, `TodoItem.tsx:105`). Enter and Space on each do what a click does. Tests for both.
6. **The drag handle.** Reproduce first, then fix in the order of the candidates:
   - Script: Playwright with Chrome on a scratch copy, three tasks, a real mouse (`mouse.move` with `steps`, down, move 72 px, up) and a touch emulation pass (Android profile). Read the order back from `GET /api/todos`.
   - Fix the cause each candidate proves. Candidate 2's fix is `touch-action: none` on the handle, which is behaviour, not styling.
   - Move the arithmetic (`TodoList.tsx:110-115`) into a pure function, clamp `to` to the list, and unit-test it.
   - Delete the dead `dragOver` state and its two handlers (candidate 4), unless the script shows they matter.
   - Record in the log which candidates were causes.
7. **`RadioGroup.tsx`**, and `FilterTabs` on it. Keep: the three labels, `all` as the default, the header's layout (no change to `App.tsx:32`). Tests: three `radio` roles in one `radiogroup`, one checked, ArrowRight moves the choice and the list's filter (jsdom, on the wrapper).
8. **`Toast.tsx`**, and the two `toast.error` calls on it. Keep the text, top centre, one at a time. Test: a failed update (mock `api/todos.ts` to reject) shows "Failed to update todo" in a live region. Remove `sonner`.
9. **After.**
   - Take the screenshots again. The layout and colours should match; list any visible difference with its reason (Q19: a few pixels of drift needn't be listed).
   - Run `check-base-ui` strict: rules 1, 2, 3 and 8-11 report 0. Rules 4-7 are left for brief 04, and their counts go in the log.
   - Drop `--warn-only` from `check-base-ui` only if rules 4-7 pass; otherwise leave it and say so.
   - Update `.claude/rules/web.md`, `docs/wiki/frontend-rules.md`, `wiki/decisions.md` (brief 02 creates it) (Base UI is used through `components/ui/`, `sonner` replaced, the filter's pattern and why), [wiki/status.md](../../wiki/status.md) and [log.md](../../log.md). Run `bash corpus/lint.sh --index`, then `bash corpus/lint.sh`, until clean.

## Acceptance

- [ ] `grep -rn "@base-ui/react" literally-a-todo-app/frontend/src | grep -v "components/ui/" | grep -v "\.test\."` prints nothing, and `components/shared/` doesn't exist.
- [ ] `check-base-ui` strict reports 0 for rules 1, 2, 3, 9, 10 and 11, and the counts for 4-7 are in the log entry.
- [ ] A Playwright spec finds every icon-only button by its name, and finds the checkbox by its task's title. `grep -rn "material-symbols-outlined" literally-a-todo-app/frontend/src` shows only `Icon.tsx` and the CSS that defines the class.
- [ ] A Playwright spec shows Enter on "Add a new task..." opens the field and Enter on a title starts the edit.
- [ ] The kept drag spec moves the first of three tasks to the third place, and the mocked `GET /api/todos` returns the new order, with a real mouse and with touch emulation. The pure drop function has a unit test.
- [ ] Tests show three `radio` roles with one checked, and a failed update showing its toast.
- [ ] `grep -n "sonner" literally-a-todo-app/frontend/package.json` prints nothing (if decision 3 stands).
- [ ] `npm run check` passes in `literally-a-todo-app/frontend`, and `bash corpus/lint.sh` ends clean.

## Interplay

- Brief 04 styles `components/ui/` with Tailwind on the parts, replaces the inline styles, and adds the theme switch on the `RadioGroup` wrapper this brief creates. It assumes this brief is done.
- Brief 02's `check-base-ui` stays `--warn-only` until step 9 here.
- The todo [todo-header-overlaps-on-phones](../../todos/todo-header-overlaps-on-phones.md) is about layout. Brief 04 closes it.
