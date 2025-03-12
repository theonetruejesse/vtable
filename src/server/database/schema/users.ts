import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createTable } from "../helpers";

export const users = createTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
