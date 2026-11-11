import { expect, test } from "@playwright/test";

test("a failed update shows its toast, which stays until it is dismissed", async ({ page }) => {
  await page.clock.install();
  await page.route("**/api/todos", (route) =>
    route.fulfill({ json: [{ id: 1, title: "Buy milk", completed: 0, position: 0 }] }),
  );
  await page.route("**/api/todos/1", (route) => route.fulfill({ status: 500, json: { error: "down" } }));
  await page.goto("/");

  await page.getByRole("checkbox", { name: "Buy milk" }).click();

  const region = page.getByRole("region", { name: "Notifications" });
  await expect(region.getByText("Failed to update todo")).toBeVisible();
  // The tick is rolled back.
  await expect(page.getByRole("checkbox", { name: "Buy milk" })).not.toBeChecked();

  // An error has no timeout: well past the old 5 s it is still there.
  await page.clock.runFor(10_000);
  await expect(region.getByText("Failed to update todo")).toBeVisible();

  // F6 moves focus into the toast region, which shows the button to the accessibility tree.
  await page.keyboard.press("F6");
  await region.getByRole("button", { name: "Dismiss" }).click();
  await expect(region.getByText("Failed to update todo")).toHaveCount(0);
});
