import type { Db } from "../../db/open.js";

/** A stored task, as the API sends it. */
interface Todo {
  id: number;
  title: string;
  completed: number;
  position: number;
}

/** The todos table. Every query on it lives here; a route never writes SQL. */
export interface TodoStore {
  /** Every task, by position. */
  list(): Todo[];
  get(id: number): Todo | undefined;
  /** Adds a task at the end (position `MAX(position) + 1`, 1-based). */
  create(title: string): Todo;
  /** Writes the title and the completed flag, and returns the stored row. */
  update(id: number, title: string, completed: number): Todo | undefined;
  /** Replaces the whole order: the id at index `i` gets position `i + 1`, in one transaction. */
  reorder(ids: number[]): void;
  /** Whether there was such a task to remove. */
  remove(id: number): boolean;
}

export function createTodoStore(db: Db): TodoStore {
  const list = db.prepare("SELECT * FROM todos ORDER BY position ASC");
  const get = db.prepare("SELECT * FROM todos WHERE id = ?");
  const maxPosition = db.prepare("SELECT MAX(position) as maxPos FROM todos");
  const insert = db.prepare("INSERT INTO todos (title, completed, position) VALUES (?, 0, ?)");
  const update = db.prepare("UPDATE todos SET title = ?, completed = ? WHERE id = ?");
  const setPosition = db.prepare("UPDATE todos SET position = ? WHERE id = ?");
  const remove = db.prepare("DELETE FROM todos WHERE id = ?");
  const reorder = db.transaction((ids: number[]) => {
    ids.forEach((id, index) => setPosition.run(index + 1, id));
  });

  const getRow = (id: number | bigint) => get.get(id) as Todo | undefined;

  return {
    list: () => list.all() as Todo[],
    get: (id) => getRow(id),
    create(title) {
      const { maxPos } = maxPosition.get() as { maxPos: number | null };
      const result = insert.run(title, (maxPos ?? 0) + 1);
      const row = getRow(result.lastInsertRowid);
      if (row === undefined) throw new Error("INSERT gave no row");
      return row;
    },
    update(id, title, completed) {
      update.run(title, completed, id);
      return getRow(id);
    },
    reorder: (ids) => reorder(ids),
    remove: (id) => remove.run(id).changes > 0,
  };
}
