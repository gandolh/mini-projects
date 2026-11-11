// Runs the vendored house-style sync for this folder. The sync copies into the root of the git work tree
// it runs in, and this app is one folder of a repo that holds other projects. Telling git not to look
// above the repo's root folder makes the sync use this folder (the nearest package.json) instead.
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const run = spawnSync(
  process.execPath,
  [resolve(appRoot, "vendor/house-style/bin/sync.mjs"), ...process.argv.slice(2)],
  { cwd: appRoot, stdio: "inherit", env: { ...process.env, GIT_CEILING_DIRECTORIES: dirname(appRoot) } },
);
process.exit(run.status ?? 1);
