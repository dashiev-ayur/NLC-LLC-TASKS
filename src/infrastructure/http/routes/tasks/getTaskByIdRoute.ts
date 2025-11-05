import { Elysia, t } from "elysia";
import { TaskService } from "@application/services/TaskService";
import { TaskResponseSchema } from "@application/dtos/TaskResponseDto";
import { mapTaskToResponse } from "./helpers/taskResponseMapper";

export function getTaskByIdRoute(taskService: TaskService) {
  return new Elysia().get(
    "/:id",
    async ({ params }) => {
      const task = await taskService.getById(params.id);
      return mapTaskToResponse(task);
    },
    {
      params: t.Object({
        id: t.Integer(),
      }),
      response: TaskResponseSchema,
      detail: {
        tags: ["tasks"],
        summary: "Получить задачу по ID",
        description: "Возвращает информацию о задаче по её идентификатору",
      },
    }
  );
}
