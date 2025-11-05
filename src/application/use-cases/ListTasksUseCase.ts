import type {
  ITaskRepository,
  TaskFilters,
} from "@domain/repositories/ITaskRepository";
import type { Task } from "@domain/entities/Task";

export class ListTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(filters?: TaskFilters): Promise<Task[]> {
    return await this.taskRepository.getListByFilters(filters);
  }
}
