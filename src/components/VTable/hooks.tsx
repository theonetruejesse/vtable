import { useMemo } from "react";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import { api } from "~/trpc/react";
import { type AssembledVTable, v_column_type } from "~/server/api/types";

// Define a type for the table row data
export type VTableRowData = {
  id: number;
  [key: `col-${number}`]: string;
};

// Custom hook to create and configure the table
export const useVTable = (id: number) => {
  const { data, error, isLoading } = useVTableData(id);
  const { tableData, tableColumns } = useVTableTransform(data);

  // Initialize TanStack Table with proper types
  const table = useReactTable<VTableRowData>({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    table,
    tableColumns,
    isLoading,
    error,
    data,
  };
};

const useVTableData = (id: number) => {
  const [data, { error, isLoading }] = api.vtable.getTable.useSuspenseQuery({
    id,
  });
  return { data, error, isLoading };
};

// Custom hook to transform table data and create columns
const useVTableTransform = (data: AssembledVTable | null | undefined) => {
  // Transform the data into a format that TanStack Table can use
  const tableData = useMemo<VTableRowData[]>(() => {
    if (!data) return [];

    return data.rows.map((row) => {
      const rowData: VTableRowData = { id: row.id };

      data.columns.forEach((column) => {
        const cellKey = `${row.id}-${column.id}`;
        const cell = data.cells[cellKey];
        rowData[`col-${column.id}`] = cell?.value || "";
      });

      return rowData;
    });
  }, [data]);

  // Define columns for TanStack Table with proper types
  const tableColumns = useMemo<ColumnDef<VTableRowData>[]>(() => {
    if (!data) return [];

    return data.columns.map((column) => ({
      accessorKey: `col-${column.id}`,
      header: column.name,
      cell: ({ row, column: tableColumn }) => {
        const value = row.getValue(tableColumn.id) as string;
        return renderCellValue(value, column.type as v_column_type);
      },
    }));
  }, [data]);

  return { tableData, tableColumns };
};

// Cell renderer based on column type
const renderCellValue = (value: string, type: v_column_type) => {
  switch (type) {
    case v_column_type.date:
      try {
        return DateTime.fromISO(value).toLocaleString(DateTime.DATE_MED);
      } catch (e) {
        return value;
      }
    case v_column_type.number:
      return Number.parseFloat(value).toLocaleString();
    default:
      return value;
  }
};
