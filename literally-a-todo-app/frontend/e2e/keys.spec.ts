import { expect, test, type Page } from "@playwright/test";

async function mockApi(page: Page) {
  const todos = ["First", "Second"].map((title, position) => ({ id: position + 1, title, completed: 0, position }));
  await page.route("**/api/todos", (route) => route.fulfill({ json: todos }));
}

for (const key of ["Enter", "Space"]) {
  test(`${key} on "Add a new task..." opens the field`, async ({ page }) => {
    await mockApi(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Add a new task..." }).focus();
    await page.keyboard.press(key);

    await expect(page.getByRole("textbox")).toBeFocused();
  });

  test(`${key} on a title starts the edit`, async ({ page }) => {
    await mockApi(page);
    await page.goto("/");

    await page.getByRole("button", { name: "First", exact: true }).focus();
    await page.keyboard.press(key);

    await expect(page.getByRole("textbox")).toHaveValue("First");
    await expect(page.getByRole("textbox")).toBeFocused();
  });
}
