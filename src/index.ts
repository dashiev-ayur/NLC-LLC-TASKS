import { Elysia } from "elysia";
import { config } from "./infrastructure/config/env";
import { closeDB, getDB } from "./infrastructure/database/connection";
import { closeRedis, getRedis } from "./infrastructure/cache/connection";

async function bootstrap() {
  try {
    getDB();
    getRedis();

    const app = new Elysia()
      .get("/", () => ({ message: "Привет медвед !" }))
      .listen(config.app.port);

    console.log(`Сервер запущен на ${app.server?.hostname}:${app.server?.port}`);

    // Обработка сигналов завершения
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} получен, завершение работы...`);
      await closeRedis();
      await closeDB();
      process.exit(0);
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("uncaughtException", (error) => {
      console.error("Необработанное исключение:", error);
      shutdown("uncaughtException");
    });
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Необработанное отклонение:", promise, "причина:", reason);
      shutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("Ошибка при запуске приложения:", error);
    process.exit(1);
  }
}

bootstrap();
