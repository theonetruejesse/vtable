import React from "react";
import { Button } from "~/components/ui/button";
import { TableHeader, TableRow, TableHead } from "~/components/ui/table";
import { Plus } from "lucide-react";
import { type VTable } from "../../vtable-types";
import { useColumnResize, type DebugResizeInfo } from "./resize-hook";
import { flexRender } from "@tanstack/react-table";
import { cn } from "~/lib/utils";

type VColumnsProps = {
  table: VTable;
  onDebugUpdate?: (debugInfo: DebugResizeInfo) => void;
};

export const VColumns = ({ table, onDebugUpdate }: VColumnsProps) => {
  // Use the column resize hook to manage resizing logic
  const { handleResizeStart, debugResize } = useColumnResize(table);

  // Calculate the total width of all columns
  const totalTableWidth = React.useMemo(() => {
    return table.getTotalSize();
  }, [table]);

  // Pass debug info to parent component whenever it changes
  React.useEffect(() => {
    if (onDebugUpdate) {
      onDebugUpdate(debugResize);
    }
  }, [debugResize, onDebugUpdate]);

  return (
    <TableHeader className="border-none">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="border-none">
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              data-column-id={header.column.id}
              style={{
                width: `${header.getSize()}px`,
              }}
              className={
                "relative select-none border-r border-gray-300 px-4 py-2 text-left font-medium transition-colors hover:bg-muted"
              }
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              {/* Resize handle */}
              <div
                onDoubleClick={() => header.column.resetSize()}
                onPointerDown={handleResizeStart(header)}
                className={cn(
                  "absolute right-0 top-0 z-10 h-full w-[5px] cursor-col-resize touch-none select-none bg-transparent opacity-100",
                  header.column.getIsResizing()
                    ? "bg-blue-500"
                    : "hover:bg-blue-500",
                )}
                style={{
                  transform: "translateX(50%)",
                }}
              />
            </TableHead>
          ))}
          <TableHead className="w-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Add column"
              aria-label="Add column"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      ))}
    </TableHeader>
  );
};
