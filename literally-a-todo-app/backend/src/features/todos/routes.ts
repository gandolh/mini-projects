import type { FastifyPluginAsync } from "fastify";
import { createTodoStore, type TodoStore } from "./store.js";
import type { Db } from "../../db/open.js";

/** What this feature takes from the app: the database handle. */
export interface TodoContext {
  db: Db;
}

export const todoRoutes: FastifyPluginAsync<TodoContext> = async (app, { db }) => {
  const todos: TodoStore = createTodoStore(db);

  // GET /api/todos
  app.get("/api/todos", async () => {
    return todos.list();
  });

  // POST /api/todos
  app.post<{ Body: { title?: string } }>("/api/todos", async (req, reply) => {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return reply.status(400).send({ error: "title is required" });
    }
    return reply.status(201).send(todos.create(title.trim()));
  });

  // PATCH /api/todos/reorder — must be before /:id
  app.patch<{ Body: { ids?: number[] } }>("/api/todos/reorder", async (req, reply) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return reply.status(400).send({ error: "ids must be a non-empty array" });
    }
    todos.reorder(ids);
    return { ok: true };
  });

  // PATCH /api/todos/:id
  app.patch<{ Params: { id: string }; Body: { title?: string; completed?: boolean } }>(
    "/api/todos/:id",
    async (req, reply) => {
      const id = Number(req.params.id);
      const todo = todos.get(id);
      if (!todo) return reply.status(404).send({ error: "not found" });

      const title = req.body.title !== undefined ? req.body.title.trim() : todo.title;
      const completed = req.body.completed !== undefined ? (req.body.completed ? 1 : 0) : todo.completed;

      if (title === "") return reply.status(400).send({ error: "title cannot be empty" });

      return todos.update(id, title, completed);
    },
  );

  // DELETE /api/todos/:id
  app.delete<{ Params: { id: string } }>("/api/todos/:id", async (req, reply) => {
    if (!todos.remove(Number(req.params.id))) return reply.status(404).send({ error: "not found" });
    return reply.status(204).send();
  });
};
