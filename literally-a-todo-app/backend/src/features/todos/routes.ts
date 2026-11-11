import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { z } from "zod";
import { createTodoBody, errorSchema, idParams, okSchema, reorderBody, todoSchema, updateTodoBody } from "./schemas.js";
import { createTodoStore, type TodoStore } from "./store.js";
import type { Db } from "../../db/open.js";

/** What this feature takes from the app: the database handle. */
export interface TodoContext {
  db: Db;
}

export const todoRoutes: FastifyPluginAsyncZod<TodoContext> = async (app, { db }) => {
  const todos: TodoStore = createTodoStore(db);

  // GET /api/todos
  app.get("/api/todos", { schema: { response: { 200: z.array(todoSchema) } } }, async () => {
    return todos.list();
  });

  // POST /api/todos
  app.post(
    "/api/todos",
    { schema: { body: createTodoBody, response: { 201: todoSchema, 400: errorSchema } } },
    async (req, reply) => {
      return reply.status(201).send(todos.create(req.body.title));
    },
  );

  // PATCH /api/todos/reorder — must be before /:id
  app.patch(
    "/api/todos/reorder",
    { schema: { body: reorderBody, response: { 200: okSchema, 400: errorSchema } } },
    async (req) => {
      todos.reorder(req.body.ids);
      return { ok: true as const };
    },
  );

  // PATCH /api/todos/:id
  app.patch(
    "/api/todos/:id",
    {
      schema: {
        params: idParams,
        body: updateTodoBody,
        response: { 200: todoSchema, 400: errorSchema, 404: errorSchema },
      },
    },
    async (req, reply) => {
      const id = Number(req.params.id);
      const todo = todos.get(id);
      if (!todo) return reply.status(404).send({ error: "not found" });

      const title = req.body?.title ?? todo.title;
      const completed = req.body?.completed !== undefined ? (req.body.completed ? 1 : 0) : todo.completed;

      if (title === "") return reply.status(400).send({ error: "title cannot be empty" });

      const updated = todos.update(id, title, completed);
      if (!updated) return reply.status(404).send({ error: "not found" });
      return updated;
    },
  );

  // DELETE /api/todos/:id
  app.delete(
    "/api/todos/:id",
    { schema: { params: idParams, response: { 204: z.null(), 404: errorSchema } } },
    async (req, reply) => {
      if (!todos.remove(Number(req.params.id))) return reply.status(404).send({ error: "not found" });
      return reply.status(204).send(null);
    },
  );
};
