# Getting started

How to run each of the five projects. They share nothing, so install and run each one from its own folder. The [main README](../README.md) has the short version.

Last checked on 2026-11-16 on Linux with Node 22.23 and Python 3.13: both web apps' dev servers, the password manager's window, the TSP solver and its tests. The tomato detector was last run on 2026-11-01.

## git-helper-ui

Node 22.12 or newer, or 20.19 on the 20 line. Vite 8 asks for that range.

```bash
cd git-helper-ui
npm install
npm run dev
```

That starts the API on port 5174 and the page on http://localhost:5173, which forwards `/api` to the API. Paste the absolute path of any git repo on your disk, press **Load branches**, pick a base and a compare branch, and press **Compare**. The diff is `base...compare`, from the merge base, the way GitLab shows a merge request.

`PORT` moves the API, but the page's forward to 5174 is fixed in `client/vite.config.ts`, so change both together.

`npm run build` builds both halves. The Docker setup that serves both on port 3020 is in [git-helper-ui/infra/](../git-helper-ui/infra/README.md); it has not been tried, because Docker was not available.

## pw-manager

Node 20 or newer, and a desktop session, since it opens a window.

```bash
cd pw-manager
npm install
npm run rebuild      # builds better-sqlite3 for Electron's Node
npm start            # builds, then opens the window
```

The first start asks for a master password and creates the vault at Electron's user data folder, `~/.config/pw-manager/vault.db` on Linux. The password cannot be recovered. `npm run typecheck` checks both the main process and the window.

Running as root, for example in a container, Electron stops with "Running as root without --no-sandbox is not supported". Pass the flag through: `npm start -- --no-sandbox`.

## literally-a-todo-app

Node 22.12 or newer, or 20.19, for the app. The app folder's lint and format tools declare Node 24 in `engines`; on Node 22, npm warns and installs them anyway. The API and the page run in two terminals.

```bash
cd literally-a-todo-app/backend
npm install
npm run dev          # the API on 127.0.0.1:3000, data in literally-a-todo-app/todos.db
```

```bash
cd literally-a-todo-app/frontend
npm install
npm run dev          # http://localhost:5173, forwards /api to port 3000
```

The list starts empty. A first visit uses the light theme; the switch for Light, Dark and System sits in the header on a wide screen and under the list on a phone. The fonts, Azeret Mono and the Material Symbols icons, come from the app's own npm packages, so the page loads no font from the network.

The API reads three variables, all optional:

| Variable | Default | What it sets |
|---|---|---|
| `PORT` | `3000` | The API's port. The page's forward to 3000 is fixed in `frontend/vite.config.ts`. |
| `HOST` | `127.0.0.1` | The address the API listens on |
| `DATABASE_PATH` | `todos.db` in `literally-a-todo-app/` | The SQLite file; `:memory:` keeps the list only while the API runs |

Checks, from `literally-a-todo-app/`, after `npm install` there as well:

- `npm run check`: typecheck, lint, format check, the frontend and backend tests, and the convention checks, for both halves.
- `npm run test:e2e` in `frontend/`: the Playwright flow specs. They mock the API and start Vite on port 5173 themselves.

The app's own wiki, with the API and its design rules, is in [literally-a-todo-app/docs/wiki/](../literally-a-todo-app/docs/wiki/index.md).

## fai-project-tsp-astar-mst

Python 3, standard library only.

```bash
cd fai-project-tsp-astar-mst
python main.py
```

It reads `test_graph.txt`, five cities, and prints the tour and its weight: `1 5 4 2 3 1 16`. To solve the ten-city `graph.txt` instead, change `graph_path` in `main.py`; its optimal tour weighs 334. `python -m unittest` runs the three tests in `test_tsp.py`. The input format is in the project's [README](../fai-project-tsp-astar-mst/README.md), and `result.md` shows an earlier run on `graph.txt`, a different tour of the same weight.

## tomato-detection-computer-vision

Python 3 with OpenCV, NumPy and Matplotlib. The window also needs Tkinter, which some Linux distributions ship as a separate package such as `python3-tk`.

```bash
pip install opencv-python numpy matplotlib
cd tomato-detection-computer-vision/tomato-detector
python main.py       # shows every stage for ../tomato1.jpg in one figure
python ui.py         # load any photo and tune the thresholds with sliders
```

Run both from `tomato-detector/`, because `main.py` opens the sample image by a relative path.
