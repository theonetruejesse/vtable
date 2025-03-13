import { v_column_type } from "~/server/database/db.types";
import {
  VTableColumnObject,
  VRowObject,
  VTableObject,
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

// Types for structuring and assembling VTable data

/**
 * Simplified cell object for frontend consumption
 * Contains only the essential cell data needed for display and updates
 */
export type VTableCellObject = {
  id: number;
  value: string | null;
};

/**
 * The fully assembled table structure for frontend consumption
 */
export type AssembledVTable = {
  table: VTableObject;
  columns: VTableColumnObject[];
  rows: VRowObject[];
  /**
   * Record of cells indexed by "rowId-columnId" string keys for efficient lookup
   * Example: cells["1-2"] would give you the cell at row 1, column 2
   */
  cells: Record<string, VTableCellObject>;
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
