import React from "react";
import { useResizable } from "./resizable-context";
import { type DebugResizeInfo } from "./resizable-types";

// Hook to track the resizing state changes
export function useResizeTracker(
  onDebugUpdate?: (debugInfo: DebugResizeInfo) => void,
) {
  const { debugResize } = useResizable();

  // Forward debug info to parent component whenever it changes
  React.useEffect(() => {
    if (onDebugUpdate) {
      onDebugUpdate(debugResize);
    }
  }, [debugResize, onDebugUpdate]);

  return debugResize;
}

// Hook to get the column width for a specific column
export function useColumnWidth(columnId: string) {
  const { columnSizeVars } = useResizable();

  return React.useMemo(() => {
    const key = `--col-${columnId}-size`;
    return columnSizeVars[key] || 0;
  }, [columnId, columnSizeVars]);
}

// Hook to optimize renders during resizing
export function useResizeOptimizer<T>(value: T): T {
  const { isColumnResizing } = useResizable();
  const valueRef = React.useRef(value);

  // Only update the ref if we're not currently resizing
  if (!isColumnResizing) {
    valueRef.current = value;
  }

  return valueRef.current;
}
