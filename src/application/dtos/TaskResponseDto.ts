import { t } from "elysia";

export const TaskResponseSchema = t.Object({
  id: t.Integer(),
  title: t.String(),
  description: t.String(),
  status: t.Nullable(t.Union([t.Literal("pending"), t.Literal("completed")])),
  dueDate: t.Nullable(t.String()),
  createdAt: t.String(),
  updatedAt: t.String(),
});

export const TaskListResponseSchema = t.Array(TaskResponseSchema);

