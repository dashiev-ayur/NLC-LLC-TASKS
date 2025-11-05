import { Elysia, t } from "elysia";
import { TaskService } from "@application/services/TaskService";
import type { TaskFilters } from "@domain/repositories/ITaskRepository";

export function getTasksRoute(taskService: TaskService) {
  return new Elysia().get(
    "/",
    async ({ query }) => {
      return await taskService.getListByFilters(
        query as unknown as TaskFilters
      );
    },
    {
      query: t.Object({
        status: t.Optional(
          t.Union([t.Literal("pending"), t.Literal("completed")])
        ),
      }),
    }
  );
}
