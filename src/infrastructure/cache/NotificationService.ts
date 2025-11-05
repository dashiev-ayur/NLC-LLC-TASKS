import type { Notification } from "@domain/entities/Notification";
import type { INotificationService } from "@domain/services/INotificationService";
import { NotificationQueue } from "./NotificationQueue";

export class NotificationService implements INotificationService {
  constructor(private queue: NotificationQueue) {}

  async processTaskDueDateCheck(
    taskId: number,
    taskTitle: string,
    taskDueDate: Date
  ): Promise<void> {
    await this.queue.addNotification({
      taskId,
      taskTitle,
      dueDate: taskDueDate.toISOString(),
    });
  }

  async getNextNotification(): Promise<Notification | null> {
    return await this.queue.getNextNotification();
  }
}
