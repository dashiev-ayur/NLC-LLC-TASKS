import { eq } from "drizzle-orm";
import { getDB } from "../database/connection";
import { tasks, type TaskTable } from "../database/schema";
import type {
  ITaskRepository,
  TaskFilters,
} from "../../domain/repositories/ITaskRepository";
import type { Task, TaskStatus } from "../../domain/entities/Task";

export class TaskRepository implements ITaskRepository {
  private db = getDB();

  async getById(id: number): Promise<Task | null> {
    const [result] = await this.db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);
    if (!result) {
      return null;
    }
    console.log(result);

    return this.mapToDomain(result);
  }

  async getListByFilters(filters?: TaskFilters): Promise<Task[]> {
    const query = this.db.select().from(tasks);
    const results = filters?.status
      ? await query.where(eq(tasks.status, filters.status))
      : await query;
    return results.map((result) => this.mapToDomain(result));
  }

  async create(task: Task): Promise<Task> {
    const { id, ...taskData } = task;
    const result = await this.db.insert(tasks).values(taskData).returning();
    const inserted = result[0];
    if (!inserted) {
      throw new Error("TaskRepository: результат сохранения задачи не найден");
    }
    return this.mapToDomain(inserted);
  }

  async update(id: number, task: Task): Promise<Task> {
    const { id: _id, createdAt, ...taskData } = task;

    const result = await this.db
      .update(tasks)
      .set({...taskData, updatedAt: new Date()})
      .where(eq(tasks.id, id))
      .returning();

    const updated = result[0];
    if (!updated) {
      throw new Error("TaskRepository: результат обновления задачи не найден");
    }
    return this.mapToDomain(updated);
  }

  private mapToDomain(row: TaskTable): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description || "",
      dueDate: row.dueDate ? new Date(row.dueDate) : null,
      status: (row.status as TaskStatus) || null,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }
}
