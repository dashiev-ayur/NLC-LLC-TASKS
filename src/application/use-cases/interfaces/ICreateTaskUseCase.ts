import type { Task } from "@domain/entities/Task";
import type { CreateTaskDto } from "@application/dtos/CreateTaskDto";

export interface ICreateTaskUseCase {
  execute(dto: CreateTaskDto): Promise<Task>;
}
