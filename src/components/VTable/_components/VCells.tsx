import React from "react";
import { Cell, flexRender } from "@tanstack/react-table";
import { TableCell } from "~/components/ui/table";
import { VTableRowData } from "../vtable-types";

interface VCellProps {
  cell: Cell<VTableRowData, unknown>;
}
export function VCell({ cell }: VCellProps) {
  return (
    <TableCell className="truncate border-r border-gray-200 px-4 py-2 text-left last:border-r-0">
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}
