import { t, type Static } from "elysia";

export const UpdateTaskDtoSchema = t.Object({
  title: t.String({ minLength: 1, maxLength: 255 }),
  description: t.Optional(t.Nullable(t.String({ maxLength: 1000 }))),
  status: t.Optional(t.Union([t.Literal("pending"), t.Literal("completed")])),
  dueDate: t.Optional(t.Nullable(t.String())),
});

export type UpdateTaskDto = Static<typeof UpdateTaskDtoSchema>;
