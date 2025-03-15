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

import {
  DraggableProvider,
  DraggableHeader,
  DraggableCell,
  type DraggableContextValue,
} from "./_plugins/draggable";
import { Table, TableBody, TableHeader, TableRow } from "~/components/ui/table";
import { columns, data } from "./data";

export const CColumnReorder = () => {
  return (
    <DraggableProvider columns={columns}>
      {({
        columnOrder,
        onColumnOrderChange,
        onDragEnd,
        sensors,
      }: DraggableContextValue) => {
        // Create the table inside the render props function to have access to columnOrder
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
                            <DraggableHeader key={header.id} header={header} />
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
      }}
    </DraggableProvider>
  );
};
