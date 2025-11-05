import type { Task } from "@domain/entities/Task";

export interface IGetTaskUseCase {
  execute(id: number): Promise<Task>;
}

