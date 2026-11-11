import { hasZodFastifySchemaValidationErrors, ResponseSerializationError } from "@fastify/type-provider-zod";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

/** The status a thrown value carries, if it carries one (Fastify's own errors do). */
function statusOf(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("statusCode" in error)) return undefined;
  return typeof error.statusCode === "number" ? error.statusCode : undefined;
}

/**
 * The one error handler, and the 404 handler. Every reply is `{ "error": "<message>" }`.
 * Wrapped in fastify-plugin, so they are set on the root and every feature inherits them.
 *
 * - A request that fails its route schema answers 400 with the first issue's message.
 * - A 4xx that Fastify raised itself (bad JSON, a body too large) keeps its status and message.
 * - Anything else is a 500 with a fixed message, logged with the request. A thrown message
 *   never reaches the client.
 */
const errorHandling: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error: unknown, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({ error: error.validation[0]?.message ?? "invalid request" });
    }

    const status = statusOf(error);
    if (status !== undefined && status >= 400 && status < 500) {
      return reply.code(status).send({ error: error instanceof Error ? error.message : "invalid request" });
    }

    if (error instanceof ResponseSerializationError) {
      // A handler sent what its response schema doesn't allow: a bug to fix, never the client's fault.
      request.log.error(
        { err: error, issues: error.cause.issues },
        `${error.method} ${error.url}: the reply doesn't match its schema`,
      );
    } else {
      request.log.error({ err: error }, "unhandled error");
    }
    return reply.code(500).send({ error: "internal error" });
  });

  app.setNotFoundHandler((_request, reply) => reply.code(404).send({ error: "not found" }));
};

export const errors = fp(errorHandling, { name: "errors" });
