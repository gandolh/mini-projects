import { fileURLToPath } from "node:url";
import { z } from "zod";

/** The folder that holds `todos.db`: `src/` sits two levels below it, as `db.ts` did. */
const APP_ROOT = fileURLToPath(new URL("../../", import.meta.url));

/** The server's settings, parsed once at start. No other file reads the environment. */
export interface Config {
  /** `HOST`: the address to listen on. Loopback by default: the app sits behind no proxy. */
  host: string;
  /** `PORT`. The Vite dev server proxies to 3000. */
  port: number;
  /** `DATABASE_PATH`: the SQLite file. `:memory:` gives a database that goes with the process. */
  databasePath: string;
}

/** The environment can't run the server. The message names every variable at fault. */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

/** `KEY=` counts as unset, so the default applies rather than an empty string. */
function unset(value: unknown): unknown {
  return value === "" ? undefined : value;
}

const envSchema = z.object({
  HOST: z.preprocess(unset, z.string().default("127.0.0.1")),
  PORT: z.preprocess(unset, z.coerce.number<string>().int().min(1).max(65535).default(3000)),
  DATABASE_PATH: z.preprocess(unset, z.string().default(`${APP_ROOT}todos.db`)),
});

/** Parses the settings, or throws `ConfigError` naming every bad variable. A test passes its own `env`. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) throw new ConfigError(z.prettifyError(parsed.error));
  const { HOST, PORT, DATABASE_PATH } = parsed.data;
  return { host: HOST, port: PORT, databasePath: DATABASE_PATH };
}
