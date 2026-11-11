import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { RadioGroup } from "./RadioGroup";

const OPTIONS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
] as const;

function Harness({ look }: { look?: "list" | "segmented" }) {
  const [value, setValue] = useState<"all" | "active" | "completed">("all");
  return (
    <>
      <RadioGroup label="Show" look={look} options={OPTIONS} value={value} onValueChange={setValue} />
      <output>{value}</output>
    </>
  );
}

describe.each(["list", "segmented"] as const)("RadioGroup, %s look", (look) => {
  it("is one named radiogroup of three radios with one checked", () => {
    render(<Harness look={look} />);
    const group = screen.getByRole("radiogroup", { name: "Show" });
    expect(group).toBeTruthy();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios.filter((r) => r.getAttribute("aria-checked") === "true")).toHaveLength(1);
    expect(screen.getByRole("radio", { name: "All" }).getAttribute("aria-checked")).toBe("true");
  });

  it("moves and chooses with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Harness look={look} />);
    await user.tab();
    expect(screen.getByRole("radio", { name: "All" })).toBe(document.activeElement);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Active" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("status").textContent).toBe("active");
  });
});
