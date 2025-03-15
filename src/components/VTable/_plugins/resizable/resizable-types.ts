import { type Table, type Header } from "@tanstack/react-table";
import { type VTable } from "../../vtable-types";

// Type for column resizing info
export type ColumnResizingInfo = {
  columnId: string | null;
  deltaOffset: number;
  startWidth: number;
};

// Type for debug state
export type DebugResizeInfo = {
  phase: "idle" | "start" | "move" | "end";
  targetColumn: string | null;
  oldWidth: number;
  newWidth: number;
};

// Props for the ResizableHeader component
export type ResizableHeaderProps = {
  header: Header<any, unknown>;
  children?: React.ReactNode;
};

// Props for the ResizeHandle component
export type ResizeHandleProps = {
  header: Header<any, unknown>;
};
