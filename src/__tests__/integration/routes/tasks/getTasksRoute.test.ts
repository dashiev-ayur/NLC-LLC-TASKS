import '../../helpers/setup';
import { describe, test, expect, beforeEach } from 'bun:test';
import { getTasksRoute } from '../../../../infrastructure/http/routes/tasks/getTasksRoute';
import { MockTaskServiceFactory } from '../../helpers/MockTaskServiceFactory';
import { RouteTestBase } from '../../helpers/RouteTestBase';
import { createMockTaskList } from '../../helpers/testData';

describe('GET /tasks - getTasksRoute', () => {
  let mockTaskService: ReturnType<typeof MockTaskServiceFactory.create>;

  beforeEach(() => {
    mockTaskService = MockTaskServiceFactory.create();
  });

  describe('Успешные сценарии', () => {
    test('должен вернуть список всех задач без фильтров', async () => {
      const tasks = createMockTaskList(3);
      MockTaskServiceFactory.setupSuccessGetList(mockTaskService, tasks);

      const app = RouteTestBase.createAppWithRoute(getTasksRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'GET', '/');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(3);
      // Elysia может передать пустой объект вместо undefined
      const callArgs = mockTaskService.getListByFilters.mock.calls[0]?.[0];
      expect(callArgs === undefined || (callArgs && Object.keys(callArgs).length === 0)).toBe(true);
    });

    test('должен вернуть список задач с фильтром status=pending', async () => {
      const tasks = createMockTaskList(2);
      MockTaskServiceFactory.setupSuccessGetList(mockTaskService, tasks);

      const app = RouteTestBase.createAppWithRoute(getTasksRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'GET', '/', {
        query: { status: 'pending' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(mockTaskService.getListByFilters).toHaveBeenCalledWith({ status: 'pending' });
    });

    test('должен вернуть список задач с фильтром status=completed', async () => {
      const tasks = createMockTaskList(1);
      MockTaskServiceFactory.setupSuccessGetList(mockTaskService, tasks);

      const app = RouteTestBase.createAppWithRoute(getTasksRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'GET', '/', {
        query: { status: 'completed' },
      });

      expect(response.status).toBe(200);
      expect(mockTaskService.getListByFilters).toHaveBeenCalledWith({ status: 'completed' });
    });

    test('должен вернуть пустой список', async () => {
      MockTaskServiceFactory.setupSuccessGetList(mockTaskService, []);

      const app = RouteTestBase.createAppWithRoute(getTasksRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'GET', '/');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });
  });

  describe('Валидация', () => {
    test('должен вернуть 400 при невалидном статусе', async () => {
      const app = RouteTestBase.createAppWithRoute(getTasksRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'GET', '/', {
        query: { status: 'invalid' },
      });

      expect(response.status).toBe(400);
      expect(mockTaskService.getListByFilters).not.toHaveBeenCalled();
    });
  });

  describe('Обработка ошибок', () => {
    test('должен обработать ошибку от сервиса', async () => {
      mockTaskService.getListByFilters.mockRejectedValue(new Error('Service error'));

      const app = RouteTestBase.createAppWithRoute(getTasksRoute, mockTaskService);
      const response = await RouteTestBase.handleRequest(app, 'GET', '/');

      expect(response.status).toBe(500);
      const data = await response.json() as { error: { code: string; message: string } };
      expect(data.error.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });
});

