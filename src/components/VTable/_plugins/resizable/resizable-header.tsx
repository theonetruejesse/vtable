import React from "react";
import { flexRender } from "@tanstack/react-table";
import { TableHead } from "~/components/ui/table";
import { type ResizableHeaderProps } from "./resizable-types";
import { ResizeHandle } from "./resizable-handle";

export function ResizableHeader({ header, children }: ResizableHeaderProps) {
  return (
    <TableHead
      key={header.id}
      data-column-id={header.column.id}
      style={{
        width: `calc(var(--header-${header.id}-size) * 1px)`,
      }}
      className={
        "relative select-none border-r border-gray-300 px-4 py-2 text-left font-medium transition-colors hover:bg-muted"
      }
    >
      {/* Render the header content */}
      {children ||
        (header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext()))}

      {/* Resize handle */}
      <ResizeHandle header={header} />
    </TableHead>
  );
}
