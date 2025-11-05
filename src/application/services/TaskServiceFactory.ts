import { TaskService } from "./TaskService";
import { GetTaskUseCase } from "../use-cases/GetTaskUseCase";
import { ListTasksUseCase } from "../use-cases/ListTasksUseCase";
import { CreateTaskUseCase } from "../use-cases/CreateTaskUseCase";
import { UpdateTaskUseCase } from "../use-cases/UpdateTaskUseCase";
import { DeleteTaskUseCase } from "../use-cases/DeleteTaskUseCase";
import type { ITaskRepository } from "@domain/repositories/ITaskRepository";
import type { INotificationService } from "@domain/services/INotificationService";

export class TaskServiceFactory {
  static create(
    taskRepository: ITaskRepository,
    notificationService: INotificationService
  ): TaskService {
    const getTaskUseCase = new GetTaskUseCase(taskRepository);
    const listTasksUseCase = new ListTasksUseCase(taskRepository);
    const createTaskUseCase = new CreateTaskUseCase(
      taskRepository,
      notificationService
    );
    const updateTaskUseCase = new UpdateTaskUseCase(
      taskRepository,
      notificationService
    );
    const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

    return new TaskService(
      getTaskUseCase,
      listTasksUseCase,
      createTaskUseCase,
      updateTaskUseCase,
      deleteTaskUseCase
    );
  }
}
