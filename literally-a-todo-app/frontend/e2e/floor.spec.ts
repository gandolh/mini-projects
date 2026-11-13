import { devices, expect, test, type Page } from "@playwright/test";
import { fixtureRows, mockRows } from "./fixtures.js";

// The redesign's floor (brief 06): a visible focus ring on every stop, no motion under reduced motion, no sideways
// scroll at phone widths, and the token pairs' contrast in both themes.

async function open(page: Page, rows = fixtureRows(4)) {
  await mockRows(page, rows);
  await page.goto("/");
  await expect(page.getByRole("checkbox").first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

/** Tabs from the top of the page until focus leaves it, returning each stop's name and its outline. */
async function tabStops(page: Page) {
  const stops: { name: string; style: string; width: string }[] = [];
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const css = getComputedStyle(el);
      return {
        name: el.getAttribute("aria-label") ?? el.textContent?.trim() ?? el.tagName,
        style: css.outlineStyle,
        width: css.outlineWidth,
      };
    });
    if (!stop) break;
    stops.push(stop);
  }
  return stops;
}

test("every Tab stop on a wide screen shows a 2 px focus ring, the row actions included", async ({ page }) => {
  await open(page);
  const stops = await tabStops(page);
  const names = stops.map((s) => s.name);
  for (const name of ["Light", "All", "Plan the week's meals", "Edit Plan the week's meals", "Delete"]) {
    expect(names, name).toContain(name);
  }
  expect(names.some((n) => n.includes("Add a new task..."))).toBe(true);
  expect(names.filter((n) => n === "Drag to reorder").length).toBeGreaterThanOrEqual(4);
  for (const stop of stops) {
    expect(stop.style, stop.name).toBe("solid");
    expect(stop.width, stop.name).toBe("2px");
  }
});

test("every Tab stop on an Android phone shows a 2 px focus ring, the menu button and its items included", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ ...devices["Pixel 7"], baseURL });
  const page = await context.newPage();
  await open(page);
  const stops = await tabStops(page);
  const names = stops.map((s) => s.name);
  expect(names).toContain("More actions for Plan the week's meals");
  expect(names).toContain("Edit Plan the week's meals");
  expect(names.filter((n) => n === "Drag to reorder")).toHaveLength(4);
  for (const stop of stops) {
    expect(stop.style, stop.name).toBe("solid");
    expect(stop.width, stop.name).toBe("2px");
  }

  // Into the menu from the keyboard: Enter opens it, and the arrow keys reach Move down and Delete.
  await page.getByRole("button", { name: "More actions for Reply to the landlord" }).focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem", { name: "Move up" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  const delete_ = menu.getByRole("menuitem", { name: "Delete" });
  await expect(delete_).toBeFocused();
  await expect(delete_).toHaveCSS("outline-style", "solid");
  await expect(delete_).toHaveCSS("outline-width", "2px");
  await context.close();
});

test.describe("under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("no animation runs and no transition has a duration, through hover, edit, the menu and a toast", async ({
    page,
  }) => {
    await open(page);
    await page.route("**/api/todos/1", (route) => route.fulfill({ status: 500, json: { error: "down" } }));
    await page.getByRole("checkbox", { name: "Reply to the landlord" }).hover();
    await page.getByRole("checkbox", { name: "Plan the week's meals" }).click();
    await expect(page.getByText("Failed to update todo").first()).toBeVisible();
    await page.getByRole("button", { name: "Edit Water the plants" }).click();

    const motion = await page.evaluate(() => {
      const running = document.getAnimations().filter((a) => a.playState === "running").length;
      const timed = [...document.querySelectorAll("*")].filter((el) =>
        getComputedStyle(el)
          .transitionDuration.split(",")
          .some((d) => parseFloat(d) > 0),
      ).length;
      return { running, timed };
    });
    expect(motion).toEqual({ running: 0, timed: 0 });
  });
});

