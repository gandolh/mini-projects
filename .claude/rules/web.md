---
paths:
  - "literally-a-todo-app/frontend/src/**"
---

# The page (`frontend/src`)

- Read the `base-ui` skill and [docs/wiki/frontend-rules.md](../../literally-a-todo-app/docs/wiki/frontend-rules.md) before you add or
  change a component.
- `@base-ui/react` is imported only by the wrappers in `components/ui/`, from its subpaths. The wrappers
  are `Button`, `Checkbox`, `Separator`, `RadioGroup` (the filter and the theme switch) and `Toast`
  (`toast.error(message)` and `<Toaster />`; an error stays until Dismiss). A new Base UI part gets a wrapper there,
  not an import elsewhere.
- Styling is Tailwind 4 utilities on `className`, and `src/styles/index.css` is the one stylesheet. Colours, type
  sizes and z values come only from its `@theme` tokens (`bg-surface-lowest`, `text-body`, `z-sticky`): no raw or
  arbitrary colour, and no `style=` prop.
- Join classes with `cn()` from `src/lib/cn.ts`, and add a new token's name to its lists. State comes through Base
  UI's `data-*` variants (`data-checked:`), motion under `motion-safe:`.
- No `dark:` unless a token can't carry the difference: the colour tokens are `light-dark()` pairs that follow
  `data-theme` on `<html>`, which `src/lib/theme.ts` and the boot script in `index.html` set.
- A control that shows on hover also shows on `group-focus-within:` and `[@media(hover:none)]:` (a phone has no
  hover).
- A glyph goes through `components/Icon.tsx`, and every icon-only control has an `aria-label`.
- API calls go through `api/todos.ts` only: no inline axios or fetch in a component.
- Components use named exports. A default export is for a framework config (`vite.config.ts`) only.
- Sharp corners, no shadows, no gradients ([docs/wiki/design-rules.md](../../literally-a-todo-app/docs/wiki/design-rules.md)).
- The list on screen is the query cache. `useReorderTodos` updates it before the server answers, so a
  component keeps no copy of it in state.
- A flow is a Playwright spec in `frontend/e2e/` with `/api/todos` mocked through `page.route`
  (`npm run test:e2e` in `frontend/`). Jsdom tests (`npm test` in `frontend/`, `*.test.tsx`) are only for a wrapper that
  holds logic. Tests select by role and name.
- `check-base-ui` runs strict in `check:conventions`: a finding fails `npm run check`.
