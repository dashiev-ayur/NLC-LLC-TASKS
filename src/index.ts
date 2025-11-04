import { Elysia } from "elysia";
import { config } from "./infrastructure/config/env";
import { closeDB, getDB } from "./infrastructure/database/connection";
import { closeRedis, getRedis } from "./infrastructure/cache/connection";
import { errorHandler } from "./infrastructure/http/middleware/error-handler";
import { tasksRoutes } from "./infrastructure/http/routes/tasksRoutes";
import { TaskService } from "./application/services/TaskService";
import { TaskRepository } from "./infrastructure/repositories/TaskRepository";
import { NotificationService } from "./infrastructure/cache/NotificationService";

async function bootstrap() {
  try {
    // PostgreSQL и Redis подключения
    getDB();
    getRedis();

    const notificationService = new NotificationService();
    console.log("Starting notification worker...");
    notificationService.start(5000);    
  
    // Elysia
    const taskRepository = new TaskRepository();
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
      notificationService.stop();
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
