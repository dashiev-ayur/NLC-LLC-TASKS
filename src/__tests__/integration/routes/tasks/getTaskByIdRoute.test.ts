import "../../helpers/setup";
import { describe, test, expect, beforeEach } from "bun:test";
import { getTaskByIdRoute } from "../../../../infrastructure/http/routes/tasks/getTaskByIdRoute";
import { MockTaskServiceFactory } from "../../helpers/MockTaskServiceFactory";
import { RouteTestBase } from "../../helpers/RouteTestBase";
import { createMockTask } from "../../helpers/testData";

describe("GET /tasks/:id - getTaskByIdRoute", () => {
  let mockTaskService: ReturnType<typeof MockTaskServiceFactory.create>;

  beforeEach(() => {
    mockTaskService = MockTaskServiceFactory.create();
  });

  describe("Успешные сценарии", () => {
    test("должен вернуть задачу по существующему ID", async () => {
      const task = createMockTask({ id: 1, title: "Test Task" });
      MockTaskServiceFactory.setupSuccessGetById(mockTaskService, task);

      const app = RouteTestBase.createAppWithRoute(
        getTaskByIdRoute,
        mockTaskService
      );
      const response = await RouteTestBase.handleRequest(app, "GET", "/:id", {
        params: { id: 1 },
      });

      expect(response.status).toBe(200);
      const data = (await response.json()) as { id: number; title: string };
      expect(data.id).toBe(1);
      expect(data.title).toBe("Test Task");
      expect(mockTaskService.getById).toHaveBeenCalledWith(1);
    });
  });

  describe("Ошибки", () => {
    test("должен вернуть 404 при несуществующем ID", async () => {
      MockTaskServiceFactory.setupNotFoundGetById(mockTaskService, 999);

      const app = RouteTestBase.createAppWithRoute(
        getTaskByIdRoute,
        mockTaskService
      );
      const response = await RouteTestBase.handleRequest(app, "GET", "/:id", {
        params: { id: 999 },
      });

      expect(response.status).toBe(404);
      const data = (await response.json()) as {
        error: { code: string; message: string };
      };
      expect(data.error.code).toBe("NOT_FOUND");
      expect(data.error.message).toContain("999");
      expect(mockTaskService.getById).toHaveBeenCalledWith(999);
    });

    test("должен вернуть 400 при невалидном ID (не число)", async () => {
      const app = RouteTestBase.createAppWithRoute(
        getTaskByIdRoute,
        mockTaskService
      );
      const response = await RouteTestBase.handleRequest(app, "GET", "/:id", {
        params: { id: "abc" },
      });

      expect(response.status).toBe(400);
      expect(mockTaskService.getById).not.toHaveBeenCalled();
    });
  });
});
