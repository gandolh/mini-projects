# Task 04: The todo app's frontend to Tailwind, with a theme switch

**Depends on:**

- In this repo:
  - brief 02, for the gate, the formatter and the `.claude/rules/web.md` this brief extends;
  - brief 03, which puts the Base UI wrappers in `components/ui/`, replaces sonner and settles the markup, so this brief styles each part once, in its final place.
- In the owner's skills library:
  - brief 02, *A base-ui skill, styled with Tailwind*: rules 4-8, the `tailwind.md` reference and the method in `migrating-from-plain-css.md`;
  - brief 27, *A house style, and a quality harness that enforces it*: the `better-tailwindcss` lint;
  - brief 14, *The mini todo app to Tailwind*, the estate draft this brief replaces.
- The owner's grilling of 2026-11-10: Q17 (token names), Q18 and Q19 (answered, below), Q20 (this app is the dry run), Q44 (a root font size other than 16 px), Q57 (an always-one-chosen control), Q61 and Q62.

**Before you start:** run `brief-board guide` ([CLAUDE.md](../../CLAUDE.md)).

## Context

The owner's call of 2026-11-09: Base UI is styled with Tailwind v4, and whole apps move to Tailwind. This is the smallest web app in the estate, and the skills library's open question Q20 makes it the **dry run** of the migrations. So this brief is written as a model for the others: Postern's `layer(legacy)` method, a measured plan, and a gate each step. Where it learns something the method didn't say, the log entry reports it back to the skills library.

### The owner's answers of 2026-11-10 that shape this brief

- **Q19, visual parity: close enough.** The migration is done when before and after screenshots at 1280 and 390 px show no visible change to layout or colour. A few pixels of spacing or rounding drift needn't be fixed or listed.
- **Q18, dark mode: a switch.** The app gets a Light / Dark / System choice, stored per device. A first visit shows the light theme, not the system's. `dark:` keys off a `data-theme` attribute through `@custom-variant`, as Postern does, not off `prefers-color-scheme`.

### What the app's styling is today (read 2026-11-10)

Paths are under `literally-a-todo-app/frontend/src/`. Brief 14 of the library says "2 CSS files, 239 lines, one `@font-face`, no custom properties". That is right but misleading, because the styling is not in the CSS:

- **31 inline `style={` props in 8 files.** Command: `grep -rn "style={" . --include=*.tsx | wc -l`. Per file: `App.tsx` 7, `components/TodoItem.tsx` 11, `AddTodoField.tsx` 4, `TodoList.tsx` 3, `FilterTabs.tsx` 2, `shared/Checkbox.tsx` 2, `shared/Button.tsx` 1, `shared/Separator.tsx` 1. After brief 03 they sit in `components/ui/` and the sonner CSS is gone.
- **`index.css`, 55 lines**, the only stylesheet that is imported (`main.tsx:3`): a Google Fonts `@import url(...)` for Material Symbols at line 1 (not an `@font-face`), a reset, `:root` type (14 px, `line-height: 36px`), the `.material-symbols-outlined` class, the hover rule for a row's actions (lines 28-34), the placeholder colour and `a`.
- **`App.css`, 184 lines, is dead** (nothing imports it) and brief 02 deletes it. This brief never migrates it.
- **No custom properties.** Six colours repeat as raw hex, 31 uses in all: `#000` 12, `#999` 9, `#fff` 6, `#f9f9f9` 2, `#1a1c1c` 1, `#f3f3f4` 1. Command: `grep -rnoE "#[0-9a-fA-F]{3,6}\b" . --include=*.tsx --include=*.css`. `docs/wiki/design.md` lists 50 named colours in its front matter. The code uses six, and [literally-a-todo-app/docs/wiki/design-rules.md](../../../literally-a-todo-app/docs/wiki/design-rules.md) names them (primary, on-surface, muted-gray, surface, surface-container-lowest). `#f3f3f4` is the design file's `surface-container-low` (used for the dead drag highlight that brief 03 removes). The documented `#ba1a1a` error colour is not used.
- **Media queries: none** in `index.css`. The 6 in `App.css` go with it. Nothing in the app is responsive, which is why the header overlaps on a phone.
- **No `rem`.** Every size is px. The root is **14 px** (`index.css`, `:root`), so Tailwind's rem-based spacing would be 3.5 px per step. That is Q44 (decision 5).
- **Fonts.** One stack, `ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas, monospace`, on `:root`. The icon font loads from Google Fonts at run time. That stays (see decision 8).
- **Dynamic styles.** Four props depend on state: a row's `opacity` (completed), the dragged row's `opacity`, the filter tab's border, weight and colour, and the add field's open or closed look. These become conditional classes. No inline style should be left.

