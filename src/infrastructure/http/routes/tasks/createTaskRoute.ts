import { Elysia, t } from "elysia";
import { TaskService } from "../../../../application/services/TaskService";
import type { TaskFilters } from "../../../../domain/repositories/ITaskRepository";
import {
  CreateTaskDtoSchema,
  type CreateTaskDto,
} from "../../../../application/dtos/CreateTaskDto";

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
