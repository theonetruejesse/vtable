import { TableCell, TableRow } from "~/components/ui/table";
import { VTable } from "../vtable-types";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { VCell } from "./VCells";

interface VRowsProps {
  table: VTable;
}
export const VRows = ({ table }: VRowsProps) => {
  if (!table.getRowModel().rows.length) return null;

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          className="border-t border-gray-200"
        >
          {/* Use the table's current column order for SortableContext */}
          <SortableContext
            items={
              table.getState().columnOrder?.length > 0
                ? table.getState().columnOrder
                : table
                    .getAllLeafColumns()
                    .filter((column) => column.id)
                    .map((column) => column.id)
            }
            strategy={horizontalListSortingStrategy}
          >
            {row.getVisibleCells().map((cell) => (
              <VCell key={cell.id} cell={cell} />
            ))}
          </SortableContext>
          {/* TODO: filler  button cell? */}
          <TableCell className="w-full"></TableCell>
        </TableRow>
      ))}
    </>
  );
};
