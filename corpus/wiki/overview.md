---
summary: What the five projects in this repo are, when each was built, and how they came to share one repo
updated: 2026-11-01
---

# Overview

mini-projects keeps five small, finished projects together. Each was its own GitHub repository first. On 2026-07-19 they were merged here with `git subtree`, one folder each, and the merge commits named `Import <project> into <project>/` keep every original commit. The original repositories are no longer public.

| Folder | What it is | Stack | Commits |
|---|---|---|---|
| `git-helper-ui/` | A GitLab-style diff viewer for local git repos, `base...compare` file by file | React and Vite, Express 5 with simple-git, npm workspaces | 2026-05-22 to 2026-05-24 |
| `pw-manager/` | A desktop password manager with a master password and an idle lock | Electron, better-sqlite3, PBKDF2 and AES-256-GCM | 2026-05-07 to 2026-05-24, moved to Electron on 2026-05-24 |
| `literally-a-todo-app/` | A todo list with filters and reordering | React with Base UI and TanStack Query, Fastify, better-sqlite3 | 2026-04-30 to 2026-05-01 |
| `fai-project-tsp-astar-mst/` | A travelling salesman solver, A* with a minimum spanning tree heuristic | Python, standard library | 2026-01-13 to 2026-01-29 |
| `tomato-detection-computer-vision/` | Ripe tomato detection with an HSV mask, morphology and contour filters | Python, OpenCV, Matplotlib, Tkinter | 2025-12-17 |

The projects share no code and no install. The repo root has only the README, `docs/` and this corpus.
