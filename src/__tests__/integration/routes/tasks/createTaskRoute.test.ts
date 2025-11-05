import '../../helpers/setup';
import { describe, test, expect, beforeEach } from 'bun:test';
import { createTaskRoute } from '../../../../infrastructure/http/routes/tasks/createTaskRoute';
import { MockTaskServiceFactory } from '../../helpers/MockTaskServiceFactory';
import { RouteTestBase } from '../../helpers/RouteTestBase';
import { createMockTask } from '../../helpers/testData';
import { ValidationDomainError } from '../../../../domain/errors/DomainError';

describe('POST /tasks - createTaskRoute', () => {
  let mockTaskService: ReturnType<typeof MockTaskServiceFactory.create>;

  beforeEach(() => {
    mockTaskService = MockTaskServiceFactory.create();
  });

  describe('Успешные сценарии', () => {
    test('должен создать задачу с валидными данными', async () => {
      const task = createMockTask({ id: 1, title: 'New Task', description: 'Test description' });
      MockTaskServiceFactory.setupSuccessCreate(mockTaskService, task);

      const app = RouteTestBase.createAppWithRoute(createTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'POST', '/', {
        body: {
          title: 'New Task',
          description: 'Test description',
        },
      });

      expect(response.status).toBe(200);
      const data = (await response.json()) as { id: number; title: string; description: string };
      expect(data.id).toBe(1);
      expect(data.title).toBe('New Task');
      expect(data.description).toBe('Test description');
      expect(mockTaskService.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Test description',
      });
    });

    test('должен создать задачу без описания', async () => {
      const task = createMockTask({ id: 1, title: 'Task without description', description: '' });
      MockTaskServiceFactory.setupSuccessCreate(mockTaskService, task);

      const app = RouteTestBase.createAppWithRoute(createTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'POST', '/', {
        body: {
          title: 'Task without description',
        },
      });

      expect(response.status).toBe(200);
      expect(mockTaskService.createTask).toHaveBeenCalled();
    });

    test('должен создать задачу с dueDate', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const task = createMockTask({ id: 1, dueDate: futureDate });
      MockTaskServiceFactory.setupSuccessCreate(mockTaskService, task);

      const app = RouteTestBase.createAppWithRoute(createTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'POST', '/', {
        body: {
          title: 'Task with due date',
          dueDate: futureDate.toISOString(),
        },
      });

      expect(response.status).toBe(200);
      expect(mockTaskService.createTask).toHaveBeenCalled();
    });
  });

  describe('Валидация', () => {
    test('должен вернуть 400 при отсутствии title', async () => {
      const app = RouteTestBase.createAppWithRoute(createTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'POST', '/', {
        body: {
          description: 'Test description',
        },
      });

      expect(response.status).toBe(400);
      const data = (await response.json()) as { error: { code: string; message?: string } };
      expect(data.error).toBeDefined();
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(mockTaskService.createTask).not.toHaveBeenCalled();
    });

    test('должен вернуть 400 при пустом title', async () => {
      const app = RouteTestBase.createAppWithRoute(createTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'POST', '/', {
        body: {
          title: '',
        },
      });

      expect(response.status).toBe(400);
      const data = (await response.json()) as { error: { code: string; message?: string } };
      expect(data.error).toBeDefined();
      expect(mockTaskService.createTask).not.toHaveBeenCalled();
    });

    test('должен вернуть 400 при title длиннее 255 символов', async () => {
      const app = RouteTestBase.createAppWithRoute(createTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'POST', '/', {
        body: {
          title: 'a'.repeat(256),
        },
      });

      expect(response.status).toBe(400);
      expect(mockTaskService.createTask).not.toHaveBeenCalled();
    });

    test('должен вернуть 400 при description длиннее 1000 символов', async () => {
      const app = RouteTestBase.createAppWithRoute(createTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'POST', '/', {
        body: {
          title: 'Valid title',
          description: 'a'.repeat(1001),
        },
      });

      expect(response.status).toBe(400);
      expect(mockTaskService.createTask).not.toHaveBeenCalled();
    });
  });

  describe('Обработка ошибок', () => {
    test('должен обработать ValidationDomainError от сервиса', async () => {
      mockTaskService.createTask.mockRejectedValue(
        new ValidationDomainError('Ошибка валидации')
      );

      const app = RouteTestBase.createAppWithRoute(createTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'POST', '/', {
        body: {
          title: 'Valid title',
        },
      });

      expect(response.status).toBe(400);
      const data = (await response.json()) as { error: { code: string; message: string } };
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.message).toBe('Ошибка валидации');
    });

    test('должен обработать неизвестную ошибку', async () => {
      mockTaskService.createTask.mockRejectedValue(new Error('Internal error'));

      const app = RouteTestBase.createAppWithRoute(createTaskRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'POST', '/', {
        body: {
          title: 'Valid title',
        },
      });

      expect(response.status).toBe(500);
      const data = (await response.json()) as { error: { code: string; message?: string } };
      expect(data.error.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });
});

