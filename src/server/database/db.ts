import { Kysely, PostgresDialect } from "kysely";
import { type DB } from "./db.types"; // pnpm db:generate >> generated types
import pc from "../common/pc";
import { Logger } from "../common/logger";
import { Pool } from "pg";

const globalForDb = globalThis as unknown as { db: Kysely<DB> | undefined };

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

function createDbClient(): Kysely<DB> {
  return new Kysely<DB>({
    dialect,
    log:
      process.env.NODE_ENV === "development"
        ? (event) => {
            const formattedSql = event.query.sql.replace(
              /\$(\d+)/g,
              (_, index) => {
                const param = event.query.parameters[Number(index) - 1];
                return param !== null &&
                  param !== undefined &&
                  typeof param.toString === "function"
                  ? // eslint-disable-next-line @typescript-eslint/no-base-to-string
                    pc.green(`'${param.toString()}'`)
                  : pc.red("UNKNOWN");
              },
            );

            const label = `Kysely (${event.queryDurationMillis.toFixed(2)} ms)`;
            Logger.debug(label, formattedSql);
          }
        : undefined,
  });
}

export const db = globalForDb.db ?? createDbClient();

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
