import Database from "better-sqlite3";

/** The connection the stores are built on. */
export type Db = Database.Database;

/** Opens the SQLite file (or `:memory:`) and creates the table when it is missing. */
export function openDb(path: string): Db {
  const db = new Database(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      title     TEXT    NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      position  INTEGER NOT NULL
    )
  `);
  return db;
}
