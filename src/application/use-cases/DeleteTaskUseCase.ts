import { NotFoundDomainError } from "@domain/errors/DomainError";
import type { ITaskRepository } from "@domain/repositories/ITaskRepository";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number): Promise<void> {
    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new NotFoundDomainError(`Задача с id ${id} не найдена`);
    }

    await this.taskRepository.delete(id);
  }
}
