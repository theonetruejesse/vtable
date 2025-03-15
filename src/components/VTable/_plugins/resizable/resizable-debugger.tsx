import React from "react";
import { type DebugResizeInfo } from "./resizable-types";

type DebuggerProps = {
  debugInfo: DebugResizeInfo;
};

export function ResizableDebugger({ debugInfo }: DebuggerProps) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="mt-4 border border-gray-300 p-4 text-xs">
      <div>Resize Phase: {debugInfo.phase}</div>
      <div>Target Column: {debugInfo.targetColumn || "none"}</div>
      <div>Old Width: {debugInfo.oldWidth}</div>
      <div>New Width: {debugInfo.newWidth}</div>
    </div>
  );
}
