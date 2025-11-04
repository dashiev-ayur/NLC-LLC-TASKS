import { Elysia } from "elysia";
import { config } from "./infrastructure/config/env";
import { closeDB, getDB } from "./infrastructure/database/connection";
import { closeRedis, getRedis } from "./infrastructure/cache/connection";
import { errorHandler } from "./infrastructure/http/middleware/error-handler";
import { tasksRoutes } from "./infrastructure/http/routes/tasksRoutes";
import { TaskService } from "./application/services/TaskService";
import { TaskRepository } from "./infrastructure/repositories/TaskRepository";
import { NotificationService } from "./infrastructure/cache/NotificationService";
import { NotificationSheduler } from "./infrastructure/cache/NotificationSheduler";
import { NotificationQueue } from "./infrastructure/cache/NotificationQueue";

async function bootstrap() {
  try {
    // PostgreSQL и Redis подключения
    const db = getDB();
    const redis = getRedis();

    // Создаем зависимости с DI
    const notificationQueue = new NotificationQueue(redis);
    const notificationService = new NotificationService(notificationQueue);
    const notificationSheduler = new NotificationSheduler(notificationQueue);

    console.log("Starting notification worker...");
    notificationSheduler.start(5000);    
    
    // Elysia
    const taskRepository = new TaskRepository(db);
    const taskService = new TaskService(taskRepository, notificationService);
    const app = new Elysia()
      .get("/", () => ({ message: "Привет медвед !" }))
      .use(tasksRoutes(taskService))
      .onError(errorHandler)
      .listen(config.app.port);

    console.log(
      `Сервер запущен на ${app.server?.hostname}:${app.server?.port}`
    );

    // Обработка сигналов завершения
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} получен, завершение работы...`);
      notificationSheduler.stop();
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
