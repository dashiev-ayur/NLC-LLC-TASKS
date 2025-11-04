export enum TaskStatus {
  Pending = "pending",
  Completed = "completed",
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskEntity {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public status: TaskStatus,
    public dueDate: Date,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error("Заголовок задачи не может быть пустым");
    }

    if (this.title.length > 255) {
      throw new Error("Заголовок задачи не может превышать 255 символов");
    }

    if (this.description && this.description.length > 1000) {
      throw new Error("Описание задачи не может превышать 1000 символов");
    }

    if (this.dueDate && this.dueDate < new Date()) {
      throw new Error("Дата выполнения задачи должна быть больше текущего времени");
    }

    if (!Object.values(TaskStatus).includes(this.status)) {
      throw new Error("Статус задачи не корректный");
    }
  }

}
