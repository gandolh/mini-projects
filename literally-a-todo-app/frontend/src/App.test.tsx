import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";

vi.mock("./api/todos", () => ({
  getTodos: () => Promise.resolve([{ id: 1, title: "Buy milk", completed: 0, position: 0 }]),
  updateTodo: () => Promise.reject(new Error("offline")),
  createTodo: vi.fn(),
  deleteTodo: vi.fn(),
  reorderTodos: vi.fn(),
}));

describe("App", () => {
  it("shows a toast when ticking a task fails", async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
        <App />
      </QueryClientProvider>,
    );
    await user.click(await screen.findByRole("checkbox", { name: "Buy milk" }));
    const region = await screen.findByRole("region", { name: "Notifications" });
    expect(await within(region).findByText("Failed to update todo")).toBeTruthy();
  });
});
