import { Elysia, t } from "elysia";

export function getTasksRoute() {
  return new Elysia().get(
    "/",
    async ({ query }) => {
      return [];
    },
    {
      query: t.Object({
        status: t.Optional(
          t.Union([t.Literal("pending"), t.Literal("completed")])
        ),
      }),
    }
  );
}

