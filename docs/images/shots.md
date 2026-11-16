# README images

How each image was made, so the next refresh is a re-run. Take an image again when the screen it shows changes.

| File | Shows | How to reach that state | Viewport | Data | Taken |
|---|---|---|---|---|---|
| git-helper-ui.webp | The diff of one file between two branches | `npm run dev` in `git-helper-ui/`; open http://localhost:5173, enter the demo repo's path, **Load branches**, base `main`, compare `feature/crop-rotation`, **Compare**, click `src/garden.ts`; cropped to the top 1240 px | 1440×900 @2x | a throwaway repo at `/home/demo/garden-planner` with two commits: a small garden planner, then a branch adding crop rotation | 2026-11-01 |
| pw-manager.webp | The unlocked vault with four entries | `npm start` in `pw-manager/` with `XDG_CONFIG_HOME` pointed at an empty folder, create a vault, add four entries; driven by Playwright's Electron support under `xvfb-run`; cropped to the top 660 px | the app's 900×650 window @2x | made-up names and usernames on `example.test`; random passwords that never appear on screen | 2026-11-01 |
| literally-a-todo-app.webp | The All tab with six tasks, two done, the row actions showing on the third row | `npm run dev` in `backend/` with `DATABASE_PATH` pointed at an empty scratch file, and in `frontend/`; six tasks added and the second and fifth ticked through the API; the pointer over "Reply to the landlord"; cropped to the top 800 px | 1440×900 @2x | the six household tasks of the frontend's `e2e/fixtures.ts` | 2026-11-16 |
| literally-a-todo-app-phone.webp | The same list on a phone: grips, row menus, the theme card under the list | the same state, no pointer; cropped to the top 1740 px, just under the theme card | Playwright's `iPhone 14` device | same | 2026-11-16 |

Captured with Playwright's Chromium in the Europe/Bucharest time zone, light theme (the default on a first visit), then `ffmpeg -i shot.png -vf crop=<w>:<h>:0:0 -c:v libwebp -quality 82 shot.webp`.

The todo app's Vite server forwards `/api` to port 3000. The 2026-11-16 capture ran the API on another port, so Playwright's request routing sent the page's `/api/` requests there instead.

On 2026-11-16 git-helper-ui and pw-manager were started again and still look as in their images; neither has changed since 2026-11-01, so those two were kept.

What is left out, and why:

- **The tomato detector.** Its sample photos look like stock images and a figure from a paper, not pictures taken for the project, so no image is made from them. The detection steps are described in text.
- **The TSP solver.** Its output is one line of text, shown in the README as text.
