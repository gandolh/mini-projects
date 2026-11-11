import { serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import type { Config } from "./config.js";
import { openDb } from "./db/open.js";
import { errors } from "./plugins/errors.js";
import { todoRoutes } from "./features/todos/index.js";

/** Fastify's options that belong to the process. server.ts sets them; a test leaves them out. */
type ServerOptions = Pick<FastifyServerOptions, "logger">;

export interface BuildAppOptions {
  server?: ServerOptions;
}

/** The app, ready and not listening. Closing it closes the database. */
export async function buildApp(config: Config, options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify(options.server);
  // Zod checks every request and encodes every reply, in every plugin registered below.
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const db = openDb(config.databasePath);
  app.addHook("onClose", async () => {
    db.close();
  });

  // The app's own plugins first, fastify-plugin wrapped so they reach every feature.
  await app.register(errors);

  // Then the features, each encapsulated.
  await app.register(todoRoutes, { db });

  return app;
}
