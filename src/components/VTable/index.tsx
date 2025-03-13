"use client";

import { flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { useVTable } from "./hooks";
import { VHeader } from "./_components/VHeader";

export function VTable({ id }: { id: number }) {
  const { table, tableColumns, data } = useVTable(id);

  if (!data) return null;

  return (
    <div className="w-full overflow-auto">
      <div className="my-4 flex items-center justify-center">
        <h1 className="text-2xl font-bold">{data.table.name}</h1>
      </div>
      <div className="relative w-full min-w-[800px]">
        <Table className="table-fixed border-collapse">
          <VHeader table={table} />
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-t border-gray-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="truncate border-r border-gray-200 px-4 py-2 text-left last:border-r-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="w-[50px]"></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
