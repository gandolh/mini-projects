import { devices, expect, test, type Page } from "@playwright/test";

interface Row {
  id: number;
  title: string;
  completed: 0 | 1;
  position: number;
}

// A stateful mock of the API: the reorder call rewrites `todos`, and the next GET returns the new order.
async function mockApi(page: Page) {
  let todos: Row[] = ["First", "Second", "Third"].map((title, position) => ({
    id: position + 1,
    title,
    completed: 0,
    position,
  }));
  await page.route("**/api/todos", (route) => route.fulfill({ json: todos }));
  await page.route("**/api/todos/reorder", async (route) => {
    const { ids } = route.request().postDataJSON() as { ids: number[] };
    todos = ids.flatMap((id, position) => {
      const todo = todos.find((t) => t.id === id);
      return todo ? [{ ...todo, position }] : [];
    });
    await route.fulfill({ json: { ok: true } });
  });
  // What the server would return now.
  return () => todos.map((t) => t.title);
}

// The icon font is blocked, as it is offline, so each glyph falls back to its ligature word. The glyph's box clips the
// word (components/Icon.tsx), so a click at a handle's centre still hits that handle.
async function blockIconFont(page: Page) {
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
}

// A row has no role of its own: it is the parent of the task's checkbox.
function handleOf(page: Page, title: string) {
  return page
    .getByRole("checkbox", { name: title, exact: true })
    .locator("..")
    .getByRole("button", { name: "Drag to reorder" });
}

// Two rows down: the handle moves 72 px, which is two 36 px rows.
const DRAG_PX = 72;

test("a mouse drag of the first task by two rows puts it third", async ({ page }) => {
  const serverOrder = await mockApi(page);
  await blockIconFont(page);
  await page.goto("/");
  // The row's actions show while the pointer is over the row.
  await page.getByRole("checkbox", { name: "First" }).hover();
  const box = await handleOf(page, "First").boundingBox();
  if (!box) throw new Error("the drag handle has no box");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + DRAG_PX, { steps: 12 });
  await page.mouse.up();

  await expect.poll(serverOrder).toEqual(["Second", "Third", "First"]);
});

test("a touch drag of the first task by two rows puts it third", async ({ browser, baseURL }) => {
  // An Android phone profile: touch events, and a 412 px screen.
  const context = await browser.newContext({ ...devices["Pixel 7"], baseURL });
  const page = await context.newPage();
  const serverOrder = await mockApi(page);
  await blockIconFont(page);
  await page.goto("/");
  const box = await handleOf(page, "First").boundingBox();
  if (!box) throw new Error("the drag handle has no box");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  // Playwright has no touch drag, so the touch points go through the DevTools protocol.
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let step = 1; step <= 12; step++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y + (DRAG_PX * step) / 12 }],
    });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });

  await expect.poll(serverOrder).toEqual(["Second", "Third", "First"]);
  await context.close();
});
