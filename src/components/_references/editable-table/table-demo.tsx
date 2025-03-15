"use client";

import { DataTable } from "./data-table";
import { columns, data } from "./data";
import { useEditablePlugin } from "./_plugins/editable";

export default function TableDemo() {
  // Initialize the editable plugin
  const editablePlugin = useEditablePlugin({
    onValueChange: (rowIndex, columnId, value) => {
      console.log(
        `Updated row ${rowIndex}, column ${columnId} with value:`,
        value,
      );
    },
  });

  return (
    <div className="rounded-md border">
      <DataTable columns={columns} data={data} plugins={[editablePlugin]} />
    </div>
  );
}
