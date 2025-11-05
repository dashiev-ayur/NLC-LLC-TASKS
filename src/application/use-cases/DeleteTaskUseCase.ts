import { NotFoundDomainError } from "@domain/errors/DomainError";
import type { ITaskRepository } from "@domain/repositories/ITaskRepository";
import type { IDeleteTaskUseCase } from "./interfaces/IDeleteTaskUseCase";

export class DeleteTaskUseCase implements IDeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number): Promise<void> {
    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new NotFoundDomainError(`Задача с id ${id} не найдена`);
    }

    await this.taskRepository.delete(id);
  }
}
