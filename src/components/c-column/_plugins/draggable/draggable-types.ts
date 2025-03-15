import { DragEndEvent, SensorDescriptor, SensorOptions } from "@dnd-kit/core";
import {
  Cell,
  ColumnDef,
  Header,
  OnChangeFn,
  ColumnOrderState,
} from "@tanstack/react-table";

// Types for the draggable header and cell props
export interface DraggableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
}

export interface DraggableCellProps<TData, TValue> {
  cell: Cell<TData, TValue>;
}

// Types for the drag context
export interface DraggableContextValue {
  // State
  columnOrder: string[];

  // Actions
  onColumnOrderChange: OnChangeFn<ColumnOrderState>;
  onDragEnd: (event: DragEndEvent) => void;

  // Sensors for drag and drop
  sensors: SensorDescriptor<SensorOptions>[];
}

// Props for the draggable provider
export interface DraggableProviderProps {
  columns: ColumnDef<any, any>[];
  children: React.ReactNode;
}
