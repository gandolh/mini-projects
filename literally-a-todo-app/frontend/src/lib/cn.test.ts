import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("keeps a size and a colour, which the app names itself", () => {
    expect(cn("text-primary", "text-body")).toBe("text-primary text-body");
    expect(cn("text-tick", "text-surface-lowest")).toBe("text-tick text-surface-lowest");
    expect(cn("font-icon", "font-normal")).toBe("font-icon font-normal");
  });

  it("keeps a line height when a size follows it, as the sizes carry none", () => {
    expect(cn("text-icon leading-none", "text-tick")).toBe("leading-none text-tick");
  });

  it("lets the later of two sizes, colours, z values or paddings win", () => {
    expect(cn("text-icon", "text-tick")).toBe("text-tick");
    expect(cn("text-muted", "text-primary")).toBe("text-primary");
    expect(cn("z-sticky", "z-toast")).toBe("z-toast");
    expect(cn("px-2", "p-0")).toBe("p-0");
  });

  it("drops what is false", () => {
    const completed = false;
    expect(cn("h-9", completed && "opacity-50")).toBe("h-9");
  });
});
