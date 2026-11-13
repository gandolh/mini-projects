import { expect, test, type Page } from "@playwright/test";
import { fixtureRows, mockRows } from "./fixtures.js";

// Screenshots for the redesign board, kept out of git: `SHOTS_DIR=<dir> npx playwright test shots`.
// The shots are named <screen>-<theme>-<width>.png. Without SHOTS_DIR the spec skips.
const DIR = process.env["SHOTS_DIR"];
const SIZES = [
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
];

test.skip(!DIR, "SHOTS_DIR is not set");
test.use({ contextOptions: { reducedMotion: "reduce" } });

async function open(page: Page, theme: "light" | "dark", rows = fixtureRows(6)) {
  await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
  await mockRows(page, rows);
  await page.goto("/");
  await expect(page.getByRole("checkbox").first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function shoot(page: Page, name: string, theme: string, width: number) {
  await page.screenshot({ path: `${DIR}/${name}-${theme}-${width}.png` });
}

for (const theme of ["light", "dark"] as const) {
  for (const { width, height } of SIZES) {
    test.describe(`${theme} ${width}`, () => {
      test.use({ viewport: { width, height } });

      test("list", async ({ page }) => {
        await open(page, theme);
        if (width > 640) await page.getByRole("checkbox", { name: "Reply to the landlord" }).hover();
        await shoot(page, "list", theme, width);
      });

      test("edit-row", async ({ page }) => {
        await open(page, theme);
        await page.getByRole("button", { name: "Edit Reply to the landlord" }).click();
        await shoot(page, "edit-row", theme, width);
      });

      test("empty-filter", async ({ page }) => {
        // The comp's empty filter has no done task, so every row here is open.
        await open(
          page,
          theme,
          fixtureRows(6).map((row) => ({ ...row, completed: 0 })),
        );
        await page.getByRole("radio", { name: "Completed" }).click();
        await expect(page.getByText("No tasks.")).toBeVisible();
        await shoot(page, "empty-filter", theme, width);
      });

      test("add-open", async ({ page }) => {
        await open(page, theme);
        await page.getByRole("button", { name: "Add a new task..." }).click();
        await shoot(page, "add-open", theme, width);
      });

      test("toast", async ({ page }) => {
        await open(page, theme);
        await page.route("**/api/todos/1", (route) => route.fulfill({ status: 500, json: { error: "down" } }));
        await page.getByRole("checkbox", { name: "Plan the week's meals" }).click();
        await expect(page.getByText("Failed to update todo").first()).toBeVisible();
        await shoot(page, "toast", theme, width);
      });

      test("loading", async ({ page }) => {
        await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
        await page.route("**/api/todos", () => new Promise(() => undefined));
        await page.goto("/");
        await expect(page.getByText("Loading...")).toBeVisible();
        await shoot(page, "loading", theme, width);
      });

      test("first-screen-24", async ({ page }) => {
        await open(page, theme, fixtureRows(24));
        await shoot(page, "first-screen-24", theme, width);
      });
    });
  }
}

test.describe("the menu, on touch", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const theme of ["light", "dark"] as const) {
    test(`menu ${theme}`, async ({ page }) => {
      await open(page, theme);
      await page.getByRole("button", { name: "More actions for Reply to the landlord" }).click();
      await expect(page.getByRole("menuitem", { name: "Delete" })).toBeVisible();
      await shoot(page, "menu", theme, 390);
    });
  }
});

test.describe("a touch screen at 768", () => {
  test.use({ viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true });
  for (const theme of ["light", "dark"] as const) {
    test(`list ${theme}`, async ({ page }) => {
      await open(page, theme);
      await shoot(page, "list", theme, 768);
    });
  }
});
