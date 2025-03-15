import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  type DraggableContextValue,
  type DraggableProviderProps,
} from "./draggable-types";
import { OnChangeFn, ColumnOrderState } from "@tanstack/react-table";

// Create a context for draggable functionality
const DraggableContext = createContext<DraggableContextValue | null>(null);

// Custom hook to use the draggable context
export function useDraggable() {
  const context = useContext(DraggableContext);

  if (!context) {
    throw new Error("useDraggable must be used within a DraggableProvider");
  }

  return context;
}

// Provider component for draggable functionality
export function DraggableProvider({ table, children }: DraggableProviderProps) {
  // Track dragging state
  const [isDragging, setIsDragging] = useState(false);

  // Set up sensors for drag and drop
  const sensors = useSensors(
    // Require a minimal distance to start dragging
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    // Require a minimal distance to start dragging
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {}),
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setIsDragging(true);

      // Ensure any resize operations are stopped
      if (table.getState().columnSizingInfo.isResizingColumn) {
        table.setColumnSizingInfo({
          startOffset: null,
          startSize: null,
          deltaOffset: null,
          deltaPercentage: null,
          isResizingColumn: false,
          columnSizingStart: [],
        });
      }
    },
    [table],
  );

  // Reorder columns after drag & drop
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsDragging(false);
      console.log("Drag end event:", event);

      const { active, over } = event;

      if (active && over && active.id !== over.id) {
        console.log(`Reordering: moving ${active.id} over ${over.id}`);

        // Get the current column order
        let currentOrder = table.getState().columnOrder;

        // If currentOrder is empty, get it from the table columns
        if (!currentOrder || currentOrder.length === 0) {
          currentOrder = table
            .getAllColumns()
            .map((col) => col.id)
            .filter((id): id is string => id !== undefined);

          console.log("Created column order from table columns:", currentOrder);
        }

        // Convert IDs to strings for consistency
        const activeId = String(active.id);
        const overId = String(over.id);

        // Find positions
        const oldIndex = currentOrder.indexOf(activeId);
        const newIndex = currentOrder.indexOf(overId);

        console.log(`Moving from index ${oldIndex} to ${newIndex}`);

        // Only reorder if we found valid positions
        if (oldIndex !== -1 && newIndex !== -1) {
          // Create new array with reordered items
          const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
          console.log("Setting new column order:", newOrder);

          // Directly set the new column order
          table.setColumnOrder(newOrder);

          // Verify the table state after update
          setTimeout(() => {
            console.log("State after reorder:", table.getState().columnOrder);
          }, 0);
        }
      } else {
        console.log("No reordering needed or invalid drag operation");
      }
    },
    [table],
  );

  // Get the current column order from the table
  const columnOrder = React.useMemo(() => {
    // Use the existing column order if available, otherwise get it from leaf columns
    return (
      table.getState().columnOrder ||
      table.getAllLeafColumns().map((col) => col.id)
    );
  }, [table]);

  // Create a compatible onColumnOrderChange handler
  const onColumnOrderChange: OnChangeFn<ColumnOrderState> = useCallback(
    (updaterOrValue) => {
      table.setColumnOrder(updaterOrValue);
    },
    [table],
  );

  // Create context value
  const value = React.useMemo<DraggableContextValue>(
    () => ({
      columnOrder,
      onColumnOrderChange,
      onDragEnd: handleDragEnd,
      onDragStart: handleDragStart,
      sensors,
      isDragging,
    }),
    [
      columnOrder,
      onColumnOrderChange,
      handleDragStart,
      handleDragEnd,
      sensors,
      isDragging,
    ],
  );

  return (
    <DraggableContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </DraggableContext.Provider>
  );
}
