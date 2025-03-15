"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

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
import { VRows } from "./_components/VRows";

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

  // Initialize column order state
  const [initialColumnOrder, setInitialColumnOrder] = useState<string[]>([]);

  // Initialize column order once we have table columns
  useEffect(() => {
    if (tableColumns.length > 0 && initialColumnOrder.length === 0) {
      const columnIds = tableColumns
        .map((col) => col.id)
        .filter((id): id is string => id !== undefined);
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
                <TableHeader className="border-none">
                  <VColumns table={table} />
                </TableHeader>
                <TableBody>
                  <VRows table={table} />
                </TableBody>
              </Table>
            </DndContext>
          )}
        </DraggableProvider>
      </ResizableProvider>
      <ResizableDebugger debugInfo={debugInfo} />
    </div>
  );
}
