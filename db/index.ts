import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | undefined;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is unavailable. Set it to your Supabase Postgres connection string (Project Settings → Database → Connection string, transaction pooler recommended)."
    );
  }

  client ??= postgres(process.env.DATABASE_URL, { prepare: false });
  return drizzle(client, { schema });
}
