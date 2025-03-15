import React, { useEffect, useState } from "react";
import { type DebugResizeInfo } from "./resizable-types";

type DebuggerProps = {
  debugInfo: DebugResizeInfo;
};

export function ResizableDebugger({ debugInfo }: DebuggerProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (process.env.NODE_ENV !== "development" || !isClient) return null;

  return (
    <div className="mt-4 border border-gray-300 p-4 text-xs">
      <div>Resize Phase: {debugInfo.phase}</div>
      <div>Target Column: {debugInfo.targetColumn || "none"}</div>
      <div>Old Width: {debugInfo.oldWidth}</div>
      <div>New Width: {debugInfo.newWidth}</div>
    </div>
  );
}
