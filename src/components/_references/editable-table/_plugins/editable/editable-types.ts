export type EditablePluginOptions<TData> {
  onValueChange?: (rowIndex: number, columnId: string, value: unknown) => void
}

export type EditableCellProps<TData, TValue> {
  getValue: () => TValue
  row: {
    index: number
  }
  column: {
    id: string
  }
  table: {
    options: {
      meta?: {
        updateData?: (rowIndex: number, columnId: string, value: unknown) => void
      }
    }
  }
  onValueChange?: (rowIndex: number, columnId: string, value: unknown) => void
}

