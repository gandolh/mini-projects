import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast, Toaster } from "./Toast";

describe("Toast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows an error raised from outside React, in a live region", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Failed to update todo");
    });
    const region = await screen.findByRole("region", { name: "Notifications" });
    expect(region.getAttribute("aria-live")).toBe("polite");
    expect(await within(region).findByText("Failed to update todo")).toBeTruthy();
  });

  it("keeps an error past 5 s, until Dismiss closes it", async () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast.error("Failed to delete todo");
    });
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    vi.useRealTimers();
    const region = screen.getByRole("region", { name: "Notifications" });
    expect(within(region).getByText("Failed to delete todo")).toBeTruthy();

    // The toast and its button stay hidden from the accessibility tree until the region holds focus, which F6 gives it.
    const user = userEvent.setup();
    await user.keyboard("{F6}");
    await user.click(within(region).getByRole("button", { name: "Dismiss" }));
    await waitFor(() => {
      expect(within(region).queryByText("Failed to delete todo")).toBeNull();
    });
  });
});
