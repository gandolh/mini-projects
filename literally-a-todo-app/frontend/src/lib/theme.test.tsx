import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The store reads the saved choice when its module loads, so each test loads it fresh, as a page load would.
async function load() {
  vi.resetModules();
  const { ThemeSwitch } = await import("../components/ThemeSwitch");
  return { ThemeSwitch };
}

function checked(name: string) {
  return screen.getByRole("radio", { name }).getAttribute("aria-checked") === "true";
}

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is light on a first visit, with nothing stored", async () => {
    const { ThemeSwitch } = await load();
    render(<ThemeSwitch />);
    expect(screen.getByRole("radiogroup", { name: "Theme" })).toBeTruthy();
    expect(checked("Light")).toBe(true);
  });

  it("choosing Dark sets the attribute on <html> and keeps the choice on the device", async () => {
    const { ThemeSwitch } = await load();
    const user = userEvent.setup();
    render(<ThemeSwitch />);
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(checked("Dark")).toBe(true);
  });

  it("choosing System puts system on the attribute, for CSS to follow the operating system", async () => {
    const { ThemeSwitch } = await load();
    const user = userEvent.setup();
    render(<ThemeSwitch />);
    await user.click(screen.getByRole("radio", { name: "System" }));
    expect(document.documentElement.dataset.theme).toBe("system");
    expect(localStorage.getItem("theme")).toBe("system");
  });

  it("reads a stored choice when the page loads", async () => {
    localStorage.setItem("theme", "dark");
    const { ThemeSwitch } = await load();
    render(<ThemeSwitch />);
    expect(checked("Dark")).toBe(true);
  });

  it("is light, and still switches, when storage throws", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { ThemeSwitch } = await load();
    const user = userEvent.setup();
    render(<ThemeSwitch />);
    expect(checked("Light")).toBe(true);
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
