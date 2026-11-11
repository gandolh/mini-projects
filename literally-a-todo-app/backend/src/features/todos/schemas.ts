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
