import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">hello world</h1>
        </div>
      </main>
    </HydrateClient>
  );
}
