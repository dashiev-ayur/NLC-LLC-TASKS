import { Elysia, t } from "elysia";
import { TaskService } from "../../../../application/services/TaskService";

export function getTaskByIdRoute(taskService: TaskService) {
  return new Elysia().get(
    "/:id",
    async ({ params }) => {
      return await taskService.getById(params.id);
    },
    {
      params: t.Object({
        id: t.Integer(),
      }),
    }
  );
}

