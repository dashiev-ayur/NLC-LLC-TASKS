import type { INotificationService } from "../../domain/services/INotificationService";
import { DueDate } from "../../domain/value-objects/DueDate";

export class NotificationScheduler {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private notificationService: INotificationService) {}

  start(intervalMs: number = 5000): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    console.log("Notification Service started");
    this.intervalId = setInterval(async () => {
      await this.processNotifications();
    }, intervalMs);
  }

  stop(): void {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log("Notification Service stopped");
  }

  private async processNotifications(): Promise<void> {
    try {
      console.log("Processing notifications...");
      const notification = await this.notificationService.getNextNotification();

      if (!notification) {
        return;
      }

      console.log("Notification:", notification);
      const { taskId, taskTitle, dueDate } = notification;

      if (dueDate) {
        const dueDateObject = new DueDate(dueDate);
        if (dueDateObject.isWithin24Hours()) {
          await this.sendNotification(taskId, taskTitle, dueDate);
        }
      }
    } catch (error) {
      console.error("Error processing notification:", error);
    }
  }

  private async sendNotification(
    taskId: number,
    taskTitle: string,
    dueDate: string
  ): Promise<void> {
    const message = `[${new Date().toISOString()}] Notification: Task № ${taskId}: "${taskTitle}" / ${dueDate}`;
    try {
      // TODO: send notification to user
      // ...send notification to user via email, sms, etc.
      console.info(message);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
}
