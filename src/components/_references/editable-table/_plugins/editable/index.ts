"use client";

import { useEditableCell } from "./editable-hooks";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback } from "react";

export function useEditablePlugin<TData extends object, TValue>(options: any) {
  const { onValueChange } = options;

  const cell = useCallback(
    (props: any) => {
      return useEditableCell({
        getValue: props.getValue,
        row: props.row,
        column: props.column,
        table: props.table,
        onValueChange,
      });
    },
    [onValueChange],
  );

  // Create a default column definition for editable cells
  const columnDefs: Partial<ColumnDef<TData, TValue>> = {
    cell: cell,
  };

  // Return the plugin configuration
  return {
    columnDefs,
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        if (onValueChange) {
          onValueChange(rowIndex, columnId, value);
        }
      },
    },
  };
}
