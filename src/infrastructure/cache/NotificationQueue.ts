import type Redis from "ioredis";

const NOTIFICATION_QUEUE_KEY = "task:notifications:queue";

export interface NotificationTask {
  taskId: number;
  taskTitle: string;
  dueDate: string;
}

export class NotificationQueue {
  constructor(private redis: Redis) {}

  async addNotification(task: NotificationTask): Promise<void> {
    await this.redis.lpush(NOTIFICATION_QUEUE_KEY, JSON.stringify(task));
  }

  async getNextNotification(): Promise<NotificationTask | null> {
    const result = await this.redis.rpop(NOTIFICATION_QUEUE_KEY);
    if (!result) {
      return null;
    }
    return JSON.parse(result) as NotificationTask;
  }

  async getAllNotifications(): Promise<NotificationTask[]> {
    const results = await this.redis.lrange(NOTIFICATION_QUEUE_KEY, 0, -1);
    return results.map((result) => JSON.parse(result) as NotificationTask);
  }

  async clearQueue(): Promise<void> {
    await this.redis.del(NOTIFICATION_QUEUE_KEY);
  }

  async getQueueLength(): Promise<number> {
    return await this.redis.llen(NOTIFICATION_QUEUE_KEY);
  }
}
