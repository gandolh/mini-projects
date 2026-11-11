import { expect, test, type Page } from "@playwright/test";

async function mockApi(page: Page) {
  const todos = ["First", "Second"].map((title, position) => ({ id: position + 1, title, completed: 0, position }));
  await page.route("**/api/todos", (route) => route.fulfill({ json: todos }));
}

test("every icon-only control and each task's checkbox is found by its name", async ({ page }) => {
  await mockApi(page);
  await page.goto("/");

  await expect(page.getByRole("checkbox", { name: "First" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Second" })).toBeVisible();
  for (const name of ["Drag to reorder", "Move up", "Move down", "Delete"]) {
    await expect(page.getByRole("button", { name })).toHaveCount(2);
  }

  // A task's edit and the add field each show a Save button.
  await page.getByRole("button", { name: "First", exact: true }).click();
  await expect(page.getByRole("button", { name: "Save" })).toHaveCount(1);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Add a new task..." }).click();
  await expect(page.getByRole("button", { name: "Save" })).toHaveCount(1);
});

test("no control is named by an icon's ligature word", async ({ page }) => {
  await mockApi(page);
  await page.goto("/");

  const ligatures = ["keyboard_arrow_up", "keyboard_arrow_down", "drag_indicator", "delete", "check"];
  for (const name of ligatures) {
    await expect(page.getByRole("button", { name, exact: true })).toHaveCount(0);
    await expect(page.getByRole("checkbox", { name, exact: true })).toHaveCount(0);
  }
});
