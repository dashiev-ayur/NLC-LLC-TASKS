import type { Task, TaskStatus } from "../entities/Task";

export interface TaskFilters {
  status?: TaskStatus;
}

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Task | null>;
  find(filters?: TaskFilters): Promise<Task[]>;
}
