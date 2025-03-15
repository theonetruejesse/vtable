"use client";

import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type OnChangeFn,
  type ColumnOrderState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table";
import { flexRender } from "@tanstack/react-table";

interface BaseColumnProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  columnOrder?: string[];
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
}

export function BaseColumn<TData>({
  data,
  columns,
  columnOrder,
  onColumnOrderChange,
}: BaseColumnProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange,
    state: {
      columnOrder,
    },
  });

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-md border">
      <div className="overflow-x-auto">
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
