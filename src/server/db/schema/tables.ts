import { timestamp, text, uuid, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { createTable } from "../helpers";
export const columnTypeEnum = pgEnum("column_type", [
  "text",
  "number",
  "date",
  "boolean",
  "select",
  "relation",
]);

export const tables = createTable("v_tables", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const columns = createTable("v_columns", {
  id: uuid("id").primaryKey().defaultRandom(),
  tableId: uuid("table_id")
    .notNull()
    .references(() => tables.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: columnTypeEnum("type").notNull(),
  // Stores extra settings like dropdown options
  options: jsonb("options").default({}),
});

export const rows = createTable("v_rows", {
  id: uuid("id").primaryKey().defaultRandom(),
  tableId: uuid("table_id")
    .notNull()
    .references(() => tables.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cells = createTable("v_cells", {
  id: uuid("id").primaryKey().defaultRandom(),
  rowId: uuid("row_id")
    .notNull()
    .references(() => rows.id, { onDelete: "cascade" }),
  columnId: uuid("column_id")
    .notNull()
    .references(() => columns.id, { onDelete: "cascade" }),
  // Can store any type (will cast based on column type)
  value: text("value"),
});
