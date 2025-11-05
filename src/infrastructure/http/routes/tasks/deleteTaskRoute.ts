import { Elysia, t } from "elysia";
import { TaskService } from "@application/services/TaskService";

export function deleteTaskRoute(taskService: TaskService) {
  return new Elysia().delete(
    "/:id",
    async ({ params }) => {
      await taskService.deleteTask(params.id);
      return { message: "Задача успешно удалена" };
    },
    {
      params: t.Object({
        id: t.Integer(),
      }),
      response: t.Object({
        message: t.String(),
      }),
      detail: {
        tags: ["tasks"],
        summary: "Удалить задачу",
        description: "Удаляет задачу по её идентификатору",
      },
    }
  );
}
