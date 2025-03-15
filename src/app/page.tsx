import { api, HydrateClient } from "~/trpc/server";
import { VTable } from "~/components/VTable";

export default async function Home() {
  void api.vtable.getTable.prefetch({ id: 1 });
  return (
    <HydrateClient>
      <div className="flex w-full flex-col items-start justify-start">
        <div className="my-3 w-full">{/* <CColumnReorder /> */}</div>
        {/* TODO, switch this to page based */}
        <VTable id={1} />
      </div>
    </HydrateClient>
  );
}
