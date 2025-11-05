import type { TaskFilters } from "@domain/repositories/ITaskRepository";
import type { Task } from "@domain/entities/Task";
import type { CreateTaskDto } from "../dtos/CreateTaskDto";
import type { UpdateTaskDto } from "../dtos/UpdateTaskDto";
import type { IGetTaskUseCase } from "../use-cases/interfaces/IGetTaskUseCase";
import type { IListTasksUseCase } from "../use-cases/interfaces/IListTasksUseCase";
import type { ICreateTaskUseCase } from "../use-cases/interfaces/ICreateTaskUseCase";
import type { IUpdateTaskUseCase } from "../use-cases/interfaces/IUpdateTaskUseCase";
import type { IDeleteTaskUseCase } from "../use-cases/interfaces/IDeleteTaskUseCase";

export class TaskService {
  constructor(
    private readonly getTaskUseCase: IGetTaskUseCase,
    private readonly listTasksUseCase: IListTasksUseCase,
    private readonly createTaskUseCase: ICreateTaskUseCase,
    private readonly updateTaskUseCase: IUpdateTaskUseCase,
    private readonly deleteTaskUseCase: IDeleteTaskUseCase
  ) {}

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

  async deleteTask(id: number): Promise<void> {
    return await this.deleteTaskUseCase.execute(id);
  }
}
