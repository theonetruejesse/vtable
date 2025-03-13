import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { VTable } from "./_components/vtable";

export default async function Home() {
  const data = await api.vtable.getTable({ id: 1 }); // TODO: change pattern
  return (
    <HydrateClient>
      <main>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">hello world</h1>
          <Suspense fallback={<div>Loading...</div>}>
            {data && <VTable data={data} />}
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
