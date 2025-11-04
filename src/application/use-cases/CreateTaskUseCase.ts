import type { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import type { Task } from "../../domain/entities/Task";
import { TaskEntity, TaskStatus } from "../../domain/entities/Task";
import { DueDate } from "../../domain/value-objects/DueDate";
import type { CreateTaskDto } from "../dtos/CreateTaskDto";
import type { INotificationService } from "../../domain/services/INotificationService";

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly notificationService: INotificationService
  ) {}

  async execute(dto: CreateTaskDto): Promise<Task> {
    const now = new Date();

    let dueDate: Date | null = null;
    if (dto.dueDate) {
      const dueDateObject = new DueDate(dto.dueDate);
      dueDateObject.checkIsFuture();
      dueDate = dueDateObject.getValue();
    }

    // Создаем доменную сущность, которая автоматически валидирует данные
    const taskEntity = new TaskEntity(
      undefined,
      dto.title,
      dto.description ?? "",
      TaskStatus.PENDING,
      dueDate || null,
      now,
      now
    );

    // Преобразуем в Task для сохранения в репозитории
    const task = taskEntity.toDomain();
    const createdTask = await this.taskRepository.create(task);

    // Проверяем через DueDate Value Object, нужно ли добавить в очередь уведомлений
    if (dueDate) {
      const dueDateObject = new DueDate(dueDate.toISOString());
      if (dueDateObject.isWithin24Hours()) {
        const {id, title} = createdTask;
        if (id && title && dueDate) {
          await this.notificationService.processTaskDueDateCheck(id, title, dueDate);
        }
      }
    }

    return createdTask;
  }
}
