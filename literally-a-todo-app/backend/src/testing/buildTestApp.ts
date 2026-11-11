import type { FastifyInstance } from "fastify";
import { buildApp } from "../app.js";
import { loadConfig } from "../config.js";

/**
 * The whole app for one test, on an in-memory database, never listening.
 * Close it after the test: that closes the database.
 *
 *     const app = await buildTestApp();
 *     const res = await app.inject({ method: "GET", url: "/api/todos" });
 *     await app.close();
 */
export async function buildTestApp(): Promise<FastifyInstance> {
  return buildApp(loadConfig({ DATABASE_PATH: ":memory:" }));
}
