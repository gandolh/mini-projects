import { describe, expect, it } from "vitest";
import css from "./index.css?inline";

// The app's one stylesheet as the Vite plugin builds it (vitest runs the same plugins). Tailwind scans the sources
// for class names, this file included, so the fixture below is generated, or proved not to be.
const FIXTURE = {
  cleared: ["bg-red-500", "text-sm", "rounded-lg", "shadow-md"],
  tokens: [
    "bg-surface-lowest",
    "border-primary",
    "text-muted",
    "text-body",
    "z-sticky",
    "h-9",
    "bg-surface-high",
    "border-line",
  ],
};

/** Every rule whose selector list names `html` or `:root`, with its declarations. */
function rootRules(): string[] {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selectors]) => (selectors ?? "").split(",").some((s) => ["html", ":root"].includes(s.trim())))
    .map(([, , body]) => body ?? "");
}

describe("styles/index.css", () => {
  it("generates nothing for Tailwind's cleared default scales", () => {
    for (const name of FIXTURE.cleared) expect(css, name).not.toContain(`.${name}`);
  });

  it("generates the app's colour, type and z tokens", () => {
    for (const name of FIXTURE.tokens) expect(css, name).toContain(`.${name}`);
    expect(css).toMatch(/--text-body: 0\.875rem/);
    expect(css).toMatch(/--text-body--line-height: 1\.375rem/);
    expect(css).toMatch(/--font-mono: "Azeret Mono"/);
  });

  it("leaves the root at the browser's size, so h-9 is 2.25rem, the 36 px row of a mouse", () => {
    expect(css).toMatch(/--spacing: 0\.25rem/);
    expect(css).toMatch(/\.h-9 \{\s*height: calc\(var\(--spacing\) \* 9\)/);
    expect(rootRules().length).toBeGreaterThan(0);
    for (const body of rootRules()) expect(body).not.toMatch(/(^|;|\s)font-size:/);
  });
});
