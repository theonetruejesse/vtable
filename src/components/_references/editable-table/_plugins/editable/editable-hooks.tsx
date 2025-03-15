"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";

import type { EditableCellProps } from "./editable-types";

export function useEditableCell<TData, TValue>({
  getValue,
  row: { index },
  column: { id },
  table,
  onValueChange,
}: EditableCellProps<TData, TValue>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    if (table.options.meta?.updateData) {
      table.options.meta.updateData(index, id, value);
    }
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // For numeric values, ensure we're handling them correctly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // If the original value is a number, try to convert the input to a number
    if (typeof initialValue === "number") {
      const numValue = newValue === "" ? 0 : Number.parseFloat(newValue);
      setValue(numValue as TValue);
    } else {
      setValue(newValue as TValue);
    }
  };

  return (
    <Input value={value as string} onChange={handleChange} onBlur={onBlur} />
  );
}
