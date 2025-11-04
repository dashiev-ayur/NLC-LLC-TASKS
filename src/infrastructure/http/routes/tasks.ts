import { Elysia } from "elysia";
import { getTasksRoute } from "./tasks/get-tasks";
import { getTaskByIdRoute } from "./tasks/get-task-by-id";
import { TaskService } from "../../../application/services/TaskService";

export function tasksRoutes(taskService: TaskService) {
  return new Elysia({ prefix: "/tasks" })
    .use(getTasksRoute(taskService))
    .use(getTaskByIdRoute(taskService));
}
