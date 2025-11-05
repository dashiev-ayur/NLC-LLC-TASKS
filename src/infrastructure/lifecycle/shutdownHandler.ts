import { closeDB } from "@infrastructure/database/connection";
import { closeRedis } from "@infrastructure/cache/connection";
import type { NotificationScheduler } from "@infrastructure/cache/NotificationScheduler";

export interface ShutdownDependencies {
  notificationScheduler: NotificationScheduler;
}

/**
 * Настраивает обработчики graceful shutdown для приложения
 * @param dependencies - зависимости для корректного завершения работы
 */
export function setupShutdownHandlers(
  dependencies: ShutdownDependencies
): void {
  const { notificationScheduler } = dependencies;

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} получен, завершение работы...`);
    notificationScheduler.stop();
    await closeRedis();
    await closeDB();
    process.exit(0);
  };

  // Обработка сигналов завершения
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  // Обработка необработанных ошибок
  process.on("uncaughtException", (error) => {
    console.error("Необработанное исключение:", error);
    void shutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error(
      "Необработанное отклонение:",
      promise,
      "причина:",
      reason
    );
    void shutdown("unhandledRejection");
  });
}

