import React, { useMemo } from "react";
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
import { useIsClient } from "../../utils/is-client-hook";

interface VColumnsProps {
  table: VTable;
}

// Helper function to calculate valid column order
const getValidColumnOrder = (table: VTable) => {
  const currentTableOrder = table.getState().columnOrder;
  if (currentTableOrder && currentTableOrder.length > 0) {
    return currentTableOrder.filter(Boolean);
  }
  return table
    .getAllLeafColumns()
    .filter((column) => column.id)
    .map((column) => column.id);
};

// Main Component
export const VColumns = React.memo(
  ({ table }: VColumnsProps) => {
    const isClient = useIsClient();
    const { columnOrder } = useDraggable();

    // Memoize valid column order
    const validColumnOrder = useMemo(
      () => getValidColumnOrder(table),
      [table, columnOrder],
    );

    // Render the table header
    return (
      <>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-none">
            {/* Conditionally render SortableContext and DraggableResizableHeader */}
            {isClient ? (
              <SortableContext
                items={validColumnOrder}
                strategy={horizontalListSortingStrategy}
              >
                {headerGroup.headers.map((header) => (
                  <DraggableResizableHeader key={header.id} header={header} />
                ))}
              </SortableContext>
            ) : (
              // Render static headers during SSR
              headerGroup.headers.map((header) => (
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
              ))
            )}
            {/* Add column button */}
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
      </>
    );
  },
  // Custom equality function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    const prevState = prevProps.table.getState();
    const nextState = nextProps.table.getState();

    // Only re-render if column sizing, order, or visibility has changed
    return (
      prevState.columnSizing === nextState.columnSizing &&
      prevState.columnOrder === nextState.columnOrder &&
      prevProps.table.getAllColumns().length ===
        nextProps.table.getAllColumns().length &&
      !prevState.columnSizingInfo.isResizingColumn &&
      !nextState.columnSizingInfo.isResizingColumn
    );
  },
);
