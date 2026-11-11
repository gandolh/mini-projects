---
paths:
  - "literally-a-todo-app/frontend/src/**"
---

# The page (`frontend/src`)

- Read the `base-ui` skill and [docs/wiki/frontend-rules.md](../../docs/wiki/frontend-rules.md) before you add or
  change a component.
- `@base-ui/react` is imported only by the wrappers in `components/ui/`, from its subpaths. The wrappers
  are `Button`, `Checkbox`, `Separator`, `RadioGroup` (the filter, and later the theme switch) and `Toast`
  (`toast.error(message)` and `<Toaster />`). A new Base UI part gets a wrapper there, not an import elsewhere.
- A glyph goes through `components/Icon.tsx`, and every icon-only control has an `aria-label`.
- API calls go through `api/todos.ts` only: no inline axios or fetch in a component.
- Components use named exports. A default export is for a framework config (`vite.config.ts`) only.
- Sharp corners, no shadows, no gradients ([docs/wiki/design-rules.md](../../docs/wiki/design-rules.md)).
- The list on screen is the query cache. `useReorderTodos` updates it before the server answers, so a
  component keeps no copy of it in state.
- A flow is a Playwright spec in `frontend/e2e/` with `/api/todos` mocked through `page.route`
  (`npm run test:e2e` in `frontend/`). Jsdom tests (`npm test` in `frontend/`, `*.test.tsx`) are only for a wrapper that
  holds logic. Tests select by role and name.
- `check-base-ui` runs `--warn-only` until the stylesheet moves to Tailwind (the one rule-5 finding left).
