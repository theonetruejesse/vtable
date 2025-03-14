"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { cn } from "~/lib/utils";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
};

const defaultData: Person[] = [
  {
    firstName: "John",
    lastName: "Doe",
    age: 30,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    age: 25,
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    age: 45,
  },
];

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];

export function DragTable() {
  const [data] = React.useState(() => [...defaultData]);
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);

  // Add debug state to track resize operations
  const [debugResize, setDebugResize] = React.useState<{
    phase: "idle" | "start" | "move" | "end";
    targetColumn: string | null;
    oldWidth: number;
    newWidth: number;
  }>({
    phase: "idle",
    targetColumn: null,
    oldWidth: 0,
    newWidth: 0,
  });

  const table = useReactTable({
    data,
    columns,
    // Change to onChange to allow real-time updates during dragging
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    // Set column sizes to be independent
    debugAll: process.env.NODE_ENV === "development",
  });

  const [columnResizingInfo, setColumnResizingInfo] = React.useState<{
    columnId: string | null;
    deltaOffset: number;
    startWidth: number;
  }>({
    columnId: null,
    deltaOffset: 0,
    startWidth: 0,
  });

  // Track the column being resized and its current delta
  const handleResizeStart = React.useCallback((header: any) => {
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
            `th[data-column-id="${header.column.id}"]`,
          );
          if (headerEl) {
            const headerRect = headerEl.getBoundingClientRect();
            const startX = headerRect.left;
            const mouseX = e.clientX;

            // Calculate the new width directly from the mouse position
            const newWidth = Math.max(mouseX - startX, 50); // Minimum width of 50px

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

  // Handle resize events - now placed after handleResizeEnd declaration
  React.useEffect(() => {
    // Log attachment of event listeners

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

  return (
    <div className="w-full p-8">
      {/* Table container with overflow handling */}
      <div className="scrollbar-thin w-full overflow-x-auto overflow-y-hidden pb-5">
        <table
          className="float-left clear-both ml-0 mr-auto w-auto table-fixed border-collapse"
          style={{ minWidth: `${table.getTotalSize()}px` }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      data-column-id={header.column.id}
                      style={{
                        width: `${header.getSize()}px`,
                      }}
                      className={cn(
                        "relative select-none border border-gray-300 bg-gray-100 p-2 text-left",
                        header.column.getIsResizing() &&
                          "border-l border-r-2 border-l-gray-300 border-r-gray-300 bg-gray-100",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onPointerDown={handleResizeStart(header)}
                        className={cn(
                          "absolute right-0 top-0 z-10 h-full w-[5px] cursor-col-resize touch-none select-none bg-transparent opacity-100",
                          header.column.getIsResizing()
                            ? "bg-blue-500"
                            : "hover:bg-blue-500",
                        )}
                        style={{
                          transform: "translateX(50%)",
                        }}
                      />
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{
                        width: `${cell.column.getSize()}px`,
                      }}
                      className={cn(
                        "relative box-border overflow-hidden text-ellipsis whitespace-nowrap border border-gray-300 p-2 text-left transition-colors duration-100",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Debug info display */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 border border-gray-300 p-4 text-xs">
          <div>Resize Phase: {debugResize.phase}</div>
          <div>Target Column: {debugResize.targetColumn || "none"}</div>
          <div>Old Width: {debugResize.oldWidth}</div>
          <div>New Width: {debugResize.newWidth}</div>
        </div>
      )}
    </div>
  );
}
