import { v_column_type } from "~/server/database/db.types";
import {
  VTableColumnObject,
  VTableObject,
  VRowObject,
} from "../repository/vtable.repository.types";

// these schemas can be optimized later to avoid data redundancy and ease of use; but this is fine for now

export const DEFAULT_COLUMNS: DefaultColumnDefinition[] = [
  {
    name: "Title",
    type: v_column_type.text,
  },
  {
    name: "Status",
    type: v_column_type.select,
    options: {
      options: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
  },
  {
    name: "Date",
    type: v_column_type.date,
  },
  {
    name: "Priority",
    type: v_column_type.select,
    options: {
      options: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
];

export type CreateVTableServiceInput = {
  name: string;
  owner_id?: string;
};

export type UpdateVTableServiceInput = {
  id: number;
  name?: string;
  owner_id?: string | null;
};

export type GetVTableServiceInput = {
  id: number;
};

// Types for assembled table data
export type VTableColumnWithCells = VTableColumnObject & {
  cells: VTableCellData[];
};

export type VTableCellData = {
  id: number;
  row_id: number;
  column_id: number;
  value: string | null;
};

export type VTableRowWithCells = VRowObject & {
  cells: VTableCellData[];
};

// The fully assembled table structure for frontend consumption
export type AssembledVTable = {
  table: VTableObject;
  columns: VTableColumnObject[];
  rows: VTableRowWithCells[];
};

// Default column definitions for table creation
export interface DefaultColumnDefinition {
  name: string;
  type: v_column_type;
  options?: Record<string, unknown>;
}

// Types for updating table structures
export type UpdateVTableColumnServiceInput = {
  id: number;
  name?: string;
  type?: v_column_type;
  options?: Record<string, unknown>;
};

export type UpdateVTableCellServiceInput = {
  id?: number;
  row_id?: number;
  column_id?: number;
  value: string | null;
};

// Types for bulk operations
export type BulkUpdateCellsInput = {
  cells: {
    row_id: number;
    column_id: number;
    value: string | null;
  }[];
};

// Types for deleting entities
export type DeleteVTableServiceInput = {
  id: number;
};

export type DeleteVTableColumnServiceInput = {
  id: number;
};

export type DeleteVTableRowServiceInput = {
  id: number;
};
