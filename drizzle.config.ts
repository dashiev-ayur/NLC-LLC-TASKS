import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import { config } from "./src/infrastructure/config/env";

dotenv.config();

export default {
  schema: "./src/infrastructure/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: config.database.url,
  },
} satisfies Config;
