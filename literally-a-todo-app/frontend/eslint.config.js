import { houseStyle } from "../vendor/house-style/eslint.config.js";

// The house config from the vendored house-style copy, given this project's folders. The compiler is
// the first gate; the house adds only what it cannot see.
export default houseStyle({
  root: import.meta.dirname,
  web: "src",
  // better-tailwindcss reads the app's one stylesheet for its classes: an unknown or deprecated class is an error,
  // and so is a class string out of Tailwind's order.
  tailwind: { css: "src/styles/index.css", order: true },
  // vite.config.ts and this file are configs: the only default exports allowed.
});
