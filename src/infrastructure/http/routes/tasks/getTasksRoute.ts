import { Elysia, t } from "elysia";
import { TaskService } from "@application/services/TaskService";
import type { TaskFilters } from "@domain/repositories/ITaskRepository";
import { TaskListResponseSchema } from "@application/dtos/TaskResponseDto";
import { mapTasksToResponse } from "./helpers/taskResponseMapper";

export function getTasksRoute(taskService: TaskService) {
  return new Elysia().get(
    "/",
    async ({ query }) => {
      const tasks = await taskService.getListByFilters(
        query as unknown as TaskFilters
      );
      return mapTasksToResponse(tasks);
    },
    {
      query: t.Object({
        status: t.Optional(
          t.Union([t.Literal("pending"), t.Literal("completed")])
        ),
      }),
      response: TaskListResponseSchema,
      detail: {
        tags: ["tasks"],
        summary: "Получить список задач",
        description: "Возвращает список всех задач с возможностью фильтрации по статусу",
      },
    }
  );
}
