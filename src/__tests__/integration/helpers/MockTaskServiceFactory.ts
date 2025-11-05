import { mock } from "bun:test";
import type { Task } from "@domain/entities/Task";
import { NotFoundDomainError } from "@domain/errors/DomainError";
import { createMockTask, createMockTaskList } from "./testData";

// Тип для мокированного TaskService
// Методы имеют совместимую сигнатуру с TaskService, но являются моками с дополнительными методами (mockResolvedValue, mockImplementation и т.д.)
export type MockedTaskService = {
  getById: ReturnType<typeof mock>;
  getListByFilters: ReturnType<typeof mock>;
  createTask: ReturnType<typeof mock>;
  updateTask: ReturnType<typeof mock>;
  deleteTask: ReturnType<typeof mock>;
};

export class MockTaskServiceFactory {
  static create(): MockedTaskService {
    return {
      getById: mock(),
      getListByFilters: mock(),
      createTask: mock(),
      updateTask: mock(),
      deleteTask: mock(),
    };
  }

  static setupSuccessGetById(
    mockService: MockedTaskService,
    task?: Task
  ): void {
    mockService.getById.mockResolvedValue(task ?? createMockTask());
  }

  static setupNotFoundGetById(
    mockService: MockedTaskService,
    id: number
  ): void {
    mockService.getById.mockImplementation(async () => {
      throw new NotFoundDomainError(`Задача с id ${id} не найдена`);
    });
  }

  static setupSuccessGetList(
    mockService: MockedTaskService,
    tasks?: Task[]
  ): void {
    mockService.getListByFilters.mockResolvedValue(
      tasks ?? createMockTaskList()
    );
  }

  static setupSuccessCreate(mockService: MockedTaskService, task?: Task): void {
    mockService.createTask.mockResolvedValue(task ?? createMockTask());
  }

  static setupSuccessUpdate(mockService: MockedTaskService, task?: Task): void {
    mockService.updateTask.mockResolvedValue(task ?? createMockTask());
  }

  static setupNotFoundUpdate(mockService: MockedTaskService, id: number): void {
    mockService.updateTask.mockImplementation(async () => {
      throw new NotFoundDomainError(
        `UpdateTaskUseCase: задача с id ${id} не найдена`
      );
    });
  }

  static setupSuccessDelete(mockService: MockedTaskService): void {
    mockService.deleteTask.mockResolvedValue(undefined);
  }

  static setupNotFoundDelete(mockService: MockedTaskService, id: number): void {
    mockService.deleteTask.mockImplementation(async () => {
      throw new NotFoundDomainError(`Задача с id ${id} не найдена`);
    });
  }
}
