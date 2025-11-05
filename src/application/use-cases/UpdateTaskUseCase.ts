import type { ITaskRepository } from "@domain/repositories/ITaskRepository";
import type { Task } from "@domain/entities/Task";
import { TaskEntity, TaskStatus } from "@domain/entities/Task";
import { DueDate } from "@domain/value-objects/DueDate";
import type { UpdateTaskDto } from "../dtos/UpdateTaskDto";
import type { INotificationService } from "@domain/services/INotificationService";
import { NotFoundDomainError } from "@domain/errors/DomainError";
import type { IUpdateTaskUseCase } from "./interfaces/IUpdateTaskUseCase";
import { checkAndNotifyTaskDueDate } from "./helpers/notificationHelper";

export class UpdateTaskUseCase implements IUpdateTaskUseCase {
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

    // Проверяем и отправляем уведомление,
    // если задача должна быть выполнена в течение 24 часов
    await checkAndNotifyTaskDueDate(updatedTask, this.notificationService);

    return updatedTask;
  }
}
