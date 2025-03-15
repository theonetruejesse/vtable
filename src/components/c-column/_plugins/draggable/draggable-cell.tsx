"use client";

import type { CSSProperties } from "react";
import { flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell } from "~/components/ui/table";
import { type DraggableCellProps } from "./draggable-types";

export function DraggableCell<TData, TValue>({
  cell,
}: DraggableCellProps<TData, TValue>) {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      className={isDragging ? "bg-primary/5" : ""}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}
