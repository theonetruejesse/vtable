import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { VTable } from "./_components/vtable";

export default async function Home() {
  void api.vtable.getTable.prefetch({ id: 1 });
  return (
    <HydrateClient>
      <main>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">hello world</h1>
          <Suspense fallback={<div>Loading...</div>}>
            <VTable />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
