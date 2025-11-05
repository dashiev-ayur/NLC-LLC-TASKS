import type {
  ITaskRepository,
  TaskFilters,
} from "@domain/repositories/ITaskRepository";
import type { Task } from "@domain/entities/Task";
import type { IListTasksUseCase } from "./interfaces/IListTasksUseCase";

export class ListTasksUseCase implements IListTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(filters?: TaskFilters): Promise<Task[]> {
    return await this.taskRepository.getListByFilters(filters);
  }
}
