import { GetTaskUseCase } from "../use-cases/GetTaskUseCase";
import { ListTasksUseCase } from "../use-cases/ListTasksUseCase";
import type { TaskFilters } from "../../domain/repositories/ITaskRepository";
import type { Task } from "../../domain/entities/Task";
import type { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import type { CreateTaskDto } from "../dtos/CreateTaskDto";
import { CreateTaskUseCase } from "../use-cases/CreateTaskUseCase";
import type { UpdateTaskDto } from "../dtos/UpdateTaskDto";
import { UpdateTaskUseCase } from "../use-cases/UpdateTaskUseCase";

export class TaskService {
  private getTaskUseCase: GetTaskUseCase;
  private listTasksUseCase: ListTasksUseCase;
  private createTaskUseCase: CreateTaskUseCase;
  private updateTaskUseCase: UpdateTaskUseCase;

  constructor(
    private readonly taskRepository: ITaskRepository,
  ) {
    this.getTaskUseCase = new GetTaskUseCase(taskRepository);
    this.listTasksUseCase = new ListTasksUseCase(taskRepository);
    this.createTaskUseCase = new CreateTaskUseCase(taskRepository);
    this.updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
  }

  async getById(id: number): Promise<Task> {
    return await this.getTaskUseCase.execute(id);
  }

  async getListByFilters(filters?: TaskFilters): Promise<Task[]> {
    return await this.listTasksUseCase.execute(filters);
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    return await this.createTaskUseCase.execute(dto);
  }

  async updateTask(id: number, dto: UpdateTaskDto): Promise<Task> {
    return await this.updateTaskUseCase.execute(id, dto);
  }
}
