import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "~/components/ui/table";

type VTableSkeletonProps = {
  columnCount?: number;
  rowCount?: number;
  hasTitle?: boolean;
  columnWidth?: number;
};

export function VTableSkeleton({
  columnCount = 3,
  rowCount = 4,
  hasTitle = true,
  columnWidth = 300,
}: VTableSkeletonProps) {
  // Create arrays for columns and rows based on props
  const columns = Array(columnCount).fill(null);
  const rows = Array(rowCount).fill(null);

  return (
    <div className="w-full overflow-auto duration-300 animate-in fade-in-50">
      {/* Skeleton for table title */}
      {hasTitle && (
        <div className="my-4 flex items-center justify-center">
          <Skeleton className="h-8 w-64" />
        </div>
      )}

      <div className="relative w-full min-w-[800px]">
        <Table className="w-full table-fixed border-collapse">
          {/* Table header with skeleton columns */}
          <TableHeader className="border-none">
            <TableRow>
              {columns.map((_, index) => (
                <TableHead
                  key={index}
                  className="relative select-none border-r border-gray-300 px-4 py-2"
                  style={{
                    width: `${columnWidth}px`,
                    minWidth: `${columnWidth}px`,
                    maxWidth: `${columnWidth}px`,
                  }}
                >
                  <Skeleton className="h-6 w-full" />
                  {/* Fake resize handle */}
                  <div
                    className="absolute right-0 top-0 z-10 h-full w-[5px]"
                    style={{ transform: "translateX(50%)" }}
                  />
                </TableHead>
              ))}
              <TableHead className="w-full border-l">
                {/* Empty cell for the "add column" button */}
                <div className="h-8 w-8" />
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Table body with skeleton rows */}
          <TableBody>
            {rows.map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-t border-gray-200">
                {columns.map((_, colIndex) => (
                  <TableCell
                    key={`${rowIndex}-${colIndex}`}
                    className="truncate border-r border-gray-200 px-4 py-2 text-left last:border-r-0"
                    style={{
                      width: `${columnWidth}px`,
                      minWidth: `${columnWidth}px`,
                      maxWidth: `${columnWidth}px`,
                    }}
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
                <TableCell className="w-full" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
