import { integer, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "../schema";
import { createTable } from "../helpers";

// @ts-ignore
export const pages = createTable("pages", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title", { length: 256 }),
  content: text("content"),
  ownerId: uuid("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // Self-reference: a page may reference a parent page (null for root pages)
  // @ts-ignore
  parent: integer("parent").references(() => pages.id),
});
