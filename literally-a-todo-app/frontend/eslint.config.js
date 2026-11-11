import { houseStyle } from "../vendor/house-style/eslint.config.js";

// The house config from the vendored house-style copy, given this project's folders. The compiler is
// the first gate; the house adds only what it cannot see.
export default houseStyle({
  root: import.meta.dirname,
  web: "src",
  // vite.config.ts and this file are configs: the only default exports allowed.
});
