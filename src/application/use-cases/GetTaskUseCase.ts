import type { ITaskRepository } from "@domain/repositories/ITaskRepository";
import type { Task } from "@domain/entities/Task";
import { NotFoundDomainError } from "@domain/errors/DomainError";
import type { IGetTaskUseCase } from "./interfaces/IGetTaskUseCase";

export class GetTaskUseCase implements IGetTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number): Promise<Task> {
    const task = await this.taskRepository.getById(id);
    if (!task) {
      throw new NotFoundDomainError(`Задача с id ${id} не найдена`);
    }
    return task;
  }
}
