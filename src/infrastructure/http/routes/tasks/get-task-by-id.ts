import { Elysia, t } from "elysia";

export function getTaskByIdRoute() {
  return new Elysia().get(
    "/:id",
    async ({ params }) => {
      return [];
    },
    {
      params: t.Object({
        id: t.Integer(),
      }),
    }
  );
}

