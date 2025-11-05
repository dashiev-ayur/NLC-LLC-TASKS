import type { Notification } from "@domain/entities/Notification";
import type { INotificationService } from "@domain/services/INotificationService";
import { DueDate } from "@domain/value-objects/DueDate";
import { NotificationQueue } from "./NotificationQueue";

export class NotificationService implements INotificationService {
  constructor(private queue: NotificationQueue) {}

  async processTaskDueDateCheck(
    taskId: number,
    taskTitle: string,
    taskDueDate: Date
  ): Promise<void> {
    if (!taskDueDate) return;
    const dueDateObject = new DueDate(taskDueDate.toISOString());
    if (!dueDateObject.isWithin24Hours()) return;

    await this.queue.addNotification({
      taskId,
      taskTitle,
      dueDate: dueDateObject.getValue().toISOString(),
    });
  }

  async getNextNotification(): Promise<Notification | null> {
    return await this.queue.getNextNotification();
  }
}
