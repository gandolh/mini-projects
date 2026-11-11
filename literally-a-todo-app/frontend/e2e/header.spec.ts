import { expect, test, type Page } from "@playwright/test";

async function boxes(page: Page) {
  await page.route("**/api/todos", (route) => route.fulfill({ json: [] }));
  await page.goto("/");
  const title = await page.getByRole("banner").getByText("Literally a todo app").boundingBox();
  const tabs = await page.getByRole("radiogroup", { name: "Show" }).boundingBox();
  if (!title || !tabs) throw new Error("the header's title or tabs have no box");
  return { title, tabs };
}

test("on a phone the tabs take their own row, below the title", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { title, tabs } = await boxes(page);
  expect(tabs.y).toBeGreaterThanOrEqual(title.y + title.height);
});

test("on a wide screen the title and the tabs share one row, the tabs centred", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { title, tabs } = await boxes(page);
  expect(tabs.x).toBeGreaterThan(title.x + title.width);
  expect(Math.abs(tabs.x + tabs.width / 2 - 640)).toBeLessThan(2);
  expect(tabs.y).toBeLessThan(title.y + title.height);
});
