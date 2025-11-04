import { Elysia } from "elysia";
import { TaskService } from "../../../application/services/TaskService";
import { getTasksRoute } from "./tasks/getTasksRoute";
import { getTaskByIdRoute } from "./tasks/getTaskByIdRoute";
import { createTaskRoute } from "./tasks/createTaskRoute";
import { updateTaskRoute } from "./tasks/updateTaskRoute";
import { deleteTaskRoute } from "./tasks/deleteTaskRoute";

export function tasksRoutes(taskService: TaskService) {
  return new Elysia({ prefix: "/tasks" })
    .use(getTasksRoute(taskService))
    .use(getTaskByIdRoute(taskService))
    .use(createTaskRoute(taskService))
    .use(updateTaskRoute(taskService))
    .use(deleteTaskRoute(taskService));
}
