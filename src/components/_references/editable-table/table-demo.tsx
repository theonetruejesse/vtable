"use client"

import { DataTable } from "@/components/data-table"
import { columns, data } from "@/components/data"
import { useEditablePlugin } from "@/components/_plugins/editable"

export default function TableDemo() {
  // Initialize the editable plugin
  const editablePlugin = useEditablePlugin({
    onValueChange: (rowIndex, columnId, value) => {
      console.log(`Updated row ${rowIndex}, column ${columnId} with value:`, value)
    },
  })

  return (
    <div className="rounded-md border">
      <DataTable columns={columns} data={data} plugins={[editablePlugin]} />
    </div>
  )
}

