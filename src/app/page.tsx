import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { VTable } from "~/components/VTable";
import { DragTable } from "~/components/drag-table";

export default async function Home() {
  void api.vtable.getTable.prefetch({ id: 1 });
  return (
    <HydrateClient>
      <div className="flex w-full flex-col items-start justify-start">
        <DragTable />
        {/* TODO, switch this to page based */}
        <Suspense fallback={<div>Loading...</div>}>
          <VTable id={1} />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
