import type { Page } from "@playwright/test";

export interface Row {
  id: number;
  title: string;
  completed: 0 | 1;
  position: number;
}

// The board's fixture: six tasks that repeat to 24, the third and fifth done. Frozen, so a shot never changes.
const BASE = [
  { title: "Plan the week's meals", completed: 0 },
  { title: "Water the plants", completed: 1 },
  { title: "Reply to the landlord", completed: 0 },
  { title: "Book a dentist appointment", completed: 0 },
  { title: "Fix the bike light", completed: 1 },
  { title: "Renew the library card", completed: 0 },
] as const;

export function fixtureRows(count = 24): Row[] {
  return Array.from({ length: count }, (_, position) => {
    const base = BASE[position % BASE.length];
    return { id: position + 1, title: base?.title ?? "", completed: base?.completed ?? 0, position };
  });
}

/** The API, mocked with `rows`: GET answers them, every write answers ok. No backend runs. */
export async function mockRows(page: Page, rows: Row[]): Promise<void> {
  await page.route("**/api/todos", (route) => route.fulfill({ json: rows }));
  await page.route("**/api/todos/**", (route) => route.fulfill({ json: { ok: true } }));
}
