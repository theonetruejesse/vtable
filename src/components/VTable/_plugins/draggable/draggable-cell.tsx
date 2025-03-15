import React, { type CSSProperties, useEffect, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell } from "~/components/ui/table";
import { type DraggableCellProps } from "./draggable-types";

export function DraggableCell({ cell }: DraggableCellProps) {
  // Add a flag to track client-side hydration
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure we have a valid string ID for the sortable component
  const cellId = React.useMemo(() => {
    return cell.column.id || `cell-${cell.id}`;
  }, [cell]);

  const { isDragging, setNodeRef, transform, active } = useSortable({
    id: cellId,
  });

  // Log when a cell starts or stops dragging - only on client
  useEffect(() => {
    if (isClient && isDragging) {
      console.log(`Cell ${cellId} is dragging`);
    }
  }, [isClient, isDragging, cellId]);

  // Log transform changes for debugging - only on client
  useEffect(() => {
    if (isClient && transform) {
      console.log(`Cell ${cellId} transform:`, transform);
    }
  }, [isClient, transform, cellId]);

  // Only apply dynamic styles on the client side
  const style: CSSProperties = isClient
    ? {
        opacity: isDragging ? 0.8 : 1,
        position: "relative",
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? "none" : "width transform 0.2s ease-in-out", // Remove transition during drag
        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
        zIndex: isDragging ? 999 : 1, // Higher z-index for dragged cells, but 1 for others to maintain stacking context
        backgroundColor: isDragging ? "rgba(255, 255, 255, 0.95)" : "inherit", // Highlight dragged cells
        boxShadow: isDragging ? "0 0 10px rgba(0, 0, 0, 0.15)" : "none", // Add shadow to dragged cells
      }
    : {
        position: "relative",
        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
      };

  // Render a simplified version during server-side rendering
  if (!isClient) {
    return (
      <TableCell
        data-column-id={cell.column.id}
        style={style}
        className="truncate border-r border-gray-200 px-4 py-2 text-left last:border-r-0"
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    );
  }

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging ? "true" : "false"} // Add data attribute for debugging
      data-column-id={cell.column.id} // Add column ID for debugging
      className="truncate border-r border-gray-200 px-4 py-2 text-left last:border-r-0"
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}

      {/* Visual indicator for dragging - without borders */}
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 bg-primary/5" />
      )}
    </TableCell>
  );
}
