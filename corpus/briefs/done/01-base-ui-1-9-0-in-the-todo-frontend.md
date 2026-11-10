# Task 01: The todo app's frontend on Base UI 1.9.0

**Depends on:** nothing in this repo, and nothing in the owner's skills library. This brief is the repo's copy of the library's brief 04, *Every repo on Base UI 1.9.0*, and it is built right away.

**Runs before:** 02-05. Every later brief assumes `"@base-ui/react": "1.9.0"`.

**Before you start:** run `brief-board guide` ([CLAUDE.md](../../CLAUDE.md)).

## Context

On 2026-11-09 the owner asked for every repo on the latest stable Base UI, pinned exactly (Base UI rule 1). npm's `latest` for `@base-ui/react` was 1.9.0, published 2026-10-09.

### What this repo has (read 2026-11-10)

Command: `grep -rn "@base-ui" --include=package.json . | grep -v node_modules`, from the repo root. One hit:

| `package.json` | Spec | Resolved in its lockfile | Work |
|---|---|---|---|
| `literally-a-todo-app/frontend/package.json:13` | `^1.4.1` | 1.4.1 (`@base-ui/utils` 0.2.8) | bump, pin |

Nothing else in mini-projects declares it: `literally-a-todo-app/backend`, `git-helper-ui/client` and `git-helper-ui/server`, `pw-manager` and the two Python projects don't. `git-helper-ui/client` is a React app with no Base UI; that is a question in brief 04, not this brief.

The two breaking names between 1.4 and 1.9 are not used. Command: `grep -rnE "OTPFieldPreview|otp-field|sanitizeValue" literally-a-todo-app --include=*.ts --include=*.tsx --include=*.json | grep -v node_modules` prints nothing.

### Three components, three imports

All are subpath imports, one per wrapper in `frontend/src/components/shared/`:

- `Button.tsx:1`, `@base-ui/react/button`;
- `Checkbox.tsx:1`, `@base-ui/react/checkbox`, with `Root` (line 10) and `Indicator` (line 26);
- `Separator.tsx:1`, `@base-ui/react/separator`.

### A dry run on a scratch copy (2026-11-10)

The copy was `frontend/` without `node_modules`, in the session scratchpad, never in the repo. Commands, in order: `npm ci`, `npm install @base-ui/react@1.9.0 --save-exact`, then `npx tsc -b`, `npx eslint .` and `npx vite build`.

- `package.json` reads `"@base-ui/react": "1.9.0"`. The lockfile resolves `@base-ui/react` 1.9.0 and `@base-ui/utils` 0.5.0.
- The rest of the tree that moved is Base UI's own: `@floating-ui/react-dom` 2.1.8 to 2.1.9, `@floating-ui/utils` 0.2.11 to 0.2.12, `@floating-ui/core` 1.7.5 to 1.8.0 and `@floating-ui/dom` 1.7.6 to 1.8.0.
- Base UI's optional peers `@date-fns/tz` and `date-fns` are not installed (`peerDependenciesMeta` marks both optional).
- `tsc -b` prints nothing. `eslint .` reports the same 2 errors as before the bump (see below).
- `vite build`: JS 344.51 kB (gzip 109.60 kB) before, 345.57 kB (gzip 110.13 kB) after. CSS is 0.86 kB both times.

**Two errors exist before this brief.** `npm run lint` in `frontend/` fails with `react-hooks/set-state-in-effect` at `frontend/src/components/TodoList.tsx:17` and `react-hooks/immutability` at `frontend/src/components/TodoList.tsx:105` (the finding in the corpus todo [todo-header-overlaps-on-phones](../../todos/todo-header-overlaps-on-phones.md)). This brief doesn't fix them; brief 02 does. Step 3's gate is "no new failures".

## Owner decisions (defaults this brief builds)

1. **Only Base UI is pinned here.** Default: the other dependencies keep their `^` ranges. The estate pins everything exactly in repos like Newspapper, but this repo has no `.npmrc` and nobody has asked. *New question for the grilling.*
2. **Install from the frontend folder.** Default: `npm install @base-ui/react@1.9.0 --save-exact` run inside `literally-a-todo-app/frontend`. There is no root `package.json` and no workspaces: the two projects each have their own lockfile.

## Files you OWN

