import {
  DragEndEvent,
  DragStartEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import {
  Cell,
  ColumnDef,
  Header,
  OnChangeFn,
  ColumnOrderState,
} from "@tanstack/react-table";
import { type VTable } from "../../vtable-types";

// Types for the draggable header and cell props
export interface DraggableHeaderProps {
  header: Header<any, unknown>;
  children?: React.ReactNode;
}

export interface DraggableCellProps {
  cell: Cell<any, unknown>;
}

// Types for the drag context
export interface DraggableContextValue {
  // State
  columnOrder: string[];

  // Actions
  onColumnOrderChange: OnChangeFn<ColumnOrderState>;
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart: (event: DragStartEvent) => void;

  // Sensors for drag and drop
  sensors: SensorDescriptor<SensorOptions>[];

  // Is currently dragging
  isDragging: boolean;
}

// Props for the draggable provider
export interface DraggableProviderProps {
  table: VTable;
  children:
    | React.ReactNode
    | ((context: DraggableContextValue) => React.ReactNode);
}

// Module augmentation for plugin system (future expandability)
declare module "../../vtable-types" {
  interface VTablePlugins {
    draggable?: boolean;
  }
}
