# Frontend Rules & Conventions

## Stack

- React 19 + Vite 8 + TypeScript (`6.0.3`)
- `axios` — HTTP client (single instance, `baseURL: '/api'`)
- `@tanstack/react-query` — server state; all mutations invalidate `['todos']` on success
- `@base-ui/react` — headless UI primitives (Checkbox, Button, Separator)
- `@use-gesture/react` — drag-to-reorder gesture handling
- `sonner` — toast notifications

## File Layout

```
frontend/src/
├── api/todos.ts          # axios instance + 5 endpoint functions
├── components/
│   ├── shared/           # Generic Base UI wrappers (Checkbox, Button, Separator)
│   ├── FilterTabs.tsx
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   └── AddTodoField.tsx
├── hooks/useTodos.ts     # All TanStack Query hooks
├── types.ts              # Todo interface + Filter type
├── App.tsx
└── main.tsx
```

## Conventions

- All API calls go through `api/todos.ts` — no inline fetch/axios in components
- TanStack Query: all mutations use **optimistic updates** (cancel → snapshot → mutate → rollback on error → invalidate on settled)
- Use `@base-ui/react` primitives wherever a component exists; fall back to plain HTML only when no equivalent exists
- Inline edit state is local to `TodoItem` — controlled `<input>` replacing a `<span>`
- Drag reorder: no local copy of the list; `useReorderTodos` updates the query cache before the server answers
- Drag via `@use-gesture/react` `useDrag` — row height 36px used to compute step count from `movement[1]`

## Toast Triggers

- Error only: `toast.error('Failed to update todo')` on toggle or delete failure
- No success toasts
