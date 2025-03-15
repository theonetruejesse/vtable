import React from "react";
import { cn } from "~/lib/utils";
import { type ResizeHandleProps } from "./resizable-types";
import { useResizable } from "./resizable-context";

export function ResizeHandle({ header }: ResizeHandleProps) {
  const { handleResizeStart, resetColumnSize } = useResizable();

  return (
    <div
      onDoubleClick={() => resetColumnSize(header.column.id)}
      onPointerDown={handleResizeStart(header)}
      className={cn(
        "absolute right-0 top-0 z-10 h-full w-[5px] cursor-col-resize touch-none select-none bg-transparent opacity-100",
        header.column.getIsResizing() ? "bg-blue-500" : "hover:bg-blue-500",
      )}
      style={{
        transform: "translateX(50%)",
      }}
    />
  );
}
