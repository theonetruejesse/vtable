-- CreateEnum
CREATE TYPE "v_column_type" AS ENUM ('text', 'number', 'date', 'boolean', 'select', 'relation');

-- CreateTable
CREATE TABLE "vtable_pages" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(256),
    "content" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" INTEGER,
    "parent" INTEGER,

    CONSTRAINT "vtable_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v_tables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "v_tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v_columns" (
    "id" SERIAL NOT NULL,
    "table_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "v_column_type" NOT NULL,
    "options" JSONB DEFAULT '{}',

    CONSTRAINT "v_columns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v_rows" (
    "id" SERIAL NOT NULL,
    "table_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "v_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v_cells" (
    "id" SERIAL NOT NULL,
    "row_id" INTEGER NOT NULL,
    "column_id" INTEGER NOT NULL,
    "value" TEXT,

    CONSTRAINT "v_cells_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "v_tables" ADD CONSTRAINT "v_tables_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "v_columns" ADD CONSTRAINT "v_columns_table_id_v_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "v_tables"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "v_rows" ADD CONSTRAINT "v_rows_table_id_v_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "v_tables"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "v_cells" ADD CONSTRAINT "v_cells_column_id_v_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "v_columns"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "v_cells" ADD CONSTRAINT "v_cells_row_id_v_rows_id_fk" FOREIGN KEY ("row_id") REFERENCES "v_rows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
