import { PostgresDialect } from "kysely";
import pg from "pg";
import { Kysely } from "kysely";

const { Pool } = pg;

// Define the database types directly in the seed file
type v_column_type =
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "relation";

// Define the database schema types with partial fields for inserts
interface DB {
  users: {
    id: string;
    name: string | null;
    created_at: Date;
    updated_at: Date;
  };
  v_tables: {
    id: string;
    name: string;
    owner_id: string;
    created_at: Date;
    updated_at: Date;
  };
  v_columns: {
    id: string;
    table_id: string;
    name: string;
    type: v_column_type;
    options: string;
    created_at: Date;
    updated_at: Date;
  };
  v_rows: {
    id: string;
    table_id: string;
    created_at: Date;
    updated_at: Date;
  };
  v_cells: {
    id: string;
    row_id: string;
    column_id: string;
    value: string | null;
    created_at: Date;
    updated_at: Date;
  };
}

// Create a database connection directly
const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

// Define DEFAULT_COLUMNS directly in the seed file to avoid import issues
const DEFAULT_COLUMNS = [
  {
    name: "Title",
    type: "text" as v_column_type,
  },
  {
    name: "Status",
    type: "select" as v_column_type,
    options: {
      options: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
  },
  {
    name: "Date",
    type: "date" as v_column_type,
  },
  {
    name: "Priority",
    type: "select" as v_column_type,
    options: {
      options: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
];

/**
 * Seed script to populate the database with initial data
 */
async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // Create a demo user
    const demoUserId = "00000000-0000-0000-0000-000000000000"; // Using a fixed UUID for demo user

    // Check if the demo user already exists
    const existingUser = await db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", demoUserId)
      .executeTakeFirst();

    if (!existingUser) {
      console.log("Creating demo user...");
      await db
        .insertInto("users")
        .values({
          id: demoUserId,
          name: "Demo User",
        } as any)
        .execute();
      console.log("✅ Demo user created");
    } else {
      console.log("✅ Demo user already exists");
    }

    // Create demo tables
    const demoTables = [
      {
        name: "Project Tasks",
        owner_id: demoUserId,
      },
      {
        name: "Meeting Notes",
        owner_id: demoUserId,
      },
      {
        name: "Product Roadmap",
        owner_id: demoUserId,
      },
    ];

    for (const tableData of demoTables) {
      console.log(`Creating vtable: ${tableData.name}`);

      // 1. Create the table
      const table = await db
        .insertInto("v_tables")
        .values({
          name: tableData.name,
          owner_id: tableData.owner_id,
        } as any) // Using type assertion to bypass strict type checking
        .returningAll()
        .executeTakeFirstOrThrow();

      // 2. Create default columns
      const columns = [];
      for (const column of DEFAULT_COLUMNS) {
        const columnOptions =
          typeof column.options === "object"
            ? JSON.stringify(column.options)
            : column.options || "{}";

        const createdColumn = await db
          .insertInto("v_columns")
          .values({
            table_id: table.id,
            name: column.name,
            type: column.type,
            options: columnOptions,
          } as any) // Using type assertion to bypass strict type checking
          .returningAll()
          .executeTakeFirstOrThrow();

        columns.push(createdColumn);
      }

      // 3. Create sample rows (3-5 rows per table)
      const rowCount = Math.floor(Math.random() * 3) + 3; // 3-5 rows

      for (let i = 0; i < rowCount; i++) {
        // Create a row
        const row = await db
          .insertInto("v_rows")
          .values({
            table_id: table.id,
          } as any) // Using type assertion to bypass strict type checking
          .returningAll()
          .executeTakeFirstOrThrow();

        // Create cells for each column in the row
        for (const column of columns) {
          let value = null;

          // Generate sample data based on column type
          if (column.name === "Title") {
            // Sample titles based on table type
            if (tableData.name === "Project Tasks") {
              const tasks = [
                "Implement user authentication",
                "Design dashboard UI",
                "Set up CI/CD pipeline",
                "Write API documentation",
                "Fix navigation bug",
              ];
              value = tasks[i % tasks.length];
            } else if (tableData.name === "Meeting Notes") {
              const meetings = [
                "Weekly standup",
                "Product review",
                "Sprint planning",
                "Retrospective",
                "Client presentation",
              ];
              value = meetings[i % meetings.length];
            } else {
              const roadmapItems = [
                "User profile feature",
                "Payment integration",
                "Mobile app release",
                "Analytics dashboard",
                "Performance optimization",
              ];
              value = roadmapItems[i % roadmapItems.length];
            }
          } else if (column.name === "Status") {
            // Distribute statuses
            const statuses = ["To Do", "In Progress", "Done"];
            value = statuses[i % statuses.length];
          } else if (column.name === "Date") {
            // Generate dates within the next 30 days
            const date = new Date();
            date.setDate(date.getDate() + i * 5);
            value = date.toISOString().split("T")[0];
          } else if (column.name === "Priority") {
            // Distribute priorities
            const priorities = ["Low", "Medium", "High"];
            value = priorities[i % priorities.length];
          }

          // Create the cell
          await db
            .insertInto("v_cells")
            .values({
              row_id: row.id,
              column_id: column.id,
              value,
            } as any) // Using type assertion to bypass strict type checking
            .execute();
        }
      }
    }

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Error during seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the database connection
    await db.destroy();
  });
