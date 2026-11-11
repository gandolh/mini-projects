import { describe, expect, it } from "vitest";
import { dropIndex } from "./dropIndex";

describe("dropIndex", () => {
  it("moves by the nearest whole number of 36 px rows", () => {
    expect(dropIndex(0, 72, 3)).toBe(2);
    expect(dropIndex(2, -72, 3)).toBe(0);
    expect(dropIndex(1, 20, 3)).toBe(2);
    expect(dropIndex(1, 17, 3)).toBeNull();
  });

  it("is null when the drag moves no row", () => {
    expect(dropIndex(1, 0, 3)).toBeNull();
    expect(dropIndex(1, -10, 3)).toBeNull();
  });

  it("stays inside the list", () => {
    expect(dropIndex(0, 720, 3)).toBe(2);
    expect(dropIndex(2, -720, 3)).toBe(0);
    expect(dropIndex(2, 720, 3)).toBeNull();
    expect(dropIndex(0, -72, 3)).toBeNull();
  });
});
