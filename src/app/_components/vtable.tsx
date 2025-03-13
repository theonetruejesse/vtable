import { api } from "~/trpc/server";

export const VTable = async () => {
  const table = await api.vtable.getTable({ id: 1 });
  if (!table) return <div>No table found</div>;

  return <div>{table.table.name}</div>;
};
