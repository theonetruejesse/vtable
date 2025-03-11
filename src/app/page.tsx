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

// // @ts-ignore
// export const page = createTable("page", {
//   id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
//   title: varchar("title", { length: 256 }),
//   content: text("content"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),

//   userId: integer("user_id").references(() => user.id),
//   // Self-reference: a page may reference a parent page (null for root pages)
//   // @ts-ignore
//   parent: integer("parent").references(() => page.id),
// });
