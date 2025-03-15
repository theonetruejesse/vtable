"use client";

import { DataTable } from "./data-table";
import { columns, data, type Person } from "./data";
import { useEditablePlugin } from "./_plugins/editable";

export function EditableTable() {
  // Initialize the editable plugin
  const editablePlugin = useEditablePlugin<Person, unknown>({
    onValueChange: (rowIndex, columnId, value) => {
      console.log(
        `Updated row ${rowIndex}, column ${columnId} with value:`,
        value,
      );
    },
  });

  return (
    <div className="rounded-md border">
      <DataTable<Person, unknown>
        columns={columns}
        data={data}
        plugins={[editablePlugin]}
      />
    </div>
  );
}
