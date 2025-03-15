"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { VColumns } from "./_components/VColumns";
import { useVTableQuery } from "./query-hook";
import { VTableSkeleton } from "./vtable-skeleton";
import {
  ResizableProvider,
  ResizableDebugger,
  type DebugResizeInfo,
} from "./_plugins/resizable";
import {
  DraggableProvider,
  DraggableCell,
  type DraggableContextValue,
} from "./_plugins/draggable";

export function VTable({ id }: { id: number }) {
  return (
    <Suspense fallback={<VTableSkeleton />}>
      <VTableContent id={id} />
    </Suspense>
  );
}

// Component that handles the data fetching and rendering
function VTableContent({ id }: { id: number }) {
  // Add a flag to track client-side hydration
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { tableInfo, tableData, tableColumns, error } = useVTableQuery(id);

  // Initialize column order state
  const [initialColumnOrder, setInitialColumnOrder] = useState<string[]>([]);

  // Initialize column order once we have table columns
  useEffect(() => {
    if (tableColumns.length > 0 && initialColumnOrder.length === 0) {
      const columnIds = tableColumns
        .map((col) => col.id)
        .filter((id): id is string => id !== undefined);
      console.log("Setting initial column order:", columnIds);
      setInitialColumnOrder(columnIds);
    }
  }, [tableColumns]);

  // State to store resize debug info
  const [debugInfo, setDebugInfo] = React.useState<DebugResizeInfo>({
    phase: "idle",
    targetColumn: null,
    oldWidth: 0,
    newWidth: 0,
  });

  // State to track column order changes
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  // Update local columnOrder state when table column order changes
  const onColumnOrderChange = useCallback(
    (updaterOrValue: any) => {
      // Handle both direct values and updater functions
      const newOrder =
        typeof updaterOrValue === "function"
          ? updaterOrValue(columnOrder)
          : updaterOrValue;

      console.log("Column order changed to:", newOrder);
      setColumnOrder(newOrder);
    },
    [columnOrder],
  );

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
    state: {
      columnOrder: columnOrder.length > 0 ? columnOrder : initialColumnOrder,
    },
    onColumnOrderChange: onColumnOrderChange,
  });

  if (!table) return null;
  if (error) return <div>Error: {error.message}</div>;

  // Console logging should only happen on client side
  useEffect(() => {
    if (isClient) {
      console.log("VTable rendering with table:", table);
    }
  }, [isClient, table]);

  return (
    <div className="w-full overflow-auto">
      {tableInfo && (
        <div className="my-4 flex items-center justify-center">
          <h1 className="text-2xl font-bold">{tableInfo.name}</h1>
        </div>
      )}

      {/* Apply both plugins by nesting providers */}
      <ResizableProvider table={table} onDebugUpdate={setDebugInfo}>
        <DraggableProvider table={table}>
          {(draggableContext: DraggableContextValue) => (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
              onDragStart={draggableContext.onDragStart}
              onDragEnd={draggableContext.onDragEnd}
              sensors={draggableContext.sensors}
            >
              <Table className="w-full table-fixed border-collapse">
                <VColumns table={table} />

                {/* Table body with sortable context */}
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row: any) => {
                      // Log row rendering for debugging - only on client side
                      if (isClient) {
                        console.log(
                          `Rendering row ${row.id} with columns:`,
                          table.getState().columnOrder || "default order",
                        );
                      }

                      return (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="border-t border-gray-200"
                        >
                          {/* Use the table's current column order for SortableContext */}
                          <SortableContext
                            items={
                              table.getState().columnOrder?.length > 0
                                ? table.getState().columnOrder
                                : table
                                    .getAllLeafColumns()
                                    .filter((column) => column.id)
                                    .map((column) => column.id)
                            }
                            strategy={horizontalListSortingStrategy}
                          >
                            {row.getVisibleCells().map((cell: any) => (
                              <DraggableCell key={cell.id} cell={cell} />
                            ))}
                          </SortableContext>
                          <TableCell className="w-full"></TableCell>
                        </TableRow>
                      );
                    })
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
              </Table>
            </DndContext>
          )}
        </DraggableProvider>
      </ResizableProvider>

      {/* Render the resize debugger if in development mode and on client side */}
      {isClient && process.env.NODE_ENV === "development" && (
        <ResizableDebugger debugInfo={debugInfo} />
      )}
    </div>
  );
}
