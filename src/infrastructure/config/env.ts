import * as dotenv from "dotenv";
import { ConfigError } from "../errors/InfrastructureError";

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new ConfigError(`Переменная окружения ${key} не установлена`);
  }
  return value || defaultValue || "";
};

export const config = {
  database: {
    url: getEnv("DATABASE_URL"),
  },
  redis: {
    host: getEnv("REDIS_HOST", "localhost"),
    port: parseInt(getEnv("REDIS_PORT", "6379"), 10),
    password: getEnv("REDIS_PASSWORD", "") || undefined,
  },
  app: {
    port: parseInt(getEnv("PORT", "3000"), 10),
    nodeEnv: getEnv("NODE_ENV", "development"),
  },
};
