import type { Task } from "@domain/entities/Task";

export function mapTaskToResponse(task: Task) {
  return {
    id: task.id!,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function mapTasksToResponse(tasks: Task[]) {
  return tasks.map(mapTaskToResponse);
}
