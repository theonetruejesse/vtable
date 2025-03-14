import React from "react";
import { type Table, type Header } from "@tanstack/react-table";

// Type for our resize info
type ColumnResizingInfo = {
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

// Hook to handle drag and resize logic
export function useColumnResize<T>(table: Table<T>) {
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

  // Track the column being resized and its current delta
  const handleResizeStart = React.useCallback((header: Header<T, unknown>) => {
    const originalHandler = header.getResizeHandler();

    return (e: any) => {
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

      originalHandler(e);
    };
  }, []);

  const handleResizeMove = React.useCallback(
    (e: PointerEvent) => {
      if (columnResizingInfo.columnId) {
        const header = table
          .getHeaderGroups()
          .flatMap((group) => group.headers)
          .find((h) => h.column.id === columnResizingInfo.columnId);

        if (header) {
          const headerEl = document.querySelector(
            `[data-column-id="${header.column.id}"]`,
          );
          if (headerEl) {
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

            // Apply the width change immediately only to the target column
            table.setColumnSizing((prev) => ({
              ...prev,
              [header.column.id]: newWidth,
            }));
          }
        }
      }
    },
    [columnResizingInfo.columnId, columnResizingInfo.startWidth, table],
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

  // Handle resize events
  React.useEffect(() => {
    // Use capture phase to ensure we catch all events
    const handlePointerMoveCapture = (e: PointerEvent) => {
      handleResizeMove(e);
    };

    const handlePointerUpCapture = (e: PointerEvent) => {
      if (columnResizingInfo.columnId !== null) {
        // Force end of resize regardless of where the pointer was released
        handleResizeEnd();
        // Prevent any further events in this sequence
        e.preventDefault();
        e.stopPropagation();
      }
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

  return {
    handleResizeStart,
    debugResize,
  };
}

// Debugger Component
type DebuggerProps = {
  debugInfo: DebugResizeInfo;
};

export function ResizeDebugger({ debugInfo }: DebuggerProps) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="mt-4 border border-gray-300 p-4 text-xs">
      <div>Resize Phase: {debugInfo.phase}</div>
      <div>Target Column: {debugInfo.targetColumn || "none"}</div>
      <div>Old Width: {debugInfo.oldWidth}</div>
      <div>New Width: {debugInfo.newWidth}</div>
    </div>
  );
}
