# Log

## [2026-11-01] maintenance | Corpus bootstrapped, README and docs refreshed, two builds fixed

The corpus started with CLAUDE.md, routing.md, lint.sh, the overview and the status page, which point to each project's own notes instead of copying them. The root README follows the readme-docs standard now, with three images from the running apps and `docs/README.md`, `docs/getting-started.md` and `docs/images/shots.md`; pw-manager and the todo app got short READMEs of their own. Two fixes made the projects run as written: pw-manager's window stayed blank because its sandboxed preload required `../shared/api.js`, and git-helper-ui's client build failed on its CSS imports without `vite-env.d.ts`. Two findings went to `todos/`. Checked by running every project; the details are in [wiki/status.md](wiki/status.md).

## [2026-11-10] todo | Briefs 01-02 for the todo app: Base UI 1.9.0 and the house-style harness (partial set)

These follow the owner's 2026-11-09 calls: Base UI at 1.9.0 styled with
Tailwind across whole apps, and the researched conventions enforced in each
repo. The writing stopped on a usage limit before the remaining briefs for
`literally-a-todo-app`:

- Base UI by the conventions: move `components/shared/` to `components/ui/`
  and audit rules 1-13;
- the frontend to Tailwind;
- the backend in the code structure.

The next session writes them, taking the owner's skills library's briefs
02, 03 and 14 as the specs and Almanac's briefs as the reference shape.

## [2026-11-10] todo | Briefs 03-05 for the todo app: Base UI conventions, Tailwind with a theme switch, the server in the code structure

Completes the set begun with briefs 01-02. Brief 03 audits the frontend against
Base UI rules 1-13 and fixes the drag handle, brief 04 moves it to Tailwind v4
(Postern's legacy-layer method, a dry run for the estate) with a Light / Dark /
System switch, and brief 05 gives the Fastify server `buildApp`, `config.ts`, zod
route schemas and a first test. They build the owner's answers of 2026-11-10 on
visual parity (close enough) and dark mode (a switch, light by default).

## [2026-11-10] todo | Briefs 02-05 revised to the grilling's answers; redesign brief 06 added

Revised briefs 02-05 for the owner's answers and technical calls of 2026-11-10.
Brief 02: `house-style` is vendored with a `house-style:sync` script (Q6), Prettier
width 120 with its measured cost (+198 / -194 frontend, +63 / -61 backend, Q8 and
Q51), `!` an error in source and a warning in tests (Q47), named component exports
(Q49), and the reorder check as a Playwright spec (Q60). Brief 03: the filter is a
`RadioGroup`, not `Tabs`, since it switches what one list shows (Q41, Q57), and
jsdom tests are only for wrappers with logic (Q60). Brief 04: the 14 px moves onto
`body` with Tailwind's default spacing (Q44), token names kept for this app
(Q17, Q61), the switch shares the filter's `RadioGroup`, and its decisions are
marked decided. Brief 05: its decisions are marked decided (Q23-Q27, Q43, Q55,
Q56). Added brief 06, a redesign with Hallmark on the estate board (Q39).

## [2026-11-10] done | Brief 01 — Base UI 1.9.0 in the todo frontend

`@base-ui/react` 1.4.1 to 1.9.0, pinned exactly (95f1e3a); `@base-ui/utils` 0.5.0, and `@babel/runtime` moved to 8.1.0 in the lockfile. Build passes; lint shows the same two `TodoList.tsx` errors as before. Browser behaviour check not run (no dev servers), so no behaviour differences are recorded and the drag question stays open for brief 03.

## [2026-11-11] done | Brief 02 - the todo app in the house style, with a quality harness

Vendored house-style 1.0.0, Prettier at 120 (one reformat commit, ignored in blame), the house tsconfig base, typed ESLint, knip, dependency-cruiser, the two convention checkers (`--warn-only`) and `npm run check` / `check:fast`, from `literally-a-todo-app/` and in each project. Fixed the four `noUncheckedIndexedAccess` errors and the two react-hooks errors behind a Playwright reorder spec. Rules and `CLAUDE.md` added. Re-measure at the start: the counts in the brief held (frontend 4 tsc errors, 1 `!`, 2 hook errors; backend 2 casts), plus `db.ts` and `App.tsx` default exports. Timings, warm: `check` about 22 s, `check:fast` with one changed file 11-15 s. Details and the decision are in [wiki/decisions.md](wiki/decisions.md).

## [2026-11-11] done | Brief 03 - the todo app's Base UI by the conventions

Wrappers moved to `components/ui/` (rule 3 at 0), `Button` forwards every prop, every icon-only control and the checkbox have names, the add row and the title are buttons, the filter is a `RadioGroup`, the toast is Base UI's (sonner removed), vitest added. Drag: both mouse and touch failed on the unchanged app (the mock-backed spec and the touch pass; order unchanged for the mouse, one row for touch). Causes: candidate 1 (the wrapper dropped the handlers, mouse) and candidate 2 (no `touch-action: none`, touch). Candidates 3 and 4 were harmless (the end clamp ignored a drop past the end, and `dragOver` was dead code, deleted); `dropIndex` clamps. A throwaway pass on a scratch copy against the real backend passed for mouse and touch. `check-base-ui` strict: rules 1, 2, 3, 9, 10, 11 report 0; rule 5 has 1 (the stylesheet's place), rules 4 and 6-7 are review's: 34 inline `style` props, 36 raw hex values, 2 transitions (`index.css`, `TodoList.tsx`), all brief 04's. It stays `--warn-only`.

