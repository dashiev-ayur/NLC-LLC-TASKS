import { DueDate } from "../value-objects/DueDate";
import {
  ValidationDomainError,
  BusinessRuleDomainError,
} from "../errors/DomainError";

export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: TaskStatus | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskEntity {
  constructor(
    public id: number | undefined,
    public title: string,
    public description: string,
    public status: TaskStatus | null,
    public dueDate: Date | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new ValidationDomainError("Заголовок задачи не может быть пустым");
    }

    if (this.title.length > 255) {
      throw new ValidationDomainError(
        "Заголовок задачи не может превышать 255 символов"
      );
    }

    if (this.description && this.description.length > 1000) {
      throw new ValidationDomainError(
        "Описание задачи не может превышать 1000 символов"
      );
    }

    if (this.dueDate) {
      // проверка формата даты в ISO 8601: 2025-11-04T12:00:00Z
      const _ = new DueDate(this.dueDate.toISOString());
    }

    if (this.status && !Object.values(TaskStatus).includes(this.status)) {
      throw new BusinessRuleDomainError("Статус задачи не корректный");
    }
  }

  toDomain(): Task {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromDomain(task: Task): TaskEntity {
    return new TaskEntity(
      task.id,
      task.title,
      task.description,
      task.status,
      task.dueDate,
      task.createdAt,
      task.updatedAt
    );
  }
}
