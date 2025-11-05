import { Elysia, t } from "elysia";
import { TaskService } from "@application/services/TaskService";

export function deleteTaskRoute(taskService: TaskService) {
  return new Elysia().delete(
    "/:id",
    async ({ params }) => {
      const { id } = params;
      return await taskService.deleteTask(Number(id));
    },
    {
      params: t.Object({ id: t.Number() }),
    }
  );
}
