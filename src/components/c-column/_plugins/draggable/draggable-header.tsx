"use client";

import { useState, type CSSProperties } from "react";
import { flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableHead } from "~/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { GripVertical } from "lucide-react";
import { type DraggableHeaderProps } from "./draggable-types";

export function DraggableHeader<TData, TValue>({
  header,
}: DraggableHeaderProps<TData, TValue>) {
  const [open, setOpen] = useState(false);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      colSpan={header.colSpan}
      className="group relative transition-colors hover:bg-muted/50"
    >
      <div className="flex h-full items-center">
        {/* Drag Handle - Left side */}
        <div
          className="absolute bottom-0 left-0 top-0 flex w-8 cursor-grab items-center justify-center"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Clickable Content - Center/Right */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className="ml-8 py-2 text-left focus:outline-none"
              onClick={() => setOpen(true)}
              type="button"
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              <h4 className="font-medium">
                Column: {String(header.column.columnDef.header)}
              </h4>
              <p className="text-sm text-muted-foreground">
                You can customize this popover with column-specific actions.
              </p>
              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground">
                  Use the grip handle on the left to drag and reorder columns.
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isDragging && (
        <div className="pointer-events-none absolute inset-0 rounded border-2 border-primary bg-primary/10" />
      )}
    </TableHead>
  );
}
