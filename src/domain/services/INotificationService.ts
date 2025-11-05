import type { Notification } from "../entities/Notification";

export interface INotificationService {
  processTaskDueDateCheck(
    taskId: number,
    taskTitle: string,
    taskDueDate: Date
  ): Promise<void>;
  getNextNotification(): Promise<Notification | null>;
}
