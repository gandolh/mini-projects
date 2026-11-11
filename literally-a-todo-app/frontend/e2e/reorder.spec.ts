import { expect, test, type Page } from "@playwright/test";

interface Row {
  id: number;
  title: string;
  completed: 0 | 1;
  position: number;
}

// The API is mocked: `todos` is the server's list, and the reorder reply waits for `release()`, so a
// test can look at the page while the server has not answered yet.
async function mockApi(page: Page) {
  let todos: Row[] = ["First", "Second", "Third"].map((title, position) => ({
    id: position + 1,
    title,
    completed: 0,
    position,
  }));
  const reorders: number[][] = [];
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  await page.route("**/api/todos", (route) => route.fulfill({ json: todos }));
  await page.route("**/api/todos/reorder", async (route) => {
    const { ids } = route.request().postDataJSON() as { ids: number[] };
    reorders.push(ids);
    await gate;
    todos = ids.flatMap((id, position) => {
      const todo = todos.find((t) => t.id === id);
      return todo ? [{ ...todo, position }] : [];
    });
    await route.fulfill({ json: { ok: true } });
  });
  return { reorders, release };
}

function titles(page: Page) {
  return page
    .locator(".todo-row")
    .evaluateAll((rows) => rows.map((row) => row.querySelector("[style*='ellipsis']")?.textContent));
}

function row(page: Page, title: string) {
  return page.locator(".todo-row").filter({ hasText: title });
}

test("Move down puts the row after its neighbour at once and sends the new order", async ({ page }) => {
  const api = await mockApi(page);
  await page.goto("/");
  await expect.poll(() => titles(page)).toEqual(["First", "Second", "Third"]);

  await row(page, "First").getByTitle("Move down").click();

  // The list changes before the server has answered.
  await expect.poll(() => titles(page)).toEqual(["Second", "First", "Third"]);
  await expect.poll(() => api.reorders).toEqual([[2, 1, 3]]);
  api.release();
  await expect.poll(() => titles(page)).toEqual(["Second", "First", "Third"]);
});

test("Move up puts the row before its neighbour at once and sends the new order", async ({ page }) => {
  const api = await mockApi(page);
  await page.goto("/");
  await expect.poll(() => titles(page)).toEqual(["First", "Second", "Third"]);

  await row(page, "Third").getByTitle("Move up").click();

  await expect.poll(() => titles(page)).toEqual(["First", "Third", "Second"]);
  await expect.poll(() => api.reorders).toEqual([[1, 3, 2]]);
  api.release();
  await expect.poll(() => titles(page)).toEqual(["First", "Third", "Second"]);
});
