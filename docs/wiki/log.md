# Wiki Log

Append-only history of wiki updates. Each entry starts with `## [YYYY-MM-DD]` for grep.

To find recent entries: `grep "^## \[" docs/wiki/log.md | tail -5`

---

## [2026-04-30] init | Initial wiki created from codebase state

Summary: Wiki scaffolded from current codebase. Backend is fully implemented (Fastify + SQLite, 5 endpoints). Frontend is the default Vite/React scaffold — not yet wired to the API.

Pages touched: index.md, architecture.md, api.md, backend-rules.md, frontend-rules.md (stub), design-rules.md (stub)
