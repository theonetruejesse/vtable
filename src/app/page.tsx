import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { VTable } from "./_components/VTable";

export default async function Home() {
  void api.vtable.getTable.prefetch({ id: 1 });
  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center">
        {/* TODO, switch this to page based */}
        <Suspense fallback={<div>Loading...</div>}>
          <VTable id={1} />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
