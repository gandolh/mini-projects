import { serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import Fastify, { type FastifyInstance } from "fastify";
import { afterEach, describe, expect, it } from "vitest";
import { openDb, type Db } from "../../db/open.js";
import { errors } from "../../plugins/errors.js";
import { todoRoutes } from "./index.js";

/** The todo routes over a database the test holds, so it can break the rows under them. */
async function appOver(db: Db): Promise<FastifyInstance> {
  const app = Fastify();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(errors);
  await app.register(todoRoutes, { db });
  return app;
}

describe("what a reply can hold", () => {
  let app: FastifyInstance | undefined;
  afterEach(async () => {
    await app?.close();
  });

  it("strips a column the schema doesn't list", async () => {
    const db = openDb(":memory:");
    db.exec("ALTER TABLE todos ADD COLUMN secret TEXT DEFAULT 'hidden'");
    db.exec("INSERT INTO todos (title, completed, position) VALUES ('a', 0, 1)");
    app = await appOver(db);
    const res = await app.inject({ method: "GET", url: "/api/todos" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([{ id: 1, title: "a", completed: 0, position: 1 }]);
  });

  it("answers a reply that fails its schema with a 500 and no detail", async () => {
    const db = openDb(":memory:");
    db.exec("INSERT INTO todos (title, completed, position) VALUES ('a', 5, 1)");
    app = await appOver(db);
    const res = await app.inject({ method: "GET", url: "/api/todos" });
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ error: "internal error" });
  });

  it("never sends a thrown error's message to the client", async () => {
    const db = openDb(":memory:");
    app = await appOver(db);
    db.close();
    const res = await app.inject({ method: "GET", url: "/api/todos" });
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ error: "internal error" });
    expect(res.body).not.toMatch(/database/i);
  });
});
