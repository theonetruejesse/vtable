import React from "react";
import { flexRender, Header } from "@tanstack/react-table";
import { TableHead } from "~/components/ui/table";
import { type ResizableHeaderProps } from "./resizable-types";
import { ResizeHandle } from "./resizable-handle";
import { useResizable } from "./resizable-context";
import { cn } from "~/lib/utils";

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
      {children ||
        (header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext()))}

      <ResizeHandle header={header} />
    </TableHead>
  );
}

// TODO: MOVE HERE
// interface ResizeHandleProps {
//   header: Header<any, unknown>;
// }
// export function ResizeHandle({ header }: ResizeHandleProps) {
//   const { handleResizeStart, resetColumnSize } = useResizable();

//   return (
//     <div
//       onDoubleClick={() => resetColumnSize(header.column.id)}
//       onPointerDown={handleResizeStart(header)}
//       className={cn(
//         "absolute right-0 top-0 z-10 h-full w-[5px] cursor-col-resize touch-none select-none bg-transparent opacity-100",
//         header.column.getIsResizing() ? "bg-blue-500" : "hover:bg-blue-500",
//       )}
//       style={{
//         transform: "translateX(50%)",
//       }}
//     />
//   );
// }
