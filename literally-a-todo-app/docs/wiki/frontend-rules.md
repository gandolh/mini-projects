# Frontend Rules & Conventions

## Stack

- React 19 + Vite 8 + TypeScript (`6.0.3`)
- `axios` — HTTP client (single instance, `baseURL: '/api'`)
- `@tanstack/react-query` — server state; all mutations invalidate `['todos']` on success
- `@base-ui/react` 1.9.0 (pinned exactly) — headless UI primitives (Button, Checkbox, Separator, RadioGroup, Toast), imported only by the wrappers in `components/ui/`
- Tailwind CSS 4.3.5 (`@tailwindcss/vite`) — every style is a utility on `className`; `clsx` and `tailwind-merge`
  behind `cn()` in `lib/cn.ts`
- `@use-gesture/react` — drag-to-reorder gesture handling
- `vitest` + jsdom + Testing Library — tests of the wrappers that hold logic; flows are Playwright specs in `frontend/e2e/`

## File Layout

```
frontend/src/
├── api/todos.ts          # axios instance + 5 endpoint functions
├── components/
│   ├── ui/               # The only place that imports Base UI: Button, Checkbox, Separator, RadioGroup, Toast
│   ├── Icon.tsx          # A Material Symbols glyph, aria-hidden
│   ├── dropIndex.ts      # Pure drop arithmetic for the drag handle
│   ├── FilterTabs.tsx    # The filter, on ui/RadioGroup
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   └── AddTodoField.tsx
│   └── ThemeSwitch.tsx   # Light / Dark / System, on ui/RadioGroup
├── hooks/useTodos.ts     # All TanStack Query hooks
├── lib/cn.ts             # cn(): clsx + tailwind-merge, told the app's token names
├── lib/theme.ts          # The theme choice: localStorage "theme", data-theme on <html>
├── styles/index.css      # The one stylesheet: Tailwind, @theme tokens, @custom-variant dark, @layer base
├── types.ts              # Todo interface + Filter type
├── App.tsx
└── main.tsx
```

## Conventions

- All API calls go through `api/todos.ts` — no inline fetch/axios in components
- TanStack Query: all mutations use **optimistic updates** (cancel → snapshot → mutate → rollback on error → invalidate on settled)
- Use `@base-ui/react` primitives wherever a component exists, through a wrapper in `components/ui/`; the two text inputs stay native
- The filter is a `RadioGroup` (it switches what one list shows, one item is always chosen, arrow keys may choose); `Tabs` is for panels
- Every icon-only button has an `aria-label`, and glyphs go through `Icon` (the ligature word is never a name)
- The add row and a task's title are buttons, so a keyboard can reach them
- The drag handle forwards use-gesture's handlers and has `touch-action: none`
- Inline edit state is local to `TodoItem` — controlled `<input>` replacing a `<span>`
- Drag reorder: no local copy of the list; `useReorderTodos` updates the query cache before the server answers
- Drag via `@use-gesture/react` `useDrag` — row height 36px used to compute step count from `movement[1]`

## Styling

- Tokens only from `@theme` in `styles/index.css`: no raw colour, no arbitrary colour, no `style=` prop
- Join classes with `cn()`; state through Base UI's `data-*` variants (`data-checked:`, `data-disabled:`)
- No `dark:` unless a token can't carry the difference; the colour tokens flip with the theme
- Motion under `motion-safe:`
- `better-tailwindcss` (in `npm run check`) rejects unknown classes and enforces the class order

## Toast Triggers

- Error only: `toast.error('Failed to update todo')` on toggle or delete failure, from `components/ui/Toast.tsx` (Base UI `Toast`, top centre, one at a time); an error stays until its Dismiss button closes it
- No success toasts
