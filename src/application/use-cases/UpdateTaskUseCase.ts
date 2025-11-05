import type { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import type { Task } from "../../domain/entities/Task";
import { TaskEntity, TaskStatus } from "../../domain/entities/Task";
import { DueDate } from "../../domain/value-objects/DueDate";
import type { UpdateTaskDto } from "../dtos/UpdateTaskDto";
import type { INotificationService } from "../../domain/services/INotificationService";
import { NotFoundDomainError } from "../../domain/errors/DomainError";

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly notificationService: INotificationService
  ) {}

  async execute(id: number, dto: UpdateTaskDto): Promise<Task> {
    const existingTask = await this.taskRepository.getById(id);

    if (!existingTask) {
      throw new NotFoundDomainError(
        `UpdateTaskUseCase: задача с id ${id} не найдена`
      );
    }

    // Создаем TaskEntity из существующей задачи для валидации
    const existingTaskEntity = TaskEntity.fromDomain(existingTask);

    const updateData: Partial<Task> = {
      updatedAt: new Date(),
    };

    if (dto.title !== undefined) {
      updateData.title = dto.title;
    }
    if (dto.description !== undefined) {
      updateData.description = dto.description ?? "";
    }
    if (dto.status !== undefined) {
      updateData.status =
        dto.status === "completed" ? TaskStatus.COMPLETED : TaskStatus.PENDING;
    }
    if (dto.dueDate) {
      const dueDateObject = new DueDate(dto.dueDate);
      dueDateObject.checkIsFuture();
      updateData.dueDate = dueDateObject.getValue();
    }

    // Создаем обновленную задачу с новыми данными
    const updatedTaskData: Task = {
      ...existingTaskEntity,
      ...updateData,
    };

    // Валидируем обновленную задачу через TaskEntity
    const updatedTaskEntity = TaskEntity.fromDomain(updatedTaskData);
    const taskToUpdate = updatedTaskEntity.toDomain();

    const updatedTask = await this.taskRepository.update(id, taskToUpdate);

    // Проверяем через DueDate Value Object, нужно ли добавить в очередь уведомлений
    if (updateData.dueDate) {
      const dueDateObject = new DueDate(updateData.dueDate.toISOString());
      if (dueDateObject.isWithin24Hours()) {
        const { id, title } = updatedTask;
        if (id && title && updateData.dueDate) {
          await this.notificationService.processTaskDueDateCheck(
            id,
            title,
            updateData.dueDate
          );
        }
      }
    }
    return updatedTask;
  }
}
