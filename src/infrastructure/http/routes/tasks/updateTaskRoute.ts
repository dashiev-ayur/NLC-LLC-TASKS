import { Elysia, t } from "elysia";
import { TaskService } from "@application/services/TaskService";
import { UpdateTaskDtoSchema } from "@application/dtos/UpdateTaskDto";
import { TaskResponseSchema } from "@application/dtos/TaskResponseDto";
import { mapTaskToResponse } from "./helpers/taskResponseMapper";

export function updateTaskRoute(taskService: TaskService) {
  return new Elysia().put(
    "/:id",
    async ({ body, params }) => {
      const task = await taskService.updateTask(params.id, body);
      return mapTaskToResponse(task);
    },
    {
      body: UpdateTaskDtoSchema,
      params: t.Object({
        id: t.Integer(),
      }),
      response: TaskResponseSchema,
      detail: {
        tags: ["tasks"],
        summary: "Обновить задачу",
        description: "Обновляет информацию о задаче по её идентификатору",
      },
    }
  );
}
