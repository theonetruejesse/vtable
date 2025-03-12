import {
  v_cells,
  v_columns,
  v_rows,
  v_tables,
} from "~/server/database/db.types";
import { Selectable } from "kysely";

export type CreateVTableInput = Pick<v_tables, "name" | "owner_id">;

export type UpdateVTableInput = {
  id: number;
  data: Partial<Pick<v_tables, "name" | "owner_id">>;
};

export type VTableObject = Selectable<v_tables>;

export type GetVTableInput = {
  id: number;
};

export type GetVTablesInput = {
  ownerId?: string;
};

export type CreateVTableColumnInput = Omit<v_columns, "id" | "options"> & {
  options?: Record<string, unknown> | string;
};

export type UpdateVTableColumnInput = {
  id: number;
  data: Partial<
    Omit<v_columns, "id" | "table_id" | "options"> & {
      options?: Record<string, unknown> | string;
    }
  >;
};

export type VTableColumnObject = Selectable<v_columns>;

export type GetVTableColumnInput = {
  id: number;
};

export type GetVTableColumnsInput = {
  tableId: number;
};

export type CreateVRowInput = {
  tableId: number;
};

export type UpdateVRowInput = {
  id: number;
  // Currently no updatable fields for rows
};

export type VRowObject = Selectable<v_rows>;

export type GetVRowInput = {
  id: number;
};

export type GetVRowsInput = {
  tableId: number;
};

export type CreateVCellInput = {
  row_id: number;
  column_id: number;
  value?: string | null;
};

export type UpdateVCellInput = {
  id: number;
  data: {
    value?: string | null;
  };
};

export type UpdateVCellByPositionInput = {
  row_id: number;
  column_id: number;
  value: string | null;
};

export type VCellObject = Selectable<v_cells>;

export type GetVCellInput = {
  id: number;
};

export type GetVCellsInput = {
  rowId?: number;
  columnId?: number;
  tableId?: number;
};

export type DeleteVTableInput = {
  id: number;
};

export type DeleteVTableColumnInput = {
  id: number;
};

export type DeleteVRowInput = {
  id: number;
};

export type DeleteVCellInput = {
  id: number;
};
