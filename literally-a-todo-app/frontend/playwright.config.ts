import { defineConfig } from "@playwright/test";

// One flow spec against the Vite dev server. The API is mocked in the spec, so no backend runs.
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://127.0.0.1:5173" },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
  },
});
