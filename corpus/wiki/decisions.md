---
summary: The decisions behind the repo's projects, newest first: what was chosen, what was rejected and why
updated: 2026-11-11
---

# Decisions

## The todo app in the house style, formatted and checked (2026-11-11)

- **Config source.** The `house-style` copy is vendored in `literally-a-todo-app/vendor/house-style/` (version 1.0.0, header in its README), refreshed by `npm run house-style:sync`. No git, `github:` or tarball dependency. The sync normally copies into the root of the git work tree, and this repo holds five projects, so `scripts/house-style-sync.mjs` runs it with git told not to look above the repo folder; the copy lands in the app folder.
- **One set of tools for two projects.** `frontend/` and `backend/` keep their own lockfiles, and neither has the lint or format tools. The app folder's `package.json` holds them (ESLint, Prettier, knip, dependency-cruiser and the plugins, pinned as house-style lists), and both projects find them through `node_modules/.bin` in the parent folder. A project's `npm run check` therefore needs the app folder's `npm install` first. Rejected: npm workspaces (one lockfile, against the app's two independent projects), and the tools in each project (the vendored ESLint config imports the plugins from where it sits, so a copy per project would not resolve them).
- **Width 120**, trailing commas, double quotes and semicolons. The reformat was +262 / -259 over 19 files; the bundle compare (each file minified before and after, CSS through esbuild's `css` loader, JSON parsed) showed no difference. Markdown stays out of Prettier.
- **tsconfig.** Every project extends the house base. The frontend gains `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride` and `isolatedModules` (four real errors, all fixed); the backend gains the same plus `noUnusedParameters`, `noEmit` and TypeScript 6.0.3. `exactOptionalPropertyTypes` stays out.
- **Typed lint** through `projectService`, the house shapes as errors (enum, `!`, `console`, `TODO`, default export outside `*.config.*`). Fixed in code: the `!` in `main.tsx` (a named error), the default exports of `App` and `db`, two unneeded casts, and the two react-hooks errors (the mirrored list state, and the drag ref that was a prop).
- **The reorder spec first.** A Playwright spec (`frontend/e2e/reorder.spec.ts`, API mocked) passed before and after the mirrored state was deleted; it checks the list changes before the server answers.
- **Rejected:** `eslint-plugin-react-refresh` stays out (its peer on ESLint would pull a second ESLint into `frontend/`, and the house config has no equivalent); a Playwright version chosen for the newest browser (1.62.0 matches the Chromium already on this machine).
- **Still warnings** until the briefs that fix them: the Base UI checker (3 imports outside `components/ui`, one second stylesheet) and the structure checker (no `app.ts`, five routes without schemas). dependency-cruiser runs strict from the start.
