import Redis from "ioredis";
import { config } from "../config/env";

let redisClient: Redis | null = null;

export function getRedis(): Redis {
  if (redisClient) return redisClient;

  redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,

    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },

    reconnectOnError: (err: Error) => {
      const targetError = "READONLY";
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
  });

  redisClient.on("error", (err: Error) => {
    console.error("Ошибка Redis:", err);
  });

  redisClient.on("connect", () => {
    console.log("Redis подключен");
  });

  redisClient.on("ready", () => {
    console.log("Redis готов");
  });

  return redisClient;
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
