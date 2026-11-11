import preset from "../vendor/house-style/knip.json" with { type: "json" };

// knip has no `extends`, so this spreads the house preset. It runs per project (each has its own
// package.json and lockfile), and the root check:conventions calls both. The preset's vendor ignore is
// dropped: the vendored copy sits one folder up, outside the project. ESLint, Prettier and knip are installed
// once in the folder above, so knip sees them as binaries the project does not list, and the ESLint
// config is an entry because knip only finds it through an `eslint` dependency.
export default {
  ...preset,
  ignore: [],
  entry: ["eslint.config.js"],
  ignoreBinaries: ["eslint", "prettier", "knip"],
};
