import { api } from "~/trpc/server";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const VTable = async () => {
  const vtable = await api.vtable.getTable({ id: 1 });
  if (!vtable) return <div>No table found</div>;

  return <div>{vtable.table.name}</div>;
};
