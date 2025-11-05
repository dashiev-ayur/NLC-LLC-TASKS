import "../../helpers/setup";
import { describe, test, expect, beforeEach } from "bun:test";
import { deleteTaskRoute } from "../../../../infrastructure/http/routes/tasks/deleteTaskRoute";
import { MockTaskServiceFactory } from "../../helpers/MockTaskServiceFactory";
import { RouteTestBase } from "../../helpers/RouteTestBase";

describe("DELETE /tasks/:id - deleteTaskRoute", () => {
  let mockTaskService: ReturnType<typeof MockTaskServiceFactory.create>;

  beforeEach(() => {
    mockTaskService = MockTaskServiceFactory.create();
  });

  describe("Успешные сценарии", () => {
    test("должен удалить задачу по существующему ID", async () => {
      MockTaskServiceFactory.setupSuccessDelete(mockTaskService);

      const app = RouteTestBase.createAppWithRoute(
        deleteTaskRoute,
        mockTaskService
      );
      const response = await RouteTestBase.handleRequest(
        app,
        "DELETE",
        "/:id",
        {
          params: { id: 1 },
        }
      );

      expect(response.status).toBe(200);
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
    });
  });

  describe("Ошибки", () => {
    test("должен вернуть 404 при несуществующем ID", async () => {
      MockTaskServiceFactory.setupNotFoundDelete(mockTaskService, 999);

      const app = RouteTestBase.createAppWithRoute(
        deleteTaskRoute,
        mockTaskService
      );
      const response = await RouteTestBase.handleRequest(
        app,
        "DELETE",
        "/:id",
        {
          params: { id: 999 },
        }
      );

      expect(response.status).toBe(404);
      const data = (await response.json()) as {
        error: { code: string; message: string };
      };
      expect(data.error.code).toBe("NOT_FOUND");
      expect(data.error.message).toContain("999");
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(999);
    });

    test("должен вернуть 400 при невалидном ID (не число)", async () => {
      const app = RouteTestBase.createAppWithRoute(
        deleteTaskRoute,
        mockTaskService
      );
      const response = await RouteTestBase.handleRequest(
        app,
        "DELETE",
        "/:id",
        {
          params: { id: "abc" },
        }
      );

      expect(response.status).toBe(400);
      expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
    });

    test("должен обработать ошибку от сервиса", async () => {
      mockTaskService.deleteTask.mockRejectedValue(new Error("Service error"));

      const app = RouteTestBase.createAppWithRoute(
        deleteTaskRoute,
        mockTaskService
      );
      const response = await RouteTestBase.handleRequest(
        app,
        "DELETE",
        "/:id",
        {
          params: { id: 1 },
        }
      );

      expect(response.status).toBe(500);
      const data = (await response.json()) as {
        error: { code: string; message?: string };
      };
      expect(data.error.code).toBe("INTERNAL_SERVER_ERROR");
    });
  });
});
