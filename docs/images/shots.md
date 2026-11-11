# README images

How each image was made, so the next refresh is a re-run. Take an image again when the screen it shows changes.

| File | Shows | How to reach that state | Viewport | Data | Taken |
|---|---|---|---|---|---|
| git-helper-ui.webp | The diff of one file between two branches | `npm run dev` in `git-helper-ui/`; open http://localhost:5173, enter the demo repo's path, **Load branches**, base `main`, compare `feature/crop-rotation`, **Compare**, click `src/garden.ts`; cropped to the top 1240 px | 1440×900 @2x | a throwaway repo at `/home/demo/garden-planner` with two commits: a small garden planner, then a branch adding crop rotation | 2026-11-01 |
| pw-manager.webp | The unlocked vault with four entries | `npm start` in `pw-manager/` with `XDG_CONFIG_HOME` pointed at an empty folder, create a vault, add four entries; driven by Playwright's Electron support under `xvfb-run`; cropped to the top 660 px | the app's 900×650 window @2x | made-up names and usernames on `example.test`; random passwords that never appear on screen | 2026-11-01 |
| literally-a-todo-app.webp | The All tab with six tasks, two done, the hover icons on one row | both `npm run dev`s; six tasks added and two ticked through the API on port 3000; the mouse over the fourth row; cropped to the top 720 px | 1000×560 @2x | made-up household tasks | 2026-11-01 |

Captured with Playwright and Chrome, then `ffmpeg -i shot.png -vf <crop> -c:v libwebp -quality 82 shot.webp`.

The todo app loads its icon font from Google Fonts. Where that is blocked, the capture serves the same font, Material Symbols Outlined from the `material-symbols` npm package, through Playwright's request routing, so the icons render as they do for a visitor.

What is left out, and why:

- **The tomato detector.** Its sample photos look like stock images and a figure from a paper, not pictures taken for the project, so no image is made from them. The detection steps are described in text.
- **The TSP solver.** Its output is one line of text, shown in the README as text.
- **The todo app on a phone.** Until 2026-11-11 the title ran into the All, Active and Completed tabs at phone width ([corpus/todos/](../../corpus/todos/todo-header-overlaps-on-phones.md)). Brief 04 fixed it; a phone image waits for the next README refresh.
