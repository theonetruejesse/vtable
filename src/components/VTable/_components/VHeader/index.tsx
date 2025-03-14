import { flexRender } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { TableHeader, TableRow, TableHead } from "~/components/ui/table";
import { Plus } from "lucide-react";
import { type Header } from "@tanstack/react-table";

import { useColumnResize } from "./resize-hook";
import { cn } from "~/lib/utils";
import type { VTableRowData, VTable } from "~/components/VTable/vtable.types";

export interface VHeaderProps {
  table: VTable;
  onResize?: (header: Header<VTableRowData, unknown>) => (e: any) => void;
}

export const VHeader = ({ table, onResize }: VHeaderProps) => {
  // Always use the internal resize hook for consistency
  const { handleResizeStart } = useColumnResize(table);

  return (
    <TableHeader className="border-none">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="border-none">
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              data-column-id={header.column.id}
              style={{
                width: header.getSize() ? `${header.getSize()}px` : "150px",
                minWidth: header.getSize() ? `${header.getSize()}px` : "150px",
                maxWidth: header.getSize() ? `${header.getSize()}px` : "150px",
              }}
              className={cn(
                "relative border-none px-4 py-2 text-left font-medium transition-colors hover:bg-muted",
              )}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              {/* Column resizer handle */}
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
          <TableHead className="w-[50px] border-none">
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
