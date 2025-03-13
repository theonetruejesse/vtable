"use client";

import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import { AssembledVTable } from "~/server/api/routers/vtable/service/vtable.service.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// Cell renderer based on column type
const renderCellValue = (value: string, type: string) => {
  switch (type) {
    case "date":
      try {
        return DateTime.fromISO(value).toLocaleString(DateTime.DATE_MED);
      } catch (e) {
        return value;
      }
    case "number":
      return Number.parseFloat(value).toLocaleString();
    default:
      return value;
  }
};

export function VTable({ data }: { data: AssembledVTable }) {
  // Transform the data into a format that TanStack Table can use
  const tableData = useMemo(() => {
    return data.rows.map((row) => {
      const rowData: Record<string, any> = { id: row.id };

      data.columns.forEach((column) => {
        const cellKey = `${row.id}-${column.id}`;
        const cell = data.cells[cellKey];
        rowData[`col-${column.id}`] = cell?.value || "";
      });

      return rowData;
    });
  }, [data]);

  // Define columns for TanStack Table
  const tableColumns = useMemo<ColumnDef<any>[]>(() => {
    return data.columns.map((column) => ({
      accessorKey: `col-${column.id}`,
      header: column.name,
      cell: ({ row, column: tableColumn }) => {
        const value = row.getValue(tableColumn.id) as string;
        return renderCellValue(value, column.type);
      },
    }));
  }, [data.columns]);

  // Initialize TanStack Table
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={tableColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
