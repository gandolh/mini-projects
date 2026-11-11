import { houseStyle } from "../vendor/house-style/eslint.config.js";

// The house config from the vendored house-style copy, given this project's folders.
export default [
  ...houseStyle({
    root: import.meta.dirname,
    server: "src",
  }),
  {
    // A warning for now (2026-11-11): the server has no config.ts yet, and nothing reads the environment.
    // When the server takes its settings from config.ts, this block goes and the rule is an error again.
    name: "todo-backend/process-env-warns",
    files: ["src/**"],
    rules: { "n/no-process-env": "warn" },
  },
];
