import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("passes aria-label, data attributes and ref on to the DOM", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} aria-label="Move up" data-x="1">
        up
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Move up" });
    expect(button.getAttribute("data-x")).toBe("1");
    expect(ref.current).toBe(button);
  });

  it("passes pointer handlers on", () => {
    let down = 0;
    render(
      <Button
        onPointerDown={() => {
          down += 1;
        }}
      >
        drag
      </Button>,
    );
    screen.getByRole("button", { name: "drag" }).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    expect(down).toBe(1);
  });
});
