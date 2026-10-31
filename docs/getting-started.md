# Getting started

How to run each of the five projects. They share nothing, so install and run each one from its own folder. The [main README](../README.md) has the short version.

Checked on 2026-11-01 with Node 24 and Python 3.11 on Linux.

## git-helper-ui

Node 20 or newer.

```bash
cd git-helper-ui
npm install
npm run dev
```

That starts the API on port 5174 and the page on http://localhost:5173, which forwards `/api` to the API. Paste the absolute path of any git repo on your disk, press **Load branches**, pick a base and a compare branch, and press **Compare**. The diff is `base...compare`, from the merge base, the way GitLab shows a merge request.

`npm run build` builds both halves. The Docker setup that serves both on port 3020 is in [git-helper-ui/infra/](../git-helper-ui/infra/README.md); it was not tried on 2026-11-01 because Docker was not available.

## pw-manager

Node 20 or newer, and a desktop session, since it opens a window.

```bash
cd pw-manager
npm install
npm run rebuild      # builds better-sqlite3 for Electron's Node
npm start            # builds, then opens the window
```

The first start asks for a master password and creates the vault at Electron's user data folder, `~/.config/pw-manager/vault.db` on Linux. The password cannot be recovered. `npm run typecheck` checks both the main process and the window.

## literally-a-todo-app

Node 20 or newer. The API and the page run in two terminals.

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

The list starts empty. The icons come from Google Fonts, so they show as words when the browser is offline. The app's own wiki, with the API and its design rules, is in [literally-a-todo-app/docs/wiki/](../literally-a-todo-app/docs/wiki/index.md).

## fai-project-tsp-astar-mst

Python 3, standard library only.

```bash
cd fai-project-tsp-astar-mst
python main.py
```

It reads `test_graph.txt`, five cities, and prints the tour and its weight: `1 5 4 2 3 1 16`. To solve the ten-city `graph.txt` instead, change `graph_path` in `main.py`. The input format is in the project's [README](../fai-project-tsp-astar-mst/README.md), and `result.md` shows an earlier run on `graph.txt`.

## tomato-detection-computer-vision

Python 3 with OpenCV, NumPy and Matplotlib. The window also needs Tkinter, which some Linux distributions ship as a separate package such as `python3-tk`.

```bash
pip install opencv-python numpy matplotlib
cd tomato-detection-computer-vision/tomato-detector
python main.py       # shows every stage for ../tomato1.jpg in one figure
python ui.py         # load any photo and tune the thresholds with sliders
```

Run both from `tomato-detector/`, because `main.py` opens the sample image by a relative path.
