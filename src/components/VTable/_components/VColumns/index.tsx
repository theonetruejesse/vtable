import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { TableHeader, TableRow, TableHead } from "~/components/ui/table";
import { Plus } from "lucide-react";
import { type VTable } from "../../vtable-types";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { flexRender } from "@tanstack/react-table";
import {
  DraggableResizableHeader,
  useDraggable,
} from "../../_plugins/draggable";

type VColumnsProps = {
  table: VTable;
};

export const VColumns = React.memo(
  ({ table }: VColumnsProps) => {
    // Add a flag to track client-side hydration
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true after hydration
    useEffect(() => {
      setIsClient(true);
    }, []);

    // Get draggable context
    const { columnOrder, isDragging } = useDraggable();

    // Log column order and dragging state - only on client
    useEffect(() => {
      if (isClient) {
        console.log("VColumns rendering with column order:", columnOrder);
        console.log("Table column order state:", table.getState().columnOrder);
        console.log("isDragging:", isDragging);
      }
    }, [isClient, columnOrder, table, isDragging]);

    // Calculate the total width of all columns
    const totalTableWidth = React.useMemo(() => {
      return table.getTotalSize();
    }, [table]);

    // Ensure we never have undefined values in columnOrder and always use the latest table state
    const validColumnOrder = React.useMemo(() => {
      // Always use the latest column order from the table state
      const currentTableOrder = table.getState().columnOrder;

      // Log what we're using for ordering - only on client
      if (isClient) {
        console.log(
          "VColumns using column order:",
          currentTableOrder,
          currentTableOrder?.length,
        );
      }

      // Use table state if available, otherwise fall back to leaf columns
      if (currentTableOrder && currentTableOrder.length > 0) {
        // Filter out any undefined values for safety
        return currentTableOrder.filter(Boolean);
      }

      // Always use non-null column IDs from the current table state to ensure consistency
      // between server and client rendering
      const leafColumnIds = table
        .getAllLeafColumns()
        .filter((column) => column.id)
        .map((column) => column.id);

      if (isClient) {
        console.log("Falling back to leaf column IDs:", leafColumnIds);
      }

      return leafColumnIds;
    }, [isClient, table, table.getState().columnOrder]); // Explicitly depend on columnOrder

    // Render a simplified version during server-side rendering
    if (!isClient) {
      return (
        <TableHeader className="border-none">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none">
              {/* Render static headers during SSR */}
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  data-column-id={header.column.id}
                  className="relative select-none border-r border-gray-300 px-4 py-2 text-left font-medium"
                  style={{
                    width: `calc(var(--header-${header.id}-size) * 1px)`,
                  }}
                >
                  <div className="flex h-full items-center">
                    <div className="ml-6 flex-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </div>
                  </div>
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
    }

    return (
      <TableHeader className="border-none">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-none">
            <SortableContext
              items={validColumnOrder}
              strategy={horizontalListSortingStrategy}
            >
              {headerGroup.headers.map((header) => (
                // Use the combined DraggableResizableHeader
                <DraggableResizableHeader key={header.id} header={header} />
              ))}
            </SortableContext>
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

    // Check if column order has changed
    if (
      prevProps.table.getState().columnOrder !==
      nextProps.table.getState().columnOrder
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
