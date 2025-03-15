import React from "react";
import { type Header } from "@tanstack/react-table";
import {
  type ColumnResizingInfo,
  type DebugResizeInfo,
} from "./resizable-types";
import { VTable } from "../../vtable-types";

type ResizableContextValue = {
  // State
  columnResizingInfo: ColumnResizingInfo;
  debugResize: DebugResizeInfo;

  // Actions
  handleResizeStart: <T>(
    header: Header<T, unknown>,
  ) => (e: React.PointerEvent) => void;
  handleResizeMove: (e: PointerEvent) => void;
  handleResizeEnd: () => void;
  resetColumnSize: (columnId: string) => void;

  // Computed
  columnSizeVars: { [key: string]: number };
  isColumnResizing: boolean;
};

// Create the context with a default value
const ResizableContext = React.createContext<ResizableContextValue | null>(
  null,
);

// Custom hook to use the resizable context
export function useResizable() {
  const context = React.useContext(ResizableContext);

  if (!context)
    throw new Error("useResizable must be used within a ResizableProvider");

  return context;
}

interface ResizableProviderProps {
  table: VTable;
  children: React.ReactNode;
  onDebugUpdate?: (debugInfo: DebugResizeInfo) => void;
}
export function ResizableProvider({
  table,
  children,
  onDebugUpdate,
}: ResizableProviderProps) {
  // Debug state
  const [debugResize, setDebugResize] = React.useState<DebugResizeInfo>({
    phase: "idle",
    targetColumn: null,
    oldWidth: 0,
    newWidth: 0,
  });

  // Column resizing state
  const [columnResizingInfo, setColumnResizingInfo] =
    React.useState<ColumnResizingInfo>({
      columnId: null,
      deltaOffset: 0,
      startWidth: 0,
    });

  // Optimization: memoize the header map for quick lookups during resize
  const headerMap = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const map = new Map<string, Header<any, unknown>>();

    for (const header of headers) {
      map.set(header.column.id, header);
    }

    return map;
  }, [table]);

  // Track the column being resized and its current delta
  const handleResizeStart = React.useCallback(
    <T,>(header: Header<T, unknown>) => {
      const originalHandler = header.getResizeHandler();

      return (e: React.PointerEvent) => {
        setColumnResizingInfo({
          columnId: header.column.id,
          deltaOffset: 0,
          startWidth: header.getSize(),
        });

        setDebugResize({
          phase: "start",
          targetColumn: header.column.id,
          oldWidth: header.getSize(),
          newWidth: header.getSize(),
        });

        // Update table state to indicate resizing is happening
        table.setColumnSizingInfo({
          ...table.getState().columnSizingInfo,
          isResizingColumn: header.column.id,
        });

        originalHandler(e);
      };
    },
    [table],
  );

  const handleResizeMove = React.useCallback(
    (e: PointerEvent) => {
      if (columnResizingInfo.columnId) {
        const header = headerMap.get(columnResizingInfo.columnId);

        if (!header) return;

        const headerEl = document.querySelector(
          `[data-column-id="${header.column.id}"]`,
        );
        if (!headerEl) return;
        const headerRect = headerEl.getBoundingClientRect();
        const startX = headerRect.left;
        const mouseX = e.clientX;

        // Calculate the new width directly from the mouse position
        const newWidth = Math.max(mouseX - startX, 120); // Minimum width of 120px

        // Update the delta offset based on the new width
        setColumnResizingInfo((prev) => ({
          ...prev,
          deltaOffset: newWidth - prev.startWidth,
        }));

        setDebugResize({
          phase: "move",
          targetColumn: header.column.id,
          oldWidth: columnResizingInfo.startWidth,
          newWidth: newWidth,
        });

        // Apply the width change immediately to just the column being resized
        table.setColumnSizing((prev) => ({
          ...prev,
          [header.column.id]: newWidth,
        }));
      }
    },
    [columnResizingInfo, headerMap, table],
  );

  // Apply the resize when finished
  const handleResizeEnd = React.useCallback(() => {
    if (columnResizingInfo.columnId) {
      const column = table.getColumn(columnResizingInfo.columnId);
      if (column) {
        const finalWidth =
          columnResizingInfo.startWidth + columnResizingInfo.deltaOffset;

        // Apply the final size to just the column being resized
        table.setColumnSizing((prev) => ({
          ...prev,
          [column.id]: finalWidth,
        }));

        setDebugResize({
          phase: "end",
          targetColumn: column.id,
          oldWidth: columnResizingInfo.startWidth,
          newWidth: finalWidth,
        });
      }
    }

    // Reset the resizing state
    setColumnResizingInfo({
      columnId: null,
      deltaOffset: 0,
      startWidth: 0,
    });

    // Force the table to exit resize mode directly
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
  }, [columnResizingInfo, table]);

  // Reset a column to its default size
  const resetColumnSize = React.useCallback(
    (columnId: string) => {
      const column = table.getColumn(columnId);
      if (column) {
        column.resetSize();
      }
    },
    [table],
  );

  // Calculate column sizes as CSS variables for efficient rendering
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }

    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  // Handle resize events
  React.useEffect(() => {
    if (columnResizingInfo.columnId === null) {
      return; // Skip effect if no column is being resized
    }

    // Use capture phase to ensure we catch all events
    const handlePointerMoveCapture = (e: PointerEvent) => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        handleResizeMove(e);
      });
    };

    const handlePointerUpCapture = (e: PointerEvent) => {
      // Force end of resize regardless of where the pointer was released
      handleResizeEnd();
      // Prevent any further events in this sequence
      e.preventDefault();
      e.stopPropagation();
    };

    // Add listeners with capture phase to ensure they catch all events
    document.addEventListener("pointermove", handlePointerMoveCapture, true);
    document.addEventListener("pointerup", handlePointerUpCapture, true);

    return () => {
      document.removeEventListener(
        "pointermove",
        handlePointerMoveCapture,
        true,
      );
      document.removeEventListener("pointerup", handlePointerUpCapture, true);
    };
  }, [handleResizeMove, handleResizeEnd, columnResizingInfo.columnId]);

  // Pass debug info to parent component whenever it changes
  React.useEffect(() => {
    if (onDebugUpdate) {
      onDebugUpdate(debugResize);
    }
  }, [debugResize, onDebugUpdate]);

  // Create context value
  const value = React.useMemo<ResizableContextValue>(
    () => ({
      columnResizingInfo,
      debugResize,
      handleResizeStart,
      handleResizeMove,
      handleResizeEnd,
      resetColumnSize,
      columnSizeVars,
      isColumnResizing: !!table.getState().columnSizingInfo.isResizingColumn,
    }),
    [
      columnResizingInfo,
      debugResize,
      handleResizeStart,
      handleResizeMove,
      handleResizeEnd,
      resetColumnSize,
      columnSizeVars,
      table.getState().columnSizingInfo.isResizingColumn,
    ],
  );

  return (
    <ResizableContext.Provider value={value}>
      {/* Apply the column size CSS variables to the container */}
      <div className="relative w-full min-w-[800px]" style={columnSizeVars}>
        {children}
      </div>
    </ResizableContext.Provider>
  );
}
