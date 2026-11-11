import { describe, expect, it } from "vitest";
import { ConfigError, loadConfig } from "./config.js";

describe("loadConfig", () => {
  it("fills the defaults, and treats an empty value as unset", () => {
    const config = loadConfig({ PORT: "", HOST: "" });
    expect(config.host).toBe("127.0.0.1");
    expect(config.port).toBe(3000);
    expect(config.databasePath).toMatch(/\/todos\.db$/);
  });

  it("takes the three settings from the environment", () => {
    expect(loadConfig({ HOST: "0.0.0.0", PORT: "4000", DATABASE_PATH: ":memory:" })).toEqual({
      host: "0.0.0.0",
      port: 4000,
      databasePath: ":memory:",
    });
  });

  it("throws, naming the bad variable", () => {
    expect(() => loadConfig({ PORT: "abc" })).toThrow(ConfigError);
    expect(() => loadConfig({ PORT: "70000" })).toThrow(/PORT/);
  });
});
