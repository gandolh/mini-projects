# Wiki Index

Catalog of all wiki pages. Claude: read this first, then load specific pages based on the current task.

## Pages

| File | Summary |
|------|---------|
| [architecture.md](architecture.md) | Stack choices, rationale, monorepo layout, DB schema, key decisions |
| [api.md](api.md) | Full endpoint reference — method, path, request body, response shapes |
| [backend-rules.md](backend-rules.md) | Conventions for routes, DB access, error responses, TypeScript in backend |
| [frontend-rules.md](frontend-rules.md) | Frontend stack and conventions (stub — grows as frontend is built) |
| [design-rules.md](design-rules.md) | UI/UX principles and style decisions (stub — grows as UI is designed) |
| [log.md](log.md) | Append-only update history — what changed and when |

## When to load which page

- Working on backend routes or DB → load `api.md` + `backend-rules.md`
- Working on frontend → load `frontend-rules.md` + `api.md`
- Making UI decisions → load `design-rules.md`
- Onboarding / full context → load `architecture.md` + all rules pages
- Checking what changed recently → read last 5 entries of `log.md`
