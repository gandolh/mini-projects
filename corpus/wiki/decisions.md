---
summary: The decisions behind the repo's projects, newest first: what was chosen, what was rejected and why
updated: 2026-11-13
---

# Decisions

## The Greenbar sheet redesign (2026-11-13)

The todo app's frontend took the redesign direction "Greenbar sheet" (brief 06, owner-approved on the estate redesign board, every question standing as proposed). The look stays utilitarian monospace with 0 px radius and no shadows. What changed is recorded here, with each old line kept as history.

- **Reopened, the app shell** (`design-rules.md`, App Shell). Was: "Theme switch: Light, Dark, System on the footer's right", "Content container: `max-width: 672px` ... `border: 1px solid #000`" and "Footer: sticky bottom, 36px". Now: Show moves into the sheet's sticky head band and the add row sits first under it, also pinned; the footer is gone; the theme switch is in the header at 640 px and up, and in a card under the sheet on a phone; the sheet is 720 px with a 1 px `line` edge. This also changes "Light / Dark / System in the footer" in the Tailwind entry below: the switch is no longer in the footer.
- **Reopened, the palette** (`design.md`). Was: "The palette is strictly binary and functional. High-contrast black is used for all structural elements." Now: ink (`#131a15`) is the only action colour, a pale green (hue about 138) tints the surfaces only, and the banding is strict greenbar: odd rows surface, even rows band, no dividers.
- **Reopened, the toast** (brief 03: "top centre, one at a time"). Now: top centre at 640 px and up, a bottom bar with a 16 px inset on a phone. The board said "5 s"; the code keeps what brief 04 set, an error stays until dismissed, and only the position moved.
- **Ask 1, yes: touch row actions.** Was: "actions ... always on touch". Now: on touch (a `(hover: none)` screen at any width, and any screen under 640 px) Move up, Move down and Delete sit in a ⋮ menu on every row, named `More actions for <title>`; the grip stays inline. The menu is a new `Menu` wrapper in `components/ui/`, from the base-ui skill. The title is now a button named `Edit <title>`, laid over plain wrapping text.
- **Ask 3, yes: Azeret Mono** from `@fontsource/azeret-mono` 5.3.0 (400, 500, 700), then the system mono stack. Kept: monospace, 0 px radius with no exceptions, no shadows.
- **Rows:** 36 px for a mouse at 1024 px and up, 40 px between, 48 px on touch or under 640 px. Hover and focus are a 2 px ink bar and the row's actions, no tint. A done row keeps its tone: the title is muted and struck through, no longer the whole row at half opacity.
- **Code decisions.** The variants `touch`, `dense` and `narrow` live in `styles/index.css`. `dropIndex` takes the dragged row's height, because the rows are no longer all 36 px. New tokens from the board's map, plus one the map lacks: `--z-index-popup` (60), so an open menu sits above the sticky header. Dropped: `--leading-row` (the line height now comes in pairs with each size) and the `Separator` wrapper (the head band's border does its job).
- **Rejected:** a `visibility: hidden` row action (the board twin's way: it takes the actions out of the Tab order, so a keyboard could not reach them); the board's `box-shadow` hover bar (a pseudo-element is a flat bar and honours "no shadows").

## The todo server in the house code structure (2026-11-11)

The server (`backend/src`) went from three files and 100 lines to the shape the estate's other Fastify servers get, scaled to one feature. Brief 05.

- **The layout:** `server.ts` listens and wires `close-with-grace`; `app.ts` exports `buildApp(config)` and never listens; `config.ts` is the one reader of the environment (`PORT`, `HOST`, `DATABASE_PATH`, parsed with zod, defaults equal to the old literals); `db/open.ts` opens the file with no import-time effect; `features/todos/` holds `routes.ts`, `schemas.ts`, `store.ts` and `index.ts`; `plugins/errors.ts` is the one error handler; `testing/buildTestApp.ts` builds the app on `:memory:`.
- **Every route has a response schema,** through `@fastify/type-provider-zod` 1.0.3 and zod 4.6.7. The schemas live in the backend (Q55: there is no `shared/`, and the frontend keeps its hand-written `types.ts`).
- **`completed` is a boolean, 0 or 1,** because the frontend sends 0 | 1 and the old handler took either by truthiness. A `z.boolean()` would have answered every tick with a 400.
- **`:id` stays a string,** and a blank title is still checked in the handler after the 404, so a missing task still wins over a blank title as before.
- **The error body stays `{ "error": "<message>" }`** (Q43). A schema failure is a 400 with the first issue's message (the schemas set the old five messages), a Fastify 4xx keeps its status and message, an unknown URL is 404 `{ "error": "not found" }`, and everything else is 500 `{ "error": "internal error" }` with the detail logged. A declared 4xx schema is the generic `{ error: string }`, because a declared status encodes every reply on it.
- **Behaviour that changed, accepted:** a non-string title and no body on `POST` (500 to 400), `PATCH` with no body (500 to 200, row unchanged), `ids: ["x"]` (200 that updated nothing, to 400), reorder with no body (500 to 400), the unknown-URL body, Fastify's own 400 body (now `{ error }`) and every 500 body. The frontend reads none of these.
- **Timeouts and `trustProxy` are not set.** The server listens on loopback only, behind no proxy, and no route runs long; Fastify's defaults stay. No logger option beyond `logger: true` in `server.ts`, as before.
- **Rejected:** a flat `routes.ts` and `store.ts` (the library's tree asks for `features/`, and the next route group gets a place), `@fastify/autoload` (explicit registration, Q24), TypeBox (the estate moved to zod), a `shared/` workspace (this repo has no workspaces; a new brief if the owner wants one source), and a rate-limited 404 (`@fastify/rate-limit` is not a dependency).
- **The gate:** `check-structure` runs strict with 0 findings (it had 6 before: rule 2 once, rule 6 five times), and `npm run check` runs the backend's vitest.

## Utilitarian monospace, styled with Tailwind v4 (2026-11-11)

The todo app's frontend moved from inline `style` props and one plain stylesheet to Tailwind 4.3.5, the estate's
first migration (Q20 makes it the dry run), by the base-ui skill's `migrating-from-plain-css.md`.

- **One stylesheet,** `frontend/src/styles/index.css`: the layer order, the icon font's Google stylesheet in
  `layer(vendor)`, `@import "tailwindcss"`, `@custom-variant dark` on `data-theme`, `@theme` and a small
  `@layer base` (`color-scheme`, `body`). The old `index.css` sat in a `legacy` layer while it emptied, then went.
- **Tokens keep the design file's role names** (Q17, Q61: not in the small-tools family): `primary`,
  `on-surface`, `muted`, `surface`, `surface-lowest`, `surface-low`, as `light-dark()` pairs. Tailwind's own
  colour, text, radius and shadow scales are cleared; the type sizes are rem tokens equal to the old pixels; two z
  tokens, `sticky` and `toast`.
- **The 14 px moved from `:root` to `body`** with the 36 px line height (Q44), so `h-9` is the row and Tailwind's
  0.25rem spacing needs no override in an app whose every size was in px.
- **Each component moved whole, in one commit,** because an inline `style` beats every utility: 34 inline styles
  and 36 raw hex values went to zero, and before / after screenshots showed 0 px of change.
- **Dark mode is a switch** (Q18, owner): Light / Dark / System (in the footer then; in the header since 2026-11-13), light on a first visit, kept in
  `localStorage`, set on `<html>` before the first paint. It follows the skill's `theme.md` (System is
  `data-theme="system"` and `color-scheme: light dark`), not the brief's JavaScript resolution of System: the skill
  wins on a convention.
- **Visual parity, close enough** (Q19, owner). Deliberate differences: the row actions also show while focus is
  in the row and always on touch, the phone header puts the tabs on a second row, and the switch and the dark theme
  are new.
- **Rejected:** keeping the inline styles (they beat every stylesheet, carry no dark theme and repeat the six
  colours 36 times), CSS Modules (a second styling system beside Base UI's wrappers, against rule 5), and a styled
  kit (the estate keeps one look per app and shares behaviour, not styles).

## The todo app's Base UI by the conventions (2026-11-11)

- **Base UI is imported only under `components/ui/`**: `Button`, `Checkbox`, `Separator`, `RadioGroup` and `Toast`, one wrapper per part. `components/shared/` is gone.
- **The filter is a `RadioGroup`**, not `Tabs`: it switches what one list shows, one item is always chosen, and arrow keys may choose (Q41, Q57). One Tab stop, `role="radiogroup"` with `aria-checked`, `data-checked` for the styling. The wrapper has a `segmented` look (the filter) and a `list` look (brief 04's theme switch).
- **The toast is Base UI's `Toast`** behind `toast.error(message)`, replacing sonner (rule 13): top centre, one at a time, closed after 5 s as sonner did. The skill's wrapper keeps an error until dismissed; this one keeps the app's 5 s. (Changed in brief 04 by the controller's ruling: an error stays until its Dismiss button closes it, as the skill says.)
- **Names.** Glyphs go through `Icon` (`aria-hidden`), every icon-only control has an `aria-label`, the checkbox is named by its task. The add row and a task's title are buttons.
- **Drag.** Two causes: the old `Button` dropped the handle's pointer handlers (no drag with a mouse), and the handle lacked `touch-action: none` (Android touch moved one row, then the browser took over). Both fixed; the drop arithmetic is the pure `dropIndex`, clamped to the list, so a drop past the end now moves the row last instead of doing nothing.
- **Tests.** vitest 5.1.0, jsdom 31.0.0 and Testing Library, pinned, only for wrappers with logic. Flows are Playwright specs (names, keys, filter, toast, and a mouse and an Android-touch drag against a stateful mock). `check` runs vitest.
- **`check-base-ui` stays `--warn-only`**: the one finding left is rule 5, the stylesheet that is not `src/styles/index.css`, which brief 04 moves.

## The todo app in the house style, formatted and checked (2026-11-11)

- **Config source.** The `house-style` copy is vendored in `literally-a-todo-app/vendor/house-style/` (version 1.0.0, header in its README), refreshed by `npm run house-style:sync`. No git, `github:` or tarball dependency. The sync normally copies into the root of the git work tree, and this repo holds five projects, so `scripts/house-style-sync.mjs` runs it with git told not to look above the repo folder; the copy lands in the app folder.
- **One set of tools for two projects.** `frontend/` and `backend/` keep their own lockfiles, and neither has the lint or format tools. The app folder's `package.json` holds them (ESLint, Prettier, knip, dependency-cruiser and the plugins, pinned as house-style lists), and both projects find them through `node_modules/.bin` in the parent folder. A project's `npm run check` therefore needs the app folder's `npm install` first. Rejected: npm workspaces (one lockfile, against the app's two independent projects), and the tools in each project (the vendored ESLint config imports the plugins from where it sits, so a copy per project would not resolve them).
- **Width 120**, trailing commas, double quotes and semicolons. The reformat was +262 / -259 over 19 files; the bundle compare (each file minified before and after, CSS through esbuild's `css` loader, JSON parsed) showed no difference. Markdown stays out of Prettier.
- **tsconfig.** Every project extends the house base. The frontend gains `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride` and `isolatedModules` (four real errors, all fixed); the backend gains the same plus `noUnusedParameters`, `noEmit` and TypeScript 6.0.3. `exactOptionalPropertyTypes` stays out.
- **Typed lint** through `projectService`, the house shapes as errors (enum, `!`, `console`, `TODO`, default export outside `*.config.*`). Fixed in code: the `!` in `main.tsx` (a named error), the default exports of `App` and `db`, two unneeded casts, and the two react-hooks errors (the mirrored list state, and the drag ref that was a prop).
- **The reorder spec first.** A Playwright spec (`frontend/e2e/reorder.spec.ts`, API mocked) passed before and after the mirrored state was deleted; it checks the list changes before the server answers.
- **Rejected:** `eslint-plugin-react-refresh` stays out (its peer on ESLint would pull a second ESLint into `frontend/`, and the house config has no equivalent); a Playwright version chosen for the newest browser (1.62.0 matches the Chromium already on this machine).
- **Still warnings** until the briefs that fix them: the Base UI checker (3 imports outside `components/ui`, one second stylesheet) and the structure checker (no `app.ts`, five routes without schemas). dependency-cruiser runs strict from the start.
