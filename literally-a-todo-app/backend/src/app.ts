import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import type { Config } from "./config.js";
import { openDb } from "./db/open.js";
import { todoRoutes } from "./features/todos/routes.js";

/** Fastify's options that belong to the process. server.ts sets them; a test leaves them out. */
export type ServerOptions = Pick<FastifyServerOptions, "logger">;

export interface BuildAppOptions {
  server?: ServerOptions;
}

/** The app, ready and not listening. Closing it closes the database. */
export async function buildApp(config: Config, options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify(options.server);

  const db = openDb(config.databasePath);
  app.addHook("onClose", async () => {
    db.close();
  });

  await app.register(todoRoutes, { db });

  return app;
}
