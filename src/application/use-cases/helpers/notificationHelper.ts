import { DueDate } from "@domain/value-objects/DueDate";
import type { Task } from "@domain/entities/Task";
import type { INotificationService } from "@domain/services/INotificationService";

/**
 * Проверяет dueDate задачи и отправляет уведомление, если задача должна быть выполнена в течение 24 часов
 */
export async function checkAndNotifyTaskDueDate(
  task: Task,
  notificationService: INotificationService
): Promise<void> {
  if (!task.dueDate || !task.id || !task.title) {
    return;
  }

  const dueDateObject = new DueDate(task.dueDate.toISOString());
  if (dueDateObject.isWithin24Hours()) {
    await notificationService.processTaskDueDateCheck(
      task.id,
      task.title,
      task.dueDate
    );
  }
}
