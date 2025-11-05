import { Elysia } from "elysia";
import { TaskService } from "../../../../application/services/TaskService";
import { CreateTaskDtoSchema } from "../../../../application/dtos/CreateTaskDto";

export function createTaskRoute(taskService: TaskService) {
  return new Elysia().post(
    "/",
    async ({ body }) => {
      return await taskService.createTask(body);
    },
    {
      body: CreateTaskDtoSchema,
    }
  );
}
