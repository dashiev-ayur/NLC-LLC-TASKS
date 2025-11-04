import { t, type Static } from "elysia";

export const CreateTaskDtoSchema = t.Object({
  title: t.String({ minLength: 1, maxLength: 255 }),
  description: t.Optional(t.Nullable(t.String({ maxLength: 1000 }))),
  dueDate: t.Optional(t.Nullable(t.String())),
});

export type CreateTaskDto = Static<typeof CreateTaskDtoSchema>;