for (const width of [390, 360]) {
  test(`at ${width} px the page does not scroll sideways, in either theme, edit and toast included`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const theme of ["light", "dark"]) {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      await open(page, fixtureRows(24));
      await page.route("**/api/todos/2", (route) => route.fulfill({ status: 500, json: { error: "down" } }));
      await page.getByRole("button", { name: "Edit Reply to the landlord" }).first().click();
      await page.getByRole("checkbox", { name: "Water the plants" }).first().click();
      await expect(page.getByText("Failed to update todo").first()).toBeVisible();
      const widths = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        inner: window.innerWidth,
      }));
      expect(widths.scroll, `${theme} ${width}`).toBeLessThanOrEqual(widths.inner);
      await page.unroute("**/api/todos/2");
    }
  });
}

// How many of the 24 fixture rows fit whole on the first screen. The board counted 18, 13 and 11; the build matches
// the first two and fits 12 at 360 (its title column is the twin's 222 px, so the board's 11 is not reproduced).
for (const [width, height, rows] of [
  [1280, 800, 18],
  [390, 844, 13],
  [360, 800, 12],
] as const) {
  test(`${rows} rows fit whole on the first screen at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await open(page, fixtureRows(24));
    const bottoms = await page.evaluate(() =>
      [...document.querySelectorAll('[role="checkbox"]')].map(
        (el) => el.parentElement?.getBoundingClientRect().bottom ?? 0,
      ),
    );
    expect(bottoms.filter((bottom) => bottom <= height)).toHaveLength(rows);
  });
}

// Contrast, over the tokens as the page resolves them: each pair's colours are read from a probe element, so the
// numbers are the built stylesheet's, not the source's.
const TEXT = 4.5;
const PART = 3;
const PAIRS: [fg: string, bg: string, min: number, use: string][] = [
  ["on-surface", "surface-lowest", TEXT, "text on the sheet and the odd rows"],
  ["on-surface", "surface-low", TEXT, "text on the even rows"],
  ["on-surface", "surface-high", TEXT, "text on the head band and a highlighted menu item"],
  ["on-surface", "surface", TEXT, "text on the page"],
  ["muted", "surface-lowest", TEXT, "the add row, placeholders, labels, No tasks."],
  ["muted", "surface-low", TEXT, "a done title on an even row, the grip"],
  ["muted", "surface-high", TEXT, "Show and the unchosen segments"],
  ["muted", "surface", TEXT, "text on the page"],
  ["on-primary", "primary", TEXT, "the chosen filter, the tick, a pressed button"],
  ["danger", "surface-lowest", TEXT, "Delete in the menu, the toast's icon"],
  ["danger", "surface-high", TEXT, "Delete when highlighted"],
  ["primary", "surface-lowest", TEXT, "icons and the toast's Dismiss"],
  ["primary", "surface-low", PART, "icons on an even row"],
  ["primary", "surface-high", PART, "the focus ring, the hover bar and the frame on the band"],
  ["primary", "surface", PART, "the focus ring on the page"],
  ["outline", "surface-lowest", PART, "the checkbox and the segment edges"],
  ["outline", "surface-low", PART, "the checkbox on an even row"],
  ["outline", "surface-high", PART, "the segments on the head band"],
  ["muted", "surface-lowest", PART, "disabled icons"],
];

test("every text and icon pair clears its contrast minimum in both themes", async ({ page }, testInfo) => {
  await mockRows(page, fixtureRows(2));
  const lines: string[] = [];
  for (const theme of ["light", "dark"] as const) {
    await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
    await page.goto("/");
    const ratios = await page.evaluate((pairs) => {
      const probe = document.createElement("div");
      document.body.append(probe);
      const rgb = (token: string) => {
        probe.style.color = `var(--color-${token})`;
        return (getComputedStyle(probe).color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      };
      const lum = (c: number[]) => {
        const [r = 0, g = 0, b = 0] = c.map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      return pairs.map(([fg, bg]) => {
        const a = lum(rgb(fg));
        const b = lum(rgb(bg));
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      });
    }, PAIRS);
    PAIRS.forEach(([fg, bg, min, use], i) => {
      const ratio = ratios[i] ?? 0;
      lines.push(`${theme} ${fg} on ${bg}: ${ratio.toFixed(2)} (min ${min}) ${use}`);
      expect(ratio, `${theme} ${fg} on ${bg}`).toBeGreaterThanOrEqual(min);
    });
  }
  testInfo.annotations.push({ type: "contrast", description: lines.join("\n") });
  console.log(lines.join("\n"));
});
