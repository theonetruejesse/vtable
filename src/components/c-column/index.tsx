"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { DraggableTableHeader } from "./draggable-header";
import { DraggableCell } from "./draggable-cell";
import { Table, TableBody, TableHeader, TableRow } from "../ui/table";
import { columns, data } from "./data";
import { useDragHooks } from "./drag-hooks";

export const CColumnReorder = () => {
  const { columnOrder, onColumnOrderChange, onDragEnd, sensors } =
    useDragHooks(columns);

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
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <div className="mx-auto max-w-4xl overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableTableHeader key={header.id} header={header} />
                    ))}
                  </SortableContext>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <DraggableCell key={cell.id} cell={cell} />
                    ))}
                  </SortableContext>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DndContext>
  );
};
