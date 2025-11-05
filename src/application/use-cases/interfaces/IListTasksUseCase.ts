import type { Task } from "@domain/entities/Task";
import type { TaskFilters } from "@domain/repositories/ITaskRepository";

export interface IListTasksUseCase {
  execute(filters?: TaskFilters): Promise<Task[]>;
}
