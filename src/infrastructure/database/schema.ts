import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const tasks = table(
  "tasks",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    title: t.varchar("title", { length: 255 }).notNull(),
    description: t.text("description"),
    dueDate: t.timestamp("due_date"),
    status: t.varchar("status", { length: 15 }),
    createdAt: t.timestamp("created_at").notNull().defaultNow(),
    updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [t.index("status").on(table.title)]
);

export type TaskTable = typeof tasks.$inferSelect;
export type NewTaskTable = typeof tasks.$inferInsert;
