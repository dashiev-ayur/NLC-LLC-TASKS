import '../../helpers/setup';
import { describe, test, expect, beforeEach } from 'bun:test';
import { updateTaskRoute } from '../../../../infrastructure/http/routes/tasks/updateTaskRoute';
import { MockTaskServiceFactory } from '../../helpers/MockTaskServiceFactory';
import { RouteTestBase } from '../../helpers/RouteTestBase';
import { createMockTask } from '../../helpers/testData';
import { TaskStatus } from '../../../../domain/entities/Task';
import { NotFoundDomainError, ValidationDomainError } from '../../../../domain/errors/DomainError';

describe('PUT /tasks/:id - updateTaskRoute', () => {
  let mockTaskService: ReturnType<typeof MockTaskServiceFactory.create>;

  beforeEach(() => {
    mockTaskService = MockTaskServiceFactory.create();
  });

  describe('Успешные сценарии', () => {
    test('должен обновить задачу с валидными данными', async () => {
      const updatedTask = createMockTask({
        id: 1,
        title: 'Updated Task',
        description: 'Updated description',
      });
      MockTaskServiceFactory.setupSuccessUpdate(mockTaskService, updatedTask);

      const app = RouteTestBase.createAppWithRoute(updateTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'PUT', '/:id', {
        params: { id: 1 },
        body: {
          title: 'Updated Task',
          description: 'Updated description',
        },
      });

      expect(response.status).toBe(200);
      const data = (await response.json()) as { title: string; description: string };
      expect(data.title).toBe('Updated Task');
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, {
        title: 'Updated Task',
        description: 'Updated description',
      });
    });

    test('должен обновить только статус', async () => {
      const updatedTask = createMockTask({ id: 1, status: TaskStatus.COMPLETED });
      MockTaskServiceFactory.setupSuccessUpdate(mockTaskService, updatedTask);

      const app = RouteTestBase.createAppWithRoute(updateTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'PUT', '/:id', {
        params: { id: 1 },
        body: {
          title: 'Existing Task',
          status: 'completed',
        },
      });

      expect(response.status).toBe(200);
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, {
        title: 'Existing Task',
        status: 'completed',
      });
    });

    test('должен обновить dueDate', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const updatedTask = createMockTask({ id: 1, dueDate: futureDate });
      MockTaskServiceFactory.setupSuccessUpdate(mockTaskService, updatedTask);

      const app = RouteTestBase.createAppWithRoute(updateTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'PUT', '/:id', {
        params: { id: 1 },
        body: {
          title: 'Task with due date',
          dueDate: futureDate.toISOString(),
        },
      });

      expect(response.status).toBe(200);
      expect(mockTaskService.updateTask).toHaveBeenCalled();
    });
  });

  describe('Валидация', () => {
    test('должен вернуть 400 при отсутствии title', async () => {
      const app = RouteTestBase.createAppWithRoute(updateTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'PUT', '/:id', {
        params: { id: 1 },
        body: {
          description: 'Description only',
        },
      });

      expect(response.status).toBe(400);
      expect(mockTaskService.updateTask).not.toHaveBeenCalled();
    });

    test('должен вернуть 400 при пустом title', async () => {
      const app = RouteTestBase.createAppWithRoute(updateTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'PUT', '/:id', {
        params: { id: 1 },
        body: {
          title: '',
        },
      });

      expect(response.status).toBe(400);
      expect(mockTaskService.updateTask).not.toHaveBeenCalled();
    });

    test('должен вернуть 400 при невалидном статусе', async () => {
      const app = RouteTestBase.createAppWithRoute(updateTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'PUT', '/:id', {
        params: { id: 1 },
        body: {
          title: 'Valid title',
          status: 'invalid',
        },
      });

      expect(response.status).toBe(400);
      expect(mockTaskService.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('Ошибки', () => {
    test('должен вернуть 404 при несуществующем ID', async () => {
      MockTaskServiceFactory.setupNotFoundUpdate(mockTaskService, 999);

      const app = RouteTestBase.createAppWithRoute(updateTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'PUT', '/:id', {
        params: { id: 999 },
        body: {
          title: 'Updated Task',
        },
      });

      expect(response.status).toBe(404);
      const data = (await response.json()) as { error: { code: string; message: string } };
      expect(data.error.code).toBe('NOT_FOUND');
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(999, { title: 'Updated Task' });
    });

    test('должен обработать ValidationDomainError от сервиса', async () => {
      mockTaskService.updateTask.mockRejectedValue(
        new ValidationDomainError('Ошибка валидации')
      );

      const app = RouteTestBase.createAppWithRoute(updateTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'PUT', '/:id', {
        params: { id: 1 },
        body: {
          title: 'Valid title',
        },
      });

      expect(response.status).toBe(400);
      const data = (await response.json()) as { error: { code: string; message: string } };
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });
});

