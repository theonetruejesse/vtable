import { flexRender } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { TableHeader, TableRow, TableHead } from "~/components/ui/table";
import { Plus } from "lucide-react";
import { type Table } from "@tanstack/react-table";
import { type VTableRowData } from "~/components/VTable/hooks";

type VHeaderProps = {
  table: Table<VTableRowData>;
};

export const VHeader = ({ table }: VHeaderProps) => {
  return (
    <TableHeader className="border-none">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="border-none">
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              className="w-[150px] border-none px-4 py-2 text-left font-medium transition-colors hover:bg-muted"
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </TableHead>
          ))}
          <TableHead className="w-[50px] border-none">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Add column"
              aria-label="Add column"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      ))}
    </TableHeader>
  );
};
