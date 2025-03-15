import React from "react";
import { useDraggable } from "./draggable-context";

/**
 * Hook to get the current column order
 */
export function useColumnOrder() {
  const { columnOrder } = useDraggable();
  return columnOrder;
}

/**
 * Hook to optimize renders during dragging
 */
export function useDragOptimizer<T>(value: T): T {
  const { isDragging } = useDraggable();
  const valueRef = React.useRef(value);

  // Only update the ref if we're not currently dragging
  if (!isDragging) {
    valueRef.current = value;
  }

  return valueRef.current;
}