### A dry run (2026-11-10, on a scratch copy of `frontend/`, never in the repo)

Commands: `npm ci`, `npm install @base-ui/react@1.9.0 --save-exact`, then `npm install tailwindcss@4.3.5 @tailwindcss/vite@4.3.5 clsx@2.1.1 tailwind-merge@3.7.0 --save-exact`, the plugin in `vite.config.ts`, `index.css` moved to `styles/legacy.css`, and `styles/index.css` holding `@layer theme, base, legacy, components, utilities;` followed by Tailwind's theme, preflight and utilities imports, each in its layer, and `@import "./legacy.css" layer(legacy);`. Then `npx vite build`.

- It builds. `@tailwindcss/vite` 4.3.5 takes Vite 8.0.10 (its peer range is `^5.2.0 || ^6 || ^7 || ^8`).
- **CSS grows from 0.86 kB (0.52 kB gzip) to 7.98 kB (2.43 kB gzip)**, with theme and preflight and no utilities yet. The JS is unchanged at 345.57 kB (110.13 kB gzip).
- The Google Fonts `@import` is hoisted to the top of the output and survives.
- Preflight's `html { line-height: 1.5 }` is in the output, and the legacy file's `line-height: 36px` is too. With `legacy` after `base`, the old rule wins, which is the point of the method.
- Not measured: the `@import "tailwindcss"` one-liner form (the scratch used the three split imports so `legacy` could sit between them; step 2 checks that Postern's one-liner with the layer order declared first gives the same output), the preflight's effect on the native `button` and `input`, and any `better-tailwindcss` result.

### How the legacy-layer method applies here

The method (Postern's brief 03) imports every old stylesheet into one `layer(legacy)` so utilities always beat it, then empties it file by file. Here it covers only `index.css`. The inline styles are the bigger half, and they are a different trap: **an inline `style` beats every stylesheet and every utility.** So a component can't carry both. Each component's inline styles and its new `className` go in one commit, with no leftover `style=` prop. That is the rule for this app, and the model for any app whose styling is inline.

### Gotchas Tailwind brings to this app

- **The 14 px root and the 36 px row.** Set `--spacing: 4px` so `h-9` is the 36 px row, `px-2` the 8 px padding and `gap-1` the 4 px gap, with the default text, radius, shadow and colour scales cleared (decision 5). Type sizes become tokens in px (`text-body` 14, `text-title` 13, `text-footer` 10), because `text-sm` would be 0.875 rem.
- **`line-height: 36px` on the root.** The row height depends on it: every text node inherits 36 px. Port it to `@layer base` as `html { line-height: 36px }` (a token, `--leading-row`), or Tailwind's 1.5 will shrink the rows' text boxes. A screenshot pair catches it.
- **`hover:` is hover-capable only.** In Tailwind v4, `hover:` applies under `@media (hover: hover)`. The row's actions (`.todo-actions`, `opacity: 0` until the row is hovered, `index.css:28-34`) would never show on a touch screen, because a phone has no hover. Today a tap leaves `:hover` stuck on, so the buttons appear. Default: `group-hover/row:opacity-100`, plus `[@media(hover:none)]:opacity-100` so they are always visible on touch, plus `group-focus-within/row:opacity-100` so a keyboard user sees the button they tabbed to (today those buttons are focusable but invisible). The owner's main phone is Android, so step 6 checks this on Android Chrome.
- **Placeholder.** `input::placeholder { color: #999 }` becomes `placeholder:text-muted`. Tailwind v4's own placeholder colour is `currentColor` at 50%.
- **The icon class.** `.material-symbols-outlined` (a font family, `liga`, `FILL`) becomes utilities in `Icon.tsx` from brief 03, with `font-variation-settings` through an arbitrary property.
- **`cn()` and custom names.** `src/lib/cn.ts` uses `extendTailwindMerge` with this app's `text-*` size names and its colours, or `cn("text-ink", "text-body")` drops one. A test proves it.
- **The one z-index.** The header's `z-index: 50` (`App.tsx:18`) is Tailwind's own `z-50`. The toast sits above it through its portal. No scale is needed for two layers.

## Owner decisions (defaults this brief builds)

1. **Token names** (Q17, and Q61 for the small-tools family). Default: the names `design-rules.md` already uses, in Tailwind's namespaces: `--color-primary` (`#000`, text, borders, icons), `--color-on-surface` (`#1a1c1c`), `--color-muted` (`#999`), `--color-surface` (`#f9f9f9`, the page), `--color-surface-lowest` (`#fff`, the card), `--color-surface-low` (`#f3f3f4`). Utilities read `bg-surface-lowest`, `border-primary`, `text-muted`. The unused design-file colours are not carried over. *Q61 asks whether a family of small tools shares names; this app takes its own.*
2. **Dark mode** (Q18, the owner's answer). Default: a Light / Dark / System switch, light on a first visit, kept in `localStorage` under one key, with a failed read treated as light. `data-theme` on `<html>` is `light` or `dark`. **System** is resolved in JavaScript, by `matchMedia("(prefers-color-scheme: dark)")` with a listener, to one of the two, so the attribute is never `system`. `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))` is declared as Postern's method has it. The palette itself flips by redefining the six colour tokens under `[data-theme=dark]` in `@layer base`, so no component needs a `dark:` class. A small inline script in `index.html` sets the attribute before first paint, so a dark choice doesn't flash light. `color-scheme` follows the attribute, so scrollbars and native inputs match.
3. **The dark palette.** Default, derived from the inverse tokens in `docs/wiki/design.md`: page `#1a1c1c`, card `#2f3131`, `primary` and `on-surface` `#f0f1f1`, `muted` `#999` (about 6.5:1 on the page), `surface-low` `#3a3c3c`. Only the first four come from the design file. Borders are `primary`, so they flip to light grey and the "sharp black borders" rule becomes sharp light ones. The checked checkbox is `bg-primary` with a `text-surface-lowest` tick. *New question for the grilling (taste):* are these dark values right, and is it a hard rule that a dark app keeps the 1 px outline?
4. **The switch's place and control.** Default: in the footer, on the right (the footer is `justify-between` with one child, `App.tsx:52-70`, so there is room), as a `ui/RadioGroup.tsx` wrapper over Base UI `RadioGroup` and `Radio` with three text labels, "Light", "Dark", "System", at the footer's 10 px. An always-one-chosen control (Q57) is a radio group here, where brief 03's filter is `Tabs`. *If Q57 is answered one way for both, the other is swapped.*
5. **The 14 px root** (Q44). Default: `--spacing: 4px`, the default text, radius, shadow and colour scales cleared (`--color-*: initial`, and so on), and the type sizes as px tokens. The alternative, 14 px moved from `:root` to `body` with rem defaults kept, also changes nothing visible here, but leaves Tailwind's defaults usable and 3.5 px steps. *The answer applies to any estate app with a non-16 px root.*
6. **Visual parity** (Q19, the owner's answer: close enough). Default: screenshots at 1280 and 390 px, light theme. Layout and colour must not visibly change. Drift of a few pixels isn't listed. **Deliberate differences** are listed, because they are not drift:
   - the row actions on touch and on keyboard focus (above);
   - the header at 390 px (step 6);
   - the dark theme and the switch, which are new.
7. **Preflight.** Default: Tailwind's, with `index.css`'s reset dropped (preflight already sets `box-sizing`, margins and padding) and the rest ported to `@layer base`. The fallback, if the native `input` or `button` shifts: import Tailwind's theme and utilities without preflight.
8. **The icon font.** Default: unchanged, loaded from Google Fonts at run time, as it is today. The `@import url(...)` stays the first line of `styles/index.css`, ahead of everything but the `@layer` order statement. Self-hosting it would remove the network request, but it is a new dependency (`material-symbols`) and not a migration step. *New question for the grilling.*
9. **Motion** (rule 7). Default: parity. The two transitions become `transition-opacity duration-75` (the row actions, 0.075 s) and `duration-100` (the drag highlight if it survives brief 03), under `motion-safe:`. No new animations.
10. **Where the app falls in the estate's order** (Q20). Default: first. This brief depends on no other app's migration, and the others copy its method.
11. **Tests that select by class.** There are none (`grep -rn "\.todo-row\|\.todo-actions" frontend/src --include=*.test.*` prints nothing once brief 02 and 03's tests exist, and they use roles). Say so in the log.

## Files you OWN

- `frontend/src/index.css` (moved to `frontend/src/styles/index.css`, then rewritten), and `frontend/src/styles/legacy.css` while the method needs it.
- The `className` and `style` of every `frontend/src/**/*.tsx`, after brief 03's moves.
- `frontend/src/lib/cn.ts` and its test (new); `frontend/src/components/ui/RadioGroup.tsx` (new); `frontend/src/theme/` (new: the provider, the hook and their tests).
- `frontend/index.html`: the pre-paint theme script, and a real `<title>` (today it is `frontend`; the tab's title is out of scope otherwise).
- `frontend/src/main.tsx`: the stylesheet import and the provider.
- `frontend/package.json`, `frontend/package-lock.json`, `frontend/vite.config.ts` (the plugin only), all pinned: `tailwindcss` 4.3.5, `@tailwindcss/vite` 4.3.5, `clsx` 2.1.1, `tailwind-merge` 3.7.0, and `eslint-plugin-better-tailwindcss` 4.10.0 as a devDependency.
- `frontend/eslint.config.js`: the `better-tailwindcss` block only, with `entryPoint: "src/styles/index.css"`.
- `scripts/conventions.json` at `literally-a-todo-app/`, if an exception is needed.
- `literally-a-todo-app/.claude/rules/web.md`: the Tailwind lines.
- `literally-a-todo-app/docs/wiki/design-rules.md` and `design.md`: the tokens section points at `styles/index.css`; the dark values are added. `frontend-rules.md`: the stack and layout.
- The todo [todo-header-overlaps-on-phones](../../todos/todo-header-overlaps-on-phones.md): its `status` when step 6 lands.
- Corpus: `wiki/decisions.md` (brief 02 creates it), [wiki/status.md](../../wiki/status.md), [log.md](../../log.md).

## Files you must NOT touch

- `literally-a-todo-app/backend/`, and every other project.
- Behaviour. Event handlers, the query hooks and the API calls stay as they are. The theme provider and the touch and keyboard visibility of the row actions are the only new behaviours, and both are named above.
- The wrappers' logic in `components/ui/` (the props, the `Tabs` and `Toast` wiring) beyond `className`. Brief 03 settled them.
- `designs/todoapp.html`, the mock-up.

## What to do

Follow the skill's `migrating-from-plain-css.md`. One commit per numbered step, and one per component in step 3. After each, `npm run check` and `npm run build` pass in `frontend/`.

1. **Screenshots before.** Bring the app up the way [docs/images/shots.md](../../../docs/images/shots.md) does for the README image: both dev servers, six made-up tasks, two ticked through the API, port 3000 and 5173. Take, at 1280 × 800 and 390 × 844, with the mouse away unless a state says otherwise: the list, a row under the pointer, the editing row, the add field open and closed, the Active and Completed filters, an empty filter, the toast (stop the backend, tick one). Keep the images out of git. Record the built CSS size, raw and gzip, and the build time.
2. **Set up.**
   - Add the dependencies and the Vite plugin.
   - Move `index.css` to `styles/legacy.css` and write `styles/index.css`: `@layer theme, base, legacy, components, utilities;`, then `@import "tailwindcss"`, then `@import "./legacy.css" layer(legacy);`, with the Google Fonts `@import url(...)` first. Add `@theme` (the six tokens, `--spacing: 4px`, the type sizes, the mono font, the defaults cleared) and the `@custom-variant dark`.
   - Check the built CSS: the font import survived, the cleared scales produce no `bg-red-500` or `text-sm`, `h-9` is 36 px, and the one-liner form builds as the dry run's split form did.
   - Write `lib/cn.ts` and its test.
   - Screenshots again: nothing should differ yet.
3. **Migrate one component at a time**, each in one commit with every inline `style` and its old CSS rule removed:
   1. `components/ui/Button.tsx`, `Checkbox.tsx`, `Separator.tsx` (one `buttonClass` for the two variants, the checkbox's `data-checked:` state, the tick).
   2. `components/Icon.tsx`: the glyph class's rules become utilities. Delete `.material-symbols-outlined` from `legacy.css`.
   3. `components/ui/Tabs.tsx` and `FilterTabs.tsx`: the active tab is `data-active:` (Base UI's attribute for the selected tab; check its name in the 1.9.0 types), not a prop-driven style.
   4. `components/ui/Toast.tsx`.
   5. `components/AddTodoField.tsx`.
   6. `components/TodoItem.tsx`, with the row actions' `group/row` variants, and the `.todo-row`, `.todo-actions` rules removed from `legacy.css`.
   7. `components/TodoList.tsx`.
   8. `App.tsx`: the shell, the header, the card, the footer.
   9. Whatever is left in `legacy.css` (the `:root` type, `a`, the placeholder) moves to `@layer base`. Delete `legacy.css` and its import line.
4. **Lint.** Turn on `better-tailwindcss`'s correctness rules and its class order as errors, and fix what they find. `check-base-ui` strict must pass rules 4-7: no `style=` prop, no raw colour, one stylesheet.
5. **The theme switch** (decisions 2-4):
   - `theme/` holds the preference (`"light" | "dark" | "system"`, default `"light"`), the resolver, the `localStorage` read and write in `try/catch`, and the listener for System;
   - `ui/RadioGroup.tsx`, and the switch in the footer;
   - the pre-paint script in `index.html`;
   - the dark values under `[data-theme=dark]`.

   Tests: a first visit with empty storage is `data-theme="light"`; choosing Dark sets the attribute and the key; System follows a mocked `matchMedia` and its change event; a throwing `localStorage` still renders light. Take dark screenshots at both widths.
6. **The header on a phone, a deliberate fix.** After parity is proven, change the header so the title and the tabs don't overlap at 390 px: the tabs on their own row below `max-sm`, desktop unchanged. Commit alone. This is the acceptance of the todo [todo-header-overlaps-on-phones](../../todos/todo-header-overlaps-on-phones.md). Take the 390 px screenshot and check it on Android Chrome with the app served on the LAN (`vite --host`), where the row actions must also show.
7. **Screenshots after.** Take the step 1 set again, light. Compare each pair, by eye and with pixelmatch at its default threshold. Fix any visible change in layout or colour. List the deliberate differences from decision 6. Record the CSS size and build time against step 1.
8. **Corpus.** In `wiki/decisions.md` (brief 02 creates it): "Utilitarian monospace, styled with Tailwind v4", with the rejected alternatives (keep inline styles, CSS Modules, a styled kit) and the owner's Q18 and Q19 answers. Update `.claude/rules/web.md`: tokens only from `@theme`, no arbitrary colours, no `style=`, `cn()`, no `dark:` unless a token can't do it. Update `docs/wiki/design-rules.md` (the dark values), [wiki/status.md](../../wiki/status.md) and [log.md](../../log.md); set the header todo's `status`. Write the dry run's findings for the skills library in the log entry: anything the method got wrong, the CSS size delta, and the inline-style trap. Run `bash corpus/lint.sh --index`, then `bash corpus/lint.sh`, until clean.
9. **The gate.** Drop any `--warn-only` left on `check-base-ui`, and confirm `npm run check` includes `better-tailwindcss`.

## Acceptance

- [ ] `find literally-a-todo-app/frontend/src -name '*.css'` prints only `styles/index.css`.
- [ ] `grep -rn "style={" literally-a-todo-app/frontend/src --include=*.tsx` prints nothing.
- [ ] `grep -rnE "(bg|text|border|fill|stroke|ring|outline|shadow)-\[(#|rgb|hsl)" literally-a-todo-app/frontend/src` prints nothing, and `grep -rnoE "#[0-9a-fA-F]{3,8}\b" literally-a-todo-app/frontend/src --include=*.tsx` prints nothing.
- [ ] `check-base-ui` strict passes with no exception, and `npm run check` (with `better-tailwindcss`) and `npm run build` pass in `literally-a-todo-app/frontend`.
- [ ] `@theme` defines the six colours and the type sizes, and the default scales are cleared: `bg-red-500` or `text-sm` in a component produces no CSS (a test builds a fixture).
- [ ] A `cn` test proves `cn("text-primary", "text-body")` keeps both classes.
- [ ] Theme tests pass: first visit light, Dark and System as in step 5, a throwing storage still light.
- [ ] The before and after screenshots at 1280 and 390 px match in layout and colour, with only decision 6's differences listed, and the CSS size before and after is in the log.
- [ ] At 390 px the header's title and tabs do not overlap (a screenshot, and an Android Chrome note in the log), and the row actions are visible on touch.
- [ ] The decision entry and the `log.md` entry exist, and `bash corpus/lint.sh` ends clean.

## Interplay

- Brief 02's reformat touches `index.css` and brief 03 moves the wrappers; this brief rewrites both afterwards.
- Brief 05 doesn't touch `frontend/`. The two projects have separate lockfiles, so the briefs may run in parallel.
- The skills library's `better-tailwindcss` setup (brief 27) needs the entry point `src/styles/index.css` and this app's custom names; give the plugin the `extendTailwindMerge` list from `cn.ts`.
