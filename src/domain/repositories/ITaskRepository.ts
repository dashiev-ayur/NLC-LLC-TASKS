import type { Task, TaskStatus } from "../entities/Task";

export interface TaskFilters {
  status?: TaskStatus;
}

export interface ITaskRepository {
  getById(id: number): Promise<Task | null>;
  getListByFilters(filters?: TaskFilters): Promise<Task[]>;
}
