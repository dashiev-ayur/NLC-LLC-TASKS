import { Elysia } from 'elysia';
import type { TaskService } from '../../../application/services/TaskService';
import { errorHandler } from '../../../infrastructure/http/middleware/errorHandler';
import type { MockedTaskService } from './MockTaskServiceFactory';

export class RouteTestBase {
  static createAppWithRoute(
    routeFactory: (taskService: TaskService) => Elysia,
    taskService: TaskService | MockedTaskService
  ): Elysia {
    return new Elysia()
      .onError(errorHandler)
      .use(routeFactory(taskService as TaskService));
  }

  static async handleRequest(
    app: Elysia,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    options?: {
      body?: unknown;
      query?: Record<string, string>;
      params?: Record<string, string | number>;
    }
  ) {
    // Заменяем параметры в пути
    let finalPath = path.startsWith('/') ? path : `/${path}`;
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        finalPath = finalPath.replace(`:${key}`, String(value));
      });
    }

    // Добавляем query параметры
    const url = new URL(finalPath, 'http://localhost');
    if (options?.query) {
      Object.entries(options.query).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (options?.body && (method === 'POST' || method === 'PUT')) {
      requestInit.body = JSON.stringify(options.body);
    }

    const request = new Request(url.toString(), requestInit);
    return app.handle(request);
  }
}

