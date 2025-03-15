import React from "react";
import { type Header } from "@tanstack/react-table";
import { ResizeHandle } from "../resizable/resizable-handle";
import { DraggableHeader } from "./draggable-header";

interface DraggableResizableHeaderProps {
  header: Header<any, unknown>;
  children?: React.ReactNode;
}

/**
 * A header component that combines both draggable and resizable functionality.
 * This creates a draggable header that also has a resize handle.
 */
export function DraggableResizableHeader({
  header,
  children,
}: DraggableResizableHeaderProps) {
  return (
    <DraggableHeader header={header}>
      <ResizeHandle header={header} />
      {children}
    </DraggableHeader>
  );
}
