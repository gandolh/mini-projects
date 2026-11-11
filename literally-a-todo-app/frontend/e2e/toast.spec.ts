import { expect, test } from "@playwright/test";

test("a failed update shows its toast", async ({ page }) => {
  await page.route("**/api/todos", (route) =>
    route.fulfill({ json: [{ id: 1, title: "Buy milk", completed: 0, position: 0 }] }),
  );
  await page.route("**/api/todos/1", (route) => route.fulfill({ status: 500, json: { error: "down" } }));
  await page.goto("/");

  await page.getByRole("checkbox", { name: "Buy milk" }).click();

  await expect(page.getByRole("region", { name: "Notifications" }).getByText("Failed to update todo")).toBeVisible();
  // The tick is rolled back.
  await expect(page.getByRole("checkbox", { name: "Buy milk" })).not.toBeChecked();
});
