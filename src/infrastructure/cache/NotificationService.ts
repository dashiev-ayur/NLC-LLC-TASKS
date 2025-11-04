import type { INotificationService } from "../../domain/services/INotificationService";
import { DueDate } from "../../domain/value-objects/DueDate";
import { getDB } from "../database/connection";
import { tasks } from "../database/schema";
import { NotificationQueue } from "./NotificationQueue";

export class NotificationService implements INotificationService {
  private queue: NotificationQueue;
  private db = getDB();
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.queue = new NotificationQueue();
  }

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
      const notification = await this.queue.getNextNotification();

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
}
