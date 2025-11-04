import { GetTaskUseCase } from "../use-cases/GetTaskUseCase";
import { ListTasksUseCase } from "../use-cases/ListTasksUseCase";
import type { TaskFilters } from "../../domain/repositories/ITaskRepository";
import type { Task } from "../../domain/entities/Task";
import type { ITaskRepository } from "../../domain/repositories/ITaskRepository";

export class TaskService {
  private getTaskUseCase: GetTaskUseCase;
  private listTasksUseCase: ListTasksUseCase;

  constructor(
    private readonly taskRepository: ITaskRepository,
  ) {
    this.getTaskUseCase = new GetTaskUseCase(taskRepository);
    this.listTasksUseCase = new ListTasksUseCase(taskRepository);
  }

  async getById(id: number): Promise<Task> {
    return await this.getTaskUseCase.execute(id);
  }

  async getListByFilters(filters?: TaskFilters): Promise<Task[]> {
    return await this.listTasksUseCase.execute(filters);
  }
}
