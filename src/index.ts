import { Elysia } from "elysia";
import { config } from "./infrastructure/config/env";

async function bootstrap() {
  try {
    const app = new Elysia()
      .get("/", () => ({ message: "Привет медвед !" }))
      .listen(config.app.port);

    console.log(`Сервер запущен на ${app.server?.hostname}:${app.server?.port}`);

  } catch (error) {
    console.error("Ошибка при запуске приложения:", error);
    process.exit(1);
  }
}

bootstrap();
