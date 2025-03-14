"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { cn } from "~/lib/utils";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { DragHeader, ResizeDebugger, useDragHeader } from "./drag-header";

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
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugAll: process.env.NODE_ENV === "development",
  });

  // Calculate the total width of all columns
  const totalTableWidth = React.useMemo(() => {
    return table.getTotalSize();
  }, [table]);

  // Use a single instance of the drag header hook for the entire component
  const { handleResizeStart, debugResize } = useDragHeader(table);

  // Log debug information to validate updates are happening
  React.useEffect(() => {
    if (debugResize.phase !== "idle") {
      console.log("Debug update:", debugResize);
    }
  }, [debugResize]);

  return (
    <div className="w-full p-8">
      {/* Using the Table component with variant-based props */}
      <div className="scrollbar-thin w-full overflow-x-auto overflow-y-hidden pb-5">
        <Table
          layout="fixed"
          borderStyle="collapse"
          style={{ minWidth: `${totalTableWidth}px` }}
          wrapperClassName="scrollbar-thin overflow-y-hidden"
        >
          {/* Pass the resize handler to maintain single source of truth */}
          <DragHeader table={table} onResize={handleResizeStart} />
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: `${cell.column.getSize()}px`,
                        minWidth: `${cell.column.getSize()}px`,
                        maxWidth: `${cell.column.getSize()}px`,
                      }}
                      className={cn(
                        "relative box-border overflow-hidden text-ellipsis whitespace-nowrap border border-gray-300 text-left",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Use the ResizeDebugger component */}
      <ResizeDebugger debugInfo={debugResize} />
    </div>
  );
}
