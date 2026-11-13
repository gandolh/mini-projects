import { expect, test, type Page } from "@playwright/test";
import { fixtureRows, mockRows } from "./fixtures.js";

async function boxes(page: Page) {
  await mockRows(page, fixtureRows(24));
  await page.goto("/");
  const title = await page.getByRole("banner").getByText("Literally a todo app").boundingBox();
  const filter = await page.getByRole("radiogroup", { name: "Show" }).boundingBox();
  const theme = await page.getByRole("radiogroup", { name: "Theme" }).boundingBox();
  const sheetEnd = await page.getByRole("checkbox").last().boundingBox();
  if (!title || !filter || !theme || !sheetEnd)
    throw new Error("the header's title, filter or theme switch has no box");
  return { title, filter, theme, sheetEnd };
}

test("on a phone the filter sits in the head band, below the title, and the theme switch under the list", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { title, filter, theme } = await boxes(page);
  expect(filter.y).toBeGreaterThanOrEqual(title.y + title.height);
  // Last in the page, under the 24 rows: far below the first screen.
  expect(theme.y).toBeGreaterThan(844);
});

test("on a phone the title header scrolls away and the head band and the add row stay pinned", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await boxes(page);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  const title = await page.getByText("Literally a todo app").boundingBox();
  expect(title === null || title.y + title.height <= 0).toBe(true);
  const filter = await page.getByRole("radiogroup", { name: "Show" }).boundingBox();
  expect(filter?.y).toBeLessThan(60);
  await expect(page.getByRole("button", { name: "Add a new task..." })).toBeInViewport();
});

test("on a wide screen the title and the theme switch share the header, and the filter sits in the band below", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { title, filter, theme } = await boxes(page);
  expect(theme.x).toBeGreaterThan(title.x + title.width);
  expect(theme.y).toBeLessThan(title.y + title.height);
  expect(filter.y).toBeGreaterThanOrEqual(48);
});
