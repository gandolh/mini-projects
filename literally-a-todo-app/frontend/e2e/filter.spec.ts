import { expect, test } from "@playwright/test";

test("the filter is one radio group, and the arrow keys choose what the list shows", async ({ page }) => {
  const todos = [
    { id: 1, title: "Open task", completed: 0, position: 0 },
    { id: 2, title: "Done task", completed: 1, position: 1 },
  ];
  await page.route("**/api/todos", (route) => route.fulfill({ json: todos }));
  await page.goto("/");

  await expect(page.getByRole("radiogroup", { name: "Show" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "All" })).toBeChecked();
  await expect(page.getByRole("checkbox")).toHaveCount(2);

  await page.getByRole("radio", { name: "All" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Active" })).toBeChecked();
  await expect(page.getByRole("checkbox")).toHaveCount(1);
  await expect(page.getByRole("checkbox", { name: "Open task" })).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Completed" })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Done task" })).toBeVisible();
});
