import closeWithGrace from "close-with-grace";
import { buildApp } from "./app.js";
import { loadConfig } from "./config.js";

// The process: settings, the app, shutdown, listen. Nothing else in the server listens.
const config = loadConfig();
const app = await buildApp(config, { server: { logger: true } });

// SIGINT, SIGTERM, an uncaught error: stop taking requests, run the onClose hook (the database
// closes there) and exit. After 10 s it exits anyway.
closeWithGrace({ delay: 10_000, logger: app.log }, async ({ signal, err }) => {
  if (err) app.log.error({ err }, "closing after an uncaught error");
  else app.log.info(`closing on ${signal ?? "request"}`);
  await app.close();
});

await app.listen({ host: config.host, port: config.port });
