import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pgClient?: ReturnType<typeof postgres>;
};

function connectionString() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Set it in .env.local to use the real database, " +
        "or keep BSC_USE_MOCK_DATA=1 to run in mock mode.",
    );
  }
  return url;
}

function makeClient() {
  const url = connectionString();
  return postgres(url, {
    prepare: false,
    max: 10,
  });
}

export const pg =
  process.env.NODE_ENV === "production"
    ? makeClient()
    : (globalForDb.pgClient ??= makeClient());

export const db = drizzle(pg, { schema, logger: process.env.NODE_ENV !== "production" });
export * as tables from "./schema";
