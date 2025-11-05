import { Elysia } from "elysia";
import { TaskService } from "@application/services/TaskService";
import { CreateTaskDtoSchema } from "@application/dtos/CreateTaskDto";
import { TaskResponseSchema } from "@application/dtos/TaskResponseDto";
import { mapTaskToResponse } from "./helpers/taskResponseMapper";

export function createTaskRoute(taskService: TaskService) {
  return new Elysia().post(
    "/",
    async ({ body }) => {
      const task = await taskService.createTask(body);
      return mapTaskToResponse(task);
    },
    {
      body: CreateTaskDtoSchema,
      response: TaskResponseSchema,
      detail: {
        tags: ["tasks"],
        summary: "Создать новую задачу",
        description: "Создаёт новую задачу с указанными параметрами",
      },
    }
  );
}
