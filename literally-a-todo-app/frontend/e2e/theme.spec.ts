import { expect, test, type Page } from "@playwright/test";

const LIGHT_PAGE = "rgb(237, 240, 236)";
const DARK_PAGE = "rgb(19, 23, 18)";

async function mockApi(page: Page) {
  await page.route("**/api/todos", (route) =>
    route.fulfill({ json: [{ id: 1, title: "Buy milk", completed: 0, position: 0 }] }),
  );
}

test("a first visit is light, even when the system is dark", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await mockApi(page);
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("body")).toHaveCSS("background-color", LIGHT_PAGE);
  await expect(page.getByRole("radio", { name: "Light" })).toBeChecked();
});

test("Dark is applied at once and kept across a reload, before the app's script runs", async ({ page }) => {
  await mockApi(page);
  await page.goto("/");

  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", DARK_PAGE);

  // Without the app's module, only index.html's boot script can set the theme: the page is dark from the start.
  // The attribute is the boot script's whole job. Under the dev server the stylesheet arrives through main.tsx, so
  // with that module blocked there is no CSS to read a colour scheme from; the build links it from index.html.
  await page.route("**/src/main.tsx", (route) => route.abort());
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("System follows the operating system's setting, live", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await mockApi(page);
  await page.goto("/");

  await page.getByRole("radio", { name: "System" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  await expect(page.locator("body")).toHaveCSS("background-color", LIGHT_PAGE);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("body")).toHaveCSS("background-color", DARK_PAGE);
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("body")).toHaveCSS("background-color", LIGHT_PAGE);
});
