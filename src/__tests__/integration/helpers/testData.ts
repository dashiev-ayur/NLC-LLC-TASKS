import type { Task } from "@domain/entities/Task";
import { TaskStatus } from "@domain/entities/Task";

export const createMockTask = (overrides?: Partial<Task>): Task => {
  const now = new Date();
  return {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    status: TaskStatus.PENDING,
    dueDate: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

export const createMockTaskList = (count: number = 3): Task[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockTask({
      id: i + 1,
      title: `Task ${i + 1}`,
    })
  );
};
