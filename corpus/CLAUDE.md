# Corpus: how this wiki works

`corpus/` is the repo-wide wiki, kept to the corpus-flow standard of gandolh/my-personal-skills. The owner curates the sources and asks the questions. Claude curates the synthesis and tracks the work.

This repo holds five finished projects, each in its own folder. Some already keep their own notes, and the wiki points to them instead of copying them:

| Fact | Its home |
|---|---|
| How to run each project | [docs/getting-started.md](../docs/getting-started.md) |
| git-helper-ui's API and Docker setup | [git-helper-ui/README.md](../git-helper-ui/README.md), [git-helper-ui/infra/](../git-helper-ui/infra/README.md) |
| How pw-manager splits main, preload and window | [pw-manager/CLAUDE.md](../pw-manager/CLAUDE.md) |
| The todo app's API, stack and design rules | [literally-a-todo-app/docs/wiki/](../literally-a-todo-app/docs/wiki/index.md), with its own CLAUDE.md |

A project folder's own CLAUDE.md wins inside that folder.

## Read it on a budget

1. Read [index.md](index.md). Triage on each page's `summary:` line.
2. Then read at most two or three wiki pages.
3. Never read `briefs/` or `todos/` wholesale. [wiki/status.md](wiki/status.md) lists what is open.

## Layout

| Path | Job |
|---|---|
| `index.md` | The catalog, generated from each page's `summary:` by `bash corpus/lint.sh --index` |
| `routing.md` | Which skill handles which request, and which layer answers which question |
| `log.md` | One dated entry per meaningful change, newest last |
| `todos/` | Captured ideas and findings as prose, before they are specs |
| `briefs/todo/`, `done/`, `superseded/` | Numbered work specs. A brief in `done/` or `superseded/` is never edited |
| `wiki/` | The synthesis pages. Claude edits them freely |

## Conventions

- Every wiki page starts with `summary:` and `updated:` frontmatter. The summary says what question the page answers.
- One concept per page. Split a page past about 200 body lines.
- Standard relative Markdown links and absolute dates.
- Brief numbers are stable. Moving a brief never renumbers it.
- Log entries use `## [YYYY-MM-DD] kind | title`.
- Run `bash corpus/lint.sh` before committing corpus changes.

## Source of truth, when things disagree

1. The code wins over any wiki claim.
2. A brief in `done/` wins over the wiki if the wiki has not caught up.
3. A project folder's own notes win over this wiki for that project.
