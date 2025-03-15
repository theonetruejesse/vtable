"use client";

import React, { Suspense } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";

import { VColumns } from "./_components/VColumns";
import { useVTableQuery } from "./query-hook";
import { VTableSkeleton } from "./vtable-skeleton";
import {
  ResizableProvider,
  ResizableDebugger,
  type DebugResizeInfo,
} from "./_plugins/resizable";

export function VTable({ id }: { id: number }) {
  return (
    <Suspense fallback={<VTableSkeleton />}>
      <VTableContent id={id} />
    </Suspense>
  );
}

// Component that handles the data fetching and rendering
function VTableContent({ id }: { id: number }) {
  const { tableInfo, tableData, tableColumns, error } = useVTableQuery(id);

  // State to store resize debug info
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
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full overflow-auto">
      {tableInfo && (
        <div className="my-4 flex items-center justify-center">
          <h1 className="text-2xl font-bold">{tableInfo.name}</h1>
        </div>
      )}
      <ResizableProvider table={table} onDebugUpdate={setDebugInfo}>
        <Table className="w-full table-fixed border-collapse">
          <VColumns table={table} />

          {/* Use memoized table body during resizing operations */}
          {table.getState().columnSizingInfo.isResizingColumn ? (
            <MemoizedTableBodyContent table={table} />
          ) : (
            <TableBodyContent table={table} />
          )}
        </Table>
      </ResizableProvider>

      {/* Render the resize debugger if in development mode */}
      {process.env.NODE_ENV === "development" && (
        <ResizableDebugger debugInfo={debugInfo} />
      )}
    </div>
  );
}

// Table body component
function TableBodyContent({ table }: { table: any }) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: any) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="border-t border-gray-200"
          >
            {row.getVisibleCells().map((cell: any) => (
              <TableCell
                key={cell.id}
                className="truncate border-r border-gray-200 px-4 py-2 text-left last:border-r-0"
                style={{
                  width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
            <TableCell className="w-full"></TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length + 1}
            className="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}

// Memoized version of the table body for use during resizing
export const MemoizedTableBodyContent = React.memo(
  TableBodyContent,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBodyContent;
