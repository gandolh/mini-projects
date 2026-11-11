import { act, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { toast, Toaster } from "./Toast";

describe("Toast", () => {
  it("shows an error raised from outside React, in a live region", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Failed to update todo");
    });
    const region = await screen.findByRole("region", { name: "Notifications" });
    expect(region.getAttribute("aria-live")).toBe("polite");
    expect(await within(region).findByText("Failed to update todo")).toBeTruthy();
  });
});
