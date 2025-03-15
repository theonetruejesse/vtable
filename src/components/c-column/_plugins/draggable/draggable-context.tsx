import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  DragEndEvent,
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

// Updated provider props to support render props pattern
interface ProviderProps {
  columns: DraggableProviderProps["columns"];
  children: ReactNode | ((contextValue: DraggableContextValue) => ReactNode);
}

// Provider component for draggable functionality
export function DraggableProvider({ columns, children }: ProviderProps) {
  // Initialize column order from column definitions
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map((c) => c.id!),
  );

  // Reorder columns after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  }

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // Create a compatible onColumnOrderChange handler
  const onColumnOrderChange: OnChangeFn<ColumnOrderState> = (
    updaterOrValue,
  ) => {
    if (typeof updaterOrValue === "function") {
      setColumnOrder(updaterOrValue(columnOrder) as string[]);
    } else {
      setColumnOrder(updaterOrValue as string[]);
    }
  };

  // Create context value
  const value = React.useMemo<DraggableContextValue>(
    () => ({
      columnOrder,
      onColumnOrderChange,
      onDragEnd: handleDragEnd,
      sensors,
    }),
    [columnOrder],
  );

  return (
    <DraggableContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </DraggableContext.Provider>
  );
}
