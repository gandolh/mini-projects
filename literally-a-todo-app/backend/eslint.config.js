import { houseStyle } from "../vendor/house-style/eslint.config.js";

// The house config from the vendored house-style copy, given this project's folders.
export default houseStyle({
  root: import.meta.dirname,
  server: "src",
});
