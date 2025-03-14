"use client";

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";

import { VColumns } from "./_components/VColumns";
import { useVTableQuery } from "./query-hook";
import {
  ResizeDebugger,
  type DebugResizeInfo,
} from "./_components/VColumns/resize-hook";

export function VTable({ id }: { id: number }) {
  const { tableInfo, tableData, tableColumns, isLoading, error } =
    useVTableQuery(id);

  // State to store resize debug info from VColumns
  const [debugInfo, setDebugInfo] = React.useState<DebugResizeInfo>({
    phase: "idle",
    targetColumn: null,
    oldWidth: 0,
    newWidth: 0,
  });

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugAll: process.env.NODE_ENV === "development",
    columnResizeMode: "onChange",
    defaultColumn: {
      size: 200,
      minSize: 120,
    },
  });

  if (!table) return null;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full overflow-auto">
      {tableInfo && (
        <div className="my-4 flex items-center justify-center">
          <h1 className="text-2xl font-bold">{tableInfo.name}</h1>
        </div>
      )}
      <div className="relative w-full min-w-[800px]">
        <Table
          className="w-full table-fixed border-collapse"
          style={{
            width:
              table.getTotalSize() > 800 ? `${table.getTotalSize()}px` : "100%",
          }}
        >
          <VColumns table={table} onDebugUpdate={setDebugInfo} />
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-t border-gray-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="truncate border-r border-gray-200 px-4 py-2 text-left last:border-r-0"
                      style={{
                        width: `${cell.column.getSize()}px`,
                        minWidth: `${cell.column.getSize()}px`,
                        maxWidth: `${cell.column.getSize()}px`,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="w-full"></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Render the resize debugger if in development mode */}
      {process.env.NODE_ENV === "development" && (
        <ResizeDebugger debugInfo={debugInfo} />
      )}
    </div>
  );
}