## [2026-11-11] done | Brief 04 - the todo app's frontend to Tailwind, with a theme switch

The estate's first Tailwind migration, the dry run Q20 asked for. First the controller's ruling: an error toast stays
until its Dismiss button closes it (the skill's toast). Then Tailwind 4.3.5 with the old stylesheet in a `legacy`
layer, one component per commit, `legacy.css` emptied and deleted, `check-base-ui` strict, `better-tailwindcss` on, a
Light / Dark / System switch (the skill's `theme.md`: `data-theme` light, dark or system, `light-dark()` tokens), and the
phone header's tabs on their own row. Before / after screenshots at 1280 and 390 px: 0 px by pixelmatch, except the
deliberate differences (row actions on focus and on touch, the phone header, the switch). The production build matched
the dev server at 0 px. Android: an emulated Pixel 7 only, where `(hover: none)` matches, the header stacks and the row
actions show; a real phone is the owner's check. The details are in the brief's outcome and
[wiki/decisions.md](wiki/decisions.md).

Sizes: built CSS 0.86 kB (0.52 kB gzip) before, 13.54 kB (3.89 kB gzip) after; JS 355.05 kB (115.51 kB gzip) before,
383.87 kB (124.74 kB gzip) after, mostly tailwind-merge; `vite build` about 0.2 s before, 0.35 s after.

Findings for the skills library (the method in `migrating-from-plain-css.md`):

- **The inline-style trap.** An inline `style` beats every utility, so each component moved whole, in one commit, and
  an app whose styling is inline has no "one stylesheet at a time": the legacy layer held 55 lines, the components 34
  inline styles. Step 4's per-stylesheet loop reads as per-component here.
- **Move the root size in step 2,** with the legacy import, not later: while `:root { font-size: 14px }` sits in
  legacy, every rem utility measures from 14 px through the component commits. An app whose sizes were all px needs
  no `--spacing` override once the root is back at 16 px.
- **The build hoists a remote `@import`.** `vite build` moves `@import url(...) layer(vendor)` above the `@layer`
  statement, so in the build `vendor` is declared first, below Tailwind's reset; the dev server keeps the written
  order. Local vendor CSS is inlined by Tailwind and keeps its place.
- **`light-dark()` doesn't survive the build as written:** lightningcss rewrites it into `--lightningcss-light` /
  `--lightningcss-dark` variables, set wherever the same stylesheet declares `color-scheme`. It works, but only for a
  `color-scheme` declared in that stylesheet.
- **tailwind-merge drops a `leading-*` after a `text-*`.** With sizes that carry no line height that is wrong, and
  it clipped an icon; `cn()` overrides the `font-size` conflict.
- **An icon font's glyph in a one-em box with `overflow-hidden`** keeps the ligature word from spilling over its
  neighbour while the font loads; the e2e spec then blocks the font instead of hiding glyphs by class.
- **e2e specs select by class too:** the drag and reorder specs used `.todo-row`, an inline style and
  `.material-symbols-outlined`, all gone with the migration; they now find a row through its checkbox.
- **Tailwind's scanner reads every source file,** test fixtures and the template's SVG included: `filter` and
  `transform` in code and in `assets/vite.svg` add about 1.7 kB of unused utilities and `@property` fallbacks.
- **A stylesheet test needs no file system:** `import css from "./index.css?inline"` (with vitest's `css.include`)
  returns what the Vite plugin builds; `?raw` of a package's CSS fails dependency-cruiser's resolver.

## [2026-11-11] build | Brief 05: the todo server in the house code structure

`backend/src` has `server.ts`, `app.ts`, `config.ts`, `db/open.ts`, `features/todos/` (routes, schemas, store, index), `plugins/errors.ts` and `testing/buildTestApp.ts`; every route declares a response schema, and `check-structure` runs strict. Before: `check-structure` counted 6 findings (rule 2 once, rule 6 five times). After: 0 errors, 0 warnings. The reply capture (34 requests: every route, the rows of the brief's table and the error cases, on a seeded database) matched byte for byte after the split and the store; the error plugin changed 7 replies and the schemas 5 (4 of them already changed by the plugin), all error replies: 26 of 34 stayed identical to the start. The 8 that differ: a non-string title and no body on `POST` (500 to 400), `PATCH` with no body (500 to 200), `ids: ["x"]` (200 to 400), reorder with no body (500 to 400), Fastify's bad-JSON body (now `{ error }`), and the unknown URL and unknown method (404 `{ error: "not found" }`). Decisions: [wiki/decisions.md](wiki/decisions.md). The house-style 1.2.0 sync went in first.
