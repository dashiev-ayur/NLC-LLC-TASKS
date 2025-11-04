import { Elysia } from "elysia";
import { getTasksRoute } from "./tasks/get-tasks";
import { getTaskByIdRoute } from "./tasks/get-task-by-id";

export function tasksRoutes() {
  return new Elysia({ prefix: "/tasks" })
    .use(getTasksRoute())
    .use(getTaskByIdRoute());
}
