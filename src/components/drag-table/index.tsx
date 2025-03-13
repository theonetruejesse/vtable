"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import "./index.css";
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

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onEnd",
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
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
      originalHandler(e);
    };
  }, []);

  const handleResizeMove = React.useCallback(
    (e: MouseEvent) => {
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
          }
        }
      }
    },
    [columnResizingInfo.columnId, table],
  );

  // Apply the resize when finished
  const handleResizeEnd = React.useCallback(() => {
    if (columnResizingInfo.columnId) {
      const column = table.getColumn(columnResizingInfo.columnId);
      if (column) {
        // Apply the final size to the column using the table's column sizing method
        table.setColumnSizing((prev) => ({
          ...prev,
          [column.id]:
            columnResizingInfo.startWidth + columnResizingInfo.deltaOffset,
        }));
      }
    }

    // Reset the resizing state
    setColumnResizingInfo({
      columnId: null,
      deltaOffset: 0,
      startWidth: 0,
    });
  }, [columnResizingInfo, table]);

  // Handle resize events
  React.useEffect(() => {
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);

    return () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);

  return (
    <div className="w-full p-8">
      <div className="w-full overflow-x-auto">
        <table
          className="table-left"
          style={{ minWidth: `${table.getTotalSize()}px` }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // Calculate the displayed width for this header
                  const displayWidth =
                    header.getSize() +
                    (columnResizingInfo.columnId === header.column.id
                      ? columnResizingInfo.deltaOffset
                      : 0);

                  return (
                    <th
                      key={header.id}
                      data-column-id={header.column.id}
                      style={{ width: `${displayWidth}px` }}
                      className={
                        header.column.getIsResizing() ? "column-resizing" : ""
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={handleResizeStart(header)}
                        onTouchStart={handleResizeStart(header)}
                        className={`resizer ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
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
                  // Calculate the displayed width for this cell
                  const displayWidth =
                    cell.column.getSize() +
                    (columnResizingInfo.columnId === cell.column.id
                      ? columnResizingInfo.deltaOffset
                      : 0);

                  return (
                    <td
                      key={cell.id}
                      style={{ width: `${displayWidth}px` }}
                      className={
                        cell.column.getIsResizing() ? "column-resizing" : ""
                      }
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
    </div>
  );
}
