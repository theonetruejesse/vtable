import React from "react";
import { Button } from "~/components/ui/button";
import { TableHeader, TableRow, TableHead } from "~/components/ui/table";
import { Plus } from "lucide-react";
import { type VTable } from "../../vtable-types";
import { ResizableHeader } from "../../_plugins/resizable";

type VColumnsProps = {
  table: VTable;
};

export const VColumns = React.memo(
  ({ table }: VColumnsProps) => {
    // Calculate the total width of all columns
    const totalTableWidth = React.useMemo(() => {
      return table.getTotalSize();
    }, [table]);

    return (
      <TableHeader className="border-none">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-none">
            {headerGroup.headers.map((header) => (
              // Use ResizableHeader from the plugin
              <ResizableHeader key={header.id} header={header} />
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
  },
  // Custom equality function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    // Only re-render if column sizing or visibility has changed
    if (
      prevProps.table.getState().columnSizing !==
      nextProps.table.getState().columnSizing
    ) {
      return false;
    }

    // Check if columns have changed
    if (
      prevProps.table.getAllColumns().length !==
      nextProps.table.getAllColumns().length
    ) {
      return false;
    }

    // If we're currently resizing, allow renders
    if (
      prevProps.table.getState().columnSizingInfo.isResizingColumn ||
      nextProps.table.getState().columnSizingInfo.isResizingColumn
    ) {
      return false;
    }

    // Default to preventing re-render
    return true;
  },
);
