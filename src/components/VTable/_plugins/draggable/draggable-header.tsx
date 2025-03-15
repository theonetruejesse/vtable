import React, { useState, type CSSProperties, useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableHead } from "~/components/ui/table";
import { GripVertical } from "lucide-react";
import { cn } from "~/lib/utils";
import { type DraggableHeaderProps } from "./draggable-types";

export function DraggableHeader({ header, children }: DraggableHeaderProps) {
  // Add a flag to track client-side hydration
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure we have a valid string ID for the sortable component
  const headerId = React.useMemo(() => {
    return header.column.id || `header-${header.id}`;
  }, [header]);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: headerId,
    });

  // Only apply dynamic styles on the client side
  const style: CSSProperties = isClient
    ? {
        opacity: isDragging ? 0.8 : 1,
        position: "relative",
        transform: CSS.Translate.toString(transform),
        transition: "width transform 0.2s ease-in-out",
        width: `calc(var(--header-${header.id}-size) * 1px)`,
      }
    : {
        position: "relative",
        width: `calc(var(--header-${header.id}-size) * 1px)`,
      };

  // Render a simplified version during server-side rendering
  if (!isClient) {
    return (
      <TableHead
        data-column-id={header.column.id}
        style={style}
        className="relative select-none border-r border-gray-300 px-4 py-2 text-left font-medium transition-colors hover:bg-muted"
      >
        <div className="flex h-full items-center">
          {/* Static drag handle placeholder during SSR */}
          <div className="absolute bottom-0 left-0 top-0 flex w-6 items-center justify-center opacity-75">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Header Content with left padding for handle */}
          <div className="ml-6 flex-1">
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </div>
        </div>

        {/* Children without interactive elements during SSR */}
        {children}
      </TableHead>
    );
  }

  return (
    <TableHead
      ref={setNodeRef}
      data-column-id={header.column.id}
      style={style}
      className="relative select-none border-r border-gray-300 px-4 py-2 text-left font-medium transition-colors hover:bg-muted"
    >
      <div className="flex h-full items-center">
        {/* Drag Handle */}
        <div
          className={cn(
            "absolute bottom-0 left-0 top-0 flex w-6 cursor-grab items-center justify-center",
            isDragging ? "opacity-0" : "opacity-75 hover:opacity-100",
          )}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Header Content with left padding for handle */}
        <div className="ml-6 flex-1">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </div>
      </div>

      {/* Additional content (like resize handle) */}
      {children}

      {/* Visual indicator for dragging - removed the border class */}
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 rounded bg-primary/5" />
      )}
    </TableHead>
  );
}
