import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildTestApp } from "../../testing/buildTestApp.js";

interface Row {
  id: number;
  title: string;
  completed: number;
  position: number;
}

describe("the todo routes", () => {
  let app: FastifyInstance;
  beforeEach(async () => {
    app = await buildTestApp();
  });
  afterEach(async () => {
    await app.close();
  });

  async function add(title: string): Promise<Row> {
    const res = await app.inject({ method: "POST", url: "/api/todos", payload: { title } });
    return res.json<Row>();
  }

  it("lists nothing, then the rows by position", async () => {
    expect((await app.inject({ method: "GET", url: "/api/todos" })).json()).toEqual([]);
    await add("one");
    await add("two");
    const rows = (await app.inject({ method: "GET", url: "/api/todos" })).json<Row[]>();
    expect(rows.map((row) => [row.title, row.position])).toEqual([
      ["one", 1],
      ["two", 2],
    ]);
  });

  it("adds a task with its title trimmed", async () => {
    const res = await app.inject({ method: "POST", url: "/api/todos", payload: { title: " a " } });
    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({ id: 1, title: "a", completed: 0, position: 1 });
  });

  it("refuses a task with no title", async () => {
    const res = await app.inject({ method: "POST", url: "/api/todos", payload: {} });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: "title is required" });
  });

  it("ticks a task with 1 and with true", async () => {
    await add("a");
    await add("b");
    const one = await app.inject({ method: "PATCH", url: "/api/todos/1", payload: { completed: 1 } });
    expect(one.statusCode).toBe(200);
    expect(one.json<Row>().completed).toBe(1);
    const yes = await app.inject({ method: "PATCH", url: "/api/todos/2", payload: { completed: true } });
    expect(yes.statusCode).toBe(200);
    expect(yes.json<Row>().completed).toBe(1);
  });

  it("refuses a blank title on a rename", async () => {
    await add("a");
    const res = await app.inject({ method: "PATCH", url: "/api/todos/1", payload: { title: "  " } });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: "title cannot be empty" });
  });

  it("answers 404 for a task that is not there", async () => {
    const patch = await app.inject({ method: "PATCH", url: "/api/todos/abc", payload: {} });
    expect(patch.statusCode).toBe(404);
    expect(patch.json()).toEqual({ error: "not found" });
    const del = await app.inject({ method: "DELETE", url: "/api/todos/99" });
    expect(del.statusCode).toBe(404);
    expect(del.json()).toEqual({ error: "not found" });
  });

  it("refuses an empty reorder", async () => {
    const res = await app.inject({ method: "PATCH", url: "/api/todos/reorder", payload: { ids: [] } });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: "ids must be a non-empty array" });
  });

  it("reorders by the full list of ids", async () => {
    await add("a");
    await add("b");
    const res = await app.inject({ method: "PATCH", url: "/api/todos/reorder", payload: { ids: [2, 1] } });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
    const rows = (await app.inject({ method: "GET", url: "/api/todos" })).json<Row[]>();
    expect(rows.map((row) => row.id)).toEqual([2, 1]);
  });

  it("deletes a task", async () => {
    await add("a");
    const res = await app.inject({ method: "DELETE", url: "/api/todos/1" });
    expect(res.statusCode).toBe(204);
    expect((await app.inject({ method: "GET", url: "/api/todos" })).json()).toEqual([]);
  });

  it("answers an unknown URL with the app's own 404 body", async () => {
    const res = await app.inject({ method: "GET", url: "/api/nothing" });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: "not found" });
  });

  it("keeps Fastify's own 400 status and message for a body that isn't JSON", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/todos",
      headers: { "content-type": "application/json" },
      payload: "{{{",
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: "Body is not valid JSON but content-type is set to 'application/json'" });
  });

  it("answers 400, not 500, for a title that is not a string, and for no body at all", async () => {
    const number = await app.inject({ method: "POST", url: "/api/todos", payload: { title: 5 } });
    expect(number.statusCode).toBe(400);
    expect(number.json()).toEqual({ error: "title is required" });
    const none = await app.inject({ method: "POST", url: "/api/todos" });
    expect(none.statusCode).toBe(400);
    expect(none.json()).toEqual({ error: "title is required" });
  });

  it("refuses a reorder whose ids are not integers, and one with no body", async () => {
    const text = await app.inject({ method: "PATCH", url: "/api/todos/reorder", payload: { ids: ["x"] } });
    expect(text.statusCode).toBe(400);
    expect(text.json()).toEqual({ error: "ids must be a non-empty array of integers" });
    const none = await app.inject({ method: "PATCH", url: "/api/todos/reorder" });
    expect(none.statusCode).toBe(400);
    expect(none.json()).toEqual({ error: "ids must be a non-empty array" });
  });

  it("leaves a task as it is when a PATCH has no body", async () => {
    await add("a");
    const res = await app.inject({ method: "PATCH", url: "/api/todos/1" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ id: 1, title: "a", completed: 0, position: 1 });
  });

  it("refuses a PATCH whose title or completed has the wrong type", async () => {
    await add("a");
    const title = await app.inject({ method: "PATCH", url: "/api/todos/1", payload: { title: 5 } });
    expect(title.statusCode).toBe(400);
    expect(title.json()).toEqual({ error: "title must be a string" });
    const done = await app.inject({ method: "PATCH", url: "/api/todos/1", payload: { completed: "yes" } });
    expect(done.statusCode).toBe(400);
    expect(done.json()).toEqual({ error: "completed must be a boolean, 0 or 1" });
  });
});
