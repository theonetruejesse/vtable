import { Table } from "@tanstack/react-table";

// Define a type for the table row data
export type VTableRowData = {
  id: number;
  [key: `col-${number}`]: string;
};

export type VTable = Table<VTableRowData>;
