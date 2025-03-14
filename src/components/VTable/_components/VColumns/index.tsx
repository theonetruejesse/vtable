import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { TableHeader, TableRow, TableHead } from "~/components/ui/table";
import { Plus } from "lucide-react";
import { type VTable } from "../../vtable-types";
import { useColumnResize, type DebugResizeInfo } from "./resize-hook";
import { ResizableHeader } from "./ResizableHeader";

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
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <ResizableHeader
              key={header.id}
              header={header}
              onResize={handleResizeStart}
            />
          ))}
          <TableHead className="w-full border-l">
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
