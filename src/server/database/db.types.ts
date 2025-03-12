import type { ColumnType } from "kysely";
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const v_column_type = {
  text: "text",
  number: "number",
  date: "date",
  boolean: "boolean",
  select: "select",
  relation: "relation",
} as const;
export type v_column_type = (typeof v_column_type)[keyof typeof v_column_type];
export type users = {
  id: Generated<string>;
  name: string;
  created_at: Generated<Timestamp>;
};
export type v_cells = {
  id: Generated<number>;
  row_id: number;
  column_id: number;
  value: string | null;
};
export type v_columns = {
  id: Generated<number>;
  table_id: number;
  name: string;
  type: v_column_type;
  options: Generated<unknown | null>;
};
export type v_rows = {
  id: Generated<number>;
  table_id: number;
  created_at: Generated<Timestamp>;
};
export type v_tables = {
  id: Generated<number>;
  name: string;
  owner_id: string | null;
  created_at: Generated<Timestamp>;
};
export type vtable_pages = {
  id: Generated<number>;
  title: string | null;
  content: string | null;
  created_at: Generated<Timestamp>;
  owner_id: number | null;
  parent: number | null;
};
export type DB = {
  users: users;
  v_cells: v_cells;
  v_columns: v_columns;
  v_rows: v_rows;
  v_tables: v_tables;
  vtable_pages: vtable_pages;
};
