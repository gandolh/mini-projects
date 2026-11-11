import { devices, expect, test, type Page } from "@playwright/test";

async function mockApi(page: Page) {
  const todos = ["First", "Second"].map((title, position) => ({ id: position + 1, title, completed: 0, position }));
  await page.route("**/api/todos", (route) => route.fulfill({ json: todos }));
}

// A row has no role of its own: it is the parent of the task's checkbox, and its actions' wrapper is the parent of
// its Delete button.
function actionsOf(page: Page, title: string) {
  return page
    .getByRole("checkbox", { name: title, exact: true })
    .locator("..")
    .getByRole("button", { name: "Delete" })
    .locator("..");
}

test("a row's actions show under the pointer, and while keyboard focus is in the row", async ({ page }) => {
  await mockApi(page);
  await page.goto("/");
  await page.mouse.move(1, 700);

  await expect(actionsOf(page, "Second")).toHaveCSS("opacity", "0");
  await page.getByRole("checkbox", { name: "Second" }).hover();
  await expect(actionsOf(page, "Second")).toHaveCSS("opacity", "1");

  await page.mouse.move(1, 700);
  await expect(actionsOf(page, "Second")).toHaveCSS("opacity", "0");
  await page.getByRole("checkbox", { name: "Second" }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Second", exact: true })).toBeFocused();
  await expect(actionsOf(page, "Second")).toHaveCSS("opacity", "1");
});

test("on an Android phone, which has no hover, every row's actions show", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ ...devices["Pixel 7"], baseURL });
  const page = await context.newPage();
  await mockApi(page);
  await page.goto("/");

  expect(await page.evaluate(() => matchMedia("(hover: none)").matches)).toBe(true);
  await expect(actionsOf(page, "First")).toHaveCSS("opacity", "1");
  await expect(actionsOf(page, "Second")).toHaveCSS("opacity", "1");
  await context.close();
});
