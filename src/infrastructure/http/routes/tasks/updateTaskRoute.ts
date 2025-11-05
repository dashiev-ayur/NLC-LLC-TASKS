import { Elysia, t } from "elysia";
import { TaskService } from "@application/services/TaskService";
import { UpdateTaskDtoSchema } from "@application/dtos/UpdateTaskDto";

export function updateTaskRoute(taskService: TaskService) {
  return new Elysia().put(
    "/:id",
    async ({ body, params }) => {
      const { id } = params;
      return await taskService.updateTask(Number(id), body);
    },
    {
      body: UpdateTaskDtoSchema,
      params: t.Object({ id: t.Number() }),
    }
  );
}
