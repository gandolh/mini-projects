import { z } from "zod";

// The schemas live in the backend: the frontend keeps its own hand-written `types.ts` (there is no shared/).
// A response schema holds no .transform(): the zod type provider encodes replies with it.

/** A task as the API sends it. The columns of the `todos` table, in the order the handlers build them. */
export const todoSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  /** 0 or 1: a stored flag, not a boolean. */
  completed: z.union([z.literal(0), z.literal(1)]),
  position: z.number().int(),
});
export type Todo = z.infer<typeof todoSchema>;

/** The body of every 4xx reply the app sends, from the handlers and from the error plugin alike. */
export const errorSchema = z.object({ error: z.string() });

const TITLE_REQUIRED = "title is required";

/** `POST /api/todos`. A missing body, a missing or non-string title and a blank one share one message. */
export const createTodoBody = z.object(
  { title: z.string({ error: TITLE_REQUIRED }).trim().min(1, TITLE_REQUIRED) },
  { error: TITLE_REQUIRED },
);
