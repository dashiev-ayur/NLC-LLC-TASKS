import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { tasks } from "./schema";
import { config } from "../config/env";
import { ConfigError } from "../errors/InfrastructureError";

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export function getDB() {
  if (db) return db;
  if (!config.database.url) throw new ConfigError("DATABASE_URL не установлена в .env файле");

  pool = new Pool({
    connectionString: config.database.url,
  });

  db = drizzle(pool, { schema: { tasks } });

  return db;
}

export async function closeDB() {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
  }
}
