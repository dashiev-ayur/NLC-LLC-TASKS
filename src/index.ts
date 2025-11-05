import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { config } from "@infrastructure/config/env";
import { getDB } from "@infrastructure/database/connection";
import { getRedis } from "@infrastructure/cache/connection";
import { errorHandler } from "@infrastructure/http/middleware/errorHandler";
import { tasksRoutes } from "@infrastructure/http/routes/tasksRoutes";
import { TaskServiceFactory } from "@application/services/TaskServiceFactory";
import { TaskRepository } from "@infrastructure/repositories/TaskRepository";
import { NotificationService } from "@infrastructure/cache/NotificationService";
import { NotificationScheduler } from "@infrastructure/cache/NotificationScheduler";
import { NotificationQueue } from "@infrastructure/cache/NotificationQueue";
import { setupShutdownHandlers } from "@infrastructure/lifecycle/shutdownHandler";

function bootstrap() {
  try {
    // PostgreSQL и Redis подключения
    const db = getDB();
    const redis = getRedis();

    // Создаем зависимости с DI
    const notificationQueue = new NotificationQueue(redis);
    const notificationService = new NotificationService(notificationQueue);
    const notificationScheduler = new NotificationScheduler(
      notificationService
    );

    console.log("Starting notification worker...");
    notificationScheduler.start(5000);

    // TaskRepository
    const taskRepository = new TaskRepository(db);

    // TaskService
    const taskService = TaskServiceFactory.create(
      taskRepository,
      notificationService
    );

    // Elysia
    const app = new Elysia()
      .use(
        swagger({
          documentation: {
            info: {
              title: "Task Management Service API",
              version: "1.0.0",
              description: "API для управления задачами",
            },
            tags: [
              {
                name: "tasks",
                description: "Операции с задачами",
              },
            ],
          },
        })
      )
      .onError(errorHandler)
      .get("/", () => ({ message: "Привет медвед !" }))
      .use(tasksRoutes(taskService))
      .listen(config.app.port);

    console.log(
      `Сервер запущен на ${app.server?.hostname}:${app.server?.port}`
    );

    // Настройка graceful shutdown
    setupShutdownHandlers({
      notificationScheduler,
    });
  } catch (error) {
    console.error("Ошибка при запуске приложения:", error);
    process.exit(1);
  }
}

bootstrap();
