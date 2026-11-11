import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("is named by its label and shows its state", () => {
    const { rerender } = render(<Checkbox checked={false} onChange={() => {}} label="Buy milk" />);
    expect(screen.getByRole("checkbox", { name: "Buy milk" }).getAttribute("aria-checked")).toBe("false");
    rerender(<Checkbox checked onChange={() => {}} label="Buy milk" />);
    expect(screen.getByRole("checkbox", { name: "Buy milk" }).getAttribute("aria-checked")).toBe("true");
  });

  it("calls onChange when clicked", () => {
    let calls = 0;
    render(
      <Checkbox
        checked={false}
        onChange={() => {
          calls += 1;
        }}
        label="Buy milk"
      />,
    );
    screen.getByRole("checkbox", { name: "Buy milk" }).click();
    expect(calls).toBe(1);
  });

  it("keeps the ligature word out of every accessible name", () => {
    render(<Checkbox checked onChange={() => {}} label="Buy milk" />);
    expect(screen.queryByRole("checkbox", { name: "check" })).toBeNull();
    expect(screen.getByText("check").getAttribute("aria-hidden")).toBe("true");
  });
});
