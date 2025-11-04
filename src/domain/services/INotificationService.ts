export interface INotificationService {
  processTaskDueDateCheck(taskId: number, taskTitle: string, taskDueDate: Date): Promise<void>;
}

