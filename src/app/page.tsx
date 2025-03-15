import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { VTable } from "~/components/VTable";
import { CColumnReorder } from "~/components/_clone/c-column-reorder";
export default async function Home() {
  void api.vtable.getTable.prefetch({ id: 1 });
  return (
    <HydrateClient>
      <div className="flex w-full flex-col items-start justify-start">
        <CColumnReorder />
        {/* TODO, switch this to page based */}
        <VTable id={1} />
      </div>
    </HydrateClient>
  );
}
