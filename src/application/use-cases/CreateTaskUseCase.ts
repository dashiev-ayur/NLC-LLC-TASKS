import type { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import type { Task } from "../../domain/entities/Task";
import { TaskEntity, TaskStatus } from "../../domain/entities/Task";
import { DueDate } from "../../domain/value-objects/DueDate";
import type { CreateTaskDto } from "../dtos/CreateTaskDto";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDto): Promise<Task> {
    const now = new Date();

    let dueDate: Date | null = null;
    if (dto.dueDate) dueDate = new DueDate(dto.dueDate).getValue();

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
    // if (createdTask.dueDate) {
    //   const dueDateVO = DueDate.create(createdTask.dueDate);
    //   if (dueDateVO && dueDateVO.isWithin24Hours()) {
    //     await this.notificationService.processTaskDueDateCheck(createdTask.id, createdTask.title, createdTask.dueDate);
    //   }
    // }

    return createdTask;
  }
}