- `literally-a-todo-app/frontend/package.json` and `literally-a-todo-app/frontend/package-lock.json`.
- A source file only where the bump forces it. The dry run needed none.
- Corpus: [log.md](../../log.md), and [wiki/status.md](../../wiki/status.md) if it names a Base UI version.

## Files you must NOT touch

- Styling. The inline `style` props and the CSS are brief 04's. A bump that needs a visual change is a finding to log, not a restyle.
- `literally-a-todo-app/backend/`, and every other project.
- Other dependencies. No general `npm update`.

## What to do

One commit: `chore(deps): @base-ui/react 1.9.0`.

1. **Re-run both greps** above. If either finds a hit, stop and read the 1.9.0 release notes for it before going on.
2. **Bump.** In `literally-a-todo-app/frontend`: `npm install @base-ui/react@1.9.0 --save-exact`. Then check:
   - `grep -n '"@base-ui/react"' package.json` shows `"1.9.0"` with no `^`;
   - `node -e 'console.log(require("./package-lock.json").packages["node_modules/@base-ui/react"].version)'` prints `1.9.0`;
   - `git diff --stat` shows only the two files, and the lockfile diff names only Base UI's tree (the five packages above, plus `@babel/runtime` if npm moves it).
3. **Run the scripts** in `frontend/`: `npm run build` (that is `tsc -b && vite build`) and `npm run lint`. `build` must pass. `lint` must report exactly the two errors above and no others. There is no `test` script in either project.
4. **Look at it in a browser.** Start `npm run dev` in `backend/` (port 3000) and in `frontend/` (port 5173), with a few todos. For each component, write down any difference from 1.4.1 in the log entry:
   - **Button** (`shared/Button.tsx`): click, Enter and Space on each icon button; a disabled one (the first row's Move up, the last row's Move down) doesn't fire and isn't focusable; the tab buttons in the header switch the list.
   - **Checkbox** (`shared/Checkbox.tsx`): click toggles, Space toggles, the tick shows only when checked, and the optimistic update survives a failed request (stop the backend, tick one, expect the error toast and the box back to unticked).
   - **Separator** (`shared/Separator.tsx`): the 1 px grey line under the header's container is still there.
   - **The drag handle.** Drag the first row's handle down two rows. Before this bump, a scripted drag of 72 px in Chrome left the order unchanged (API order stayed one, two, three), so record whether drag works before and after. The cause is not confirmed: `Button` names only six props (`shared/Button.tsx:14`) and so drops the gesture handlers spread at `TodoItem.tsx:124`, but a control that forwarded the rest did not reorder in the same script either. Brief 03 owns the fix. If drag doesn't work on 1.4.1 either, say so.
5. **Commit and log.** One `log.md` entry, kind `done`: the versions before and after, the behaviour differences from step 4 (or "none found"), and the two lint errors.

## Acceptance

- [ ] `grep -rn "@base-ui" --include=package.json . | grep -v node_modules` prints one line, ending `"1.9.0",`.
- [ ] `node -e 'console.log(require("./literally-a-todo-app/frontend/package-lock.json").packages["node_modules/@base-ui/react"].version)'` prints `1.9.0`.
- [ ] `npm run build` in `literally-a-todo-app/frontend` exits 0.
- [ ] `npm run lint` in `literally-a-todo-app/frontend` reports the two errors named above and nothing else.
- [ ] The `log.md` entry lists every behaviour difference found in step 4, or says none was found.

## Interplay

- Brief 03 moves these three wrappers to `components/ui/` and is the first to depend on 1.9.0's API (the `RadioGroup` and `Toast` parts). It assumes this brief is done.
- The library's brief 04 lists this repo as "bump, pin". Mark that row done there when this brief lands.

## Outcome (2026-11-10)

Pinned `@base-ui/react` at exactly 1.9.0 in `literally-a-todo-app/frontend/package.json` (commit 95f1e3a), 1.4.1 before. The lockfile resolves 1.9.0 and `@base-ui/utils` 0.5.0; besides Base UI's own tree, npm moved the hoisted `@babel/runtime` 7.29.2 to 8.1.0. `npm run build` passes; `npm run lint` shows only the two known `TodoList.tsx` errors (lines 18 and 105). The renamed OTPField and `sanitizeValue` are not used.

Step 4 (browser check of Button, Checkbox, Separator and the drag handle) was not run, so whether drag works before or after the bump is still unrecorded. Brief 03 owns that.
