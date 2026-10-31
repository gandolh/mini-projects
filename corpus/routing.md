# Routing: how work routes in this repo
<!-- Read by the orchestrate skill. Tune freely, keep it short. -->

**Implement skill:** plan-split-dispatch
**Review skill:** a general-purpose agent over the diff, plus the touched project's own build or type-check
**PR skill:** propose git commands; the owner pushes
**Issue tracker:** none. Findings go to `corpus/todos/`
**Code host:** GitHub, gandolh/mini-projects, public

## Intent routing
| Signal | Intent | Route to |
|--------|--------|----------|
| New idea or finding to capture | capture | corpus-flow: add todo |
| Ready to build, 3 or more chunks | build | brief, then plan-split-dispatch |
| Ready to build, 1 or 2 files | build, small | brief, then implement inline |
| README, docs/ or screenshots refresh | docs | readme-docs, then `docs/images/shots.md` |
| Prose needs a style pass | docs | unslop |
| "what does the wiki say about X" | query | corpus-flow: query wiki |

## Knowledge routing: which layer answers which question
| Question shape | Route to |
|---|---|
| "How do I run X?" | [docs/getting-started.md](../docs/getting-started.md) |
| "What is in this repo and where does it stand?" | [wiki/overview.md](wiki/overview.md), [wiki/status.md](wiki/status.md) |
| "How does project X work inside?" | that folder's README or CLAUDE.md, then its code |
| "Where did this come from?" | `git log -- <folder>` and the `Import ...` merge commits |
| "Did I get every usage?" for a rename | `grep -rnw` inside the project folder |

## READ / SKIP / SKILLS
| Task type | READ | SKIP | SKILLS |
|-----------|------|------|--------|
| Change one project | that folder's README and CLAUDE.md, the brief | the other four folders | plan-split-dispatch |
| README or images | README.md, docs/, docs/images/shots.md | project internals | readme-docs, unslop |
