import type { Task } from "@domain/entities/Task";
import type { UpdateTaskDto } from "@application/dtos/UpdateTaskDto";

export interface IUpdateTaskUseCase {
  execute(id: number, dto: UpdateTaskDto): Promise<Task>;
}
