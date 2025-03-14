import React from "react";
import { flexRender, type Header } from "@tanstack/react-table";
import { cn } from "~/lib/utils";
import { TableHead } from "~/components/ui/table";
import { type VTable } from "../../vtable-types";

type ResizableHeaderProps = {
  header: Header<any, unknown>;
  onResize: (header: Header<any, unknown>) => (e: any) => void;
};

export function ResizableHeader({ header, onResize }: ResizableHeaderProps) {
  return (
    <TableHead
      key={header.id}
      data-column-id={header.column.id}
      style={{
        width: `${header.getSize()}px`,
        minWidth: `${header.getSize()}px`,
        maxWidth: `${header.getSize()}px`,
      }}
      className={cn(
        "relative select-none border border-gray-300 px-4 py-2 text-left font-medium transition-colors hover:bg-muted",
        header.column.getIsResizing() &&
          "border-l border-r-2 border-l-gray-300 border-r-gray-300 bg-gray-100",
      )}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      {/* Resize handle */}
      <div
        onDoubleClick={() => header.column.resetSize()}
        onPointerDown={onResize(header)}
        className={cn(
          "absolute right-0 top-0 z-10 h-full w-[5px] cursor-col-resize touch-none select-none bg-transparent opacity-100",
          header.column.getIsResizing() ? "bg-blue-500" : "hover:bg-blue-500",
        )}
        style={{
          transform: "translateX(50%)",
        }}
      />
    </TableHead>
  );
}
