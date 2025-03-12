import { db } from "~/server/database/db";
import { Logger } from "~/server/common/logger";
import {
  CreateVTableInput,
  VTableObject,
  GetVTableInput,
  GetVTablesInput,
  CreateVTableColumnInput,
  VTableColumnObject,
  GetVTableColumnInput,
  GetVTableColumnsInput,
  CreateVRowInput,
  VRowObject,
  GetVRowInput,
  GetVRowsInput,
  UpdateVTableInput,
  UpdateVTableColumnInput,
  UpdateVRowInput,
  CreateVCellInput,
  VCellObject,
  GetVCellInput,
  GetVCellsInput,
  UpdateVCellInput,
  UpdateVCellByPositionInput,
  DeleteVTableInput,
  DeleteVTableColumnInput,
  DeleteVRowInput,
  DeleteVCellInput,
} from "./vtable.repository.types";

class VTableRepository {
  private readonly logger = new Logger(VTableRepository.name);

  // ================ VTable methods ================
  public async createVTable(input: CreateVTableInput): Promise<VTableObject> {
    const { name, owner_id } = input;

    this.logger.debug(`Creating VTable with name: ${name}`);

    const result = await db
      .insertInto("v_tables")
      .values({
        name,
        owner_id,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return result;
  }

  public async updateVTable(
    input: UpdateVTableInput,
  ): Promise<VTableObject | undefined> {
    const { id, data } = input;

    this.logger.debug(`Updating VTable with id: ${id}`);

    const result = await db
      .updateTable("v_tables")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return result;
  }

  public async deleteVTable(
    input: DeleteVTableInput,
  ): Promise<VTableObject | undefined> {
    const { id } = input;

    this.logger.debug(`Deleting VTable with id: ${id}`);

    // Note: Cascading delete will handle related columns, rows, and cells
    const result = await db
      .deleteFrom("v_tables")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return result;
  }

  public async getVTable(
    input: GetVTableInput,
  ): Promise<VTableObject | undefined> {
    const { id } = input;

    this.logger.debug(`Getting VTable with id: ${id}`);

    const result = await db
      .selectFrom("v_tables")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return result;
  }

  public async getVTables(
    input: GetVTablesInput = {},
  ): Promise<VTableObject[]> {
    const { ownerId } = input;

    this.logger.debug(
      `Getting VTables${ownerId ? ` for owner: ${ownerId}` : ""}`,
    );

    let query = db.selectFrom("v_tables").selectAll();

    if (ownerId) {
      query = query.where("owner_id", "=", ownerId);
    }

    const result = await query.execute();

    return result;
  }

  // ================ VTableColumn methods ================
  public async createVTableColumn(
    input: CreateVTableColumnInput,
  ): Promise<VTableColumnObject> {
    const { table_id, name, type, options } = input;

    this.logger.debug(
      `Creating VTableColumn with name: ${name} for table: ${table_id}`,
    );

    // Convert options to string if it's an object
    const optionsValue =
      typeof options === "object" && options !== null
        ? JSON.stringify(options)
        : options || "{}";

    const result = await db
      .insertInto("v_columns")
      .values({
        table_id,
        name,
        type,
        options: optionsValue as any,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return result;
  }

  public async updateVTableColumn(
    input: UpdateVTableColumnInput,
  ): Promise<VTableColumnObject | undefined> {
    const { id, data } = input;

    this.logger.debug(`Updating VTableColumn with id: ${id}`);

    // Handle options field conversion
    const updateData = { ...data };
    if (updateData.options !== undefined) {
      updateData.options =
        typeof updateData.options === "object" && updateData.options !== null
          ? JSON.stringify(updateData.options)
          : updateData.options || "{}";
    }

    const result = await db
      .updateTable("v_columns")
      .set(updateData as any)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return result;
  }

  public async deleteVTableColumn(
    input: DeleteVTableColumnInput,
  ): Promise<VTableColumnObject | undefined> {
    const { id } = input;

    this.logger.debug(`Deleting VTableColumn with id: ${id}`);

    // Note: Cascading delete will handle related cells
    const result = await db
      .deleteFrom("v_columns")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return result;
  }

  public async getVTableColumn(
    input: GetVTableColumnInput,
  ): Promise<VTableColumnObject | undefined> {
    const { id } = input;

    this.logger.debug(`Getting VTableColumn with id: ${id}`);

    const result = await db
      .selectFrom("v_columns")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return result;
  }

  public async getVTableColumns(
    input: GetVTableColumnsInput,
  ): Promise<VTableColumnObject[]> {
    const { tableId } = input;

    this.logger.debug(`Getting VTableColumns for table: ${tableId}`);

    const result = await db
      .selectFrom("v_columns")
      .selectAll()
      .where("table_id", "=", tableId)
      .execute();

    return result;
  }

  // ================ VRow methods ================
  public async createVRow(input: CreateVRowInput): Promise<VRowObject> {
    const { tableId } = input;

    this.logger.debug(`Creating VRow for table: ${tableId}`);

    const result = await db
      .insertInto("v_rows")
      .values({
        table_id: tableId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return result;
  }

  public async updateVRow(
    input: UpdateVRowInput,
  ): Promise<VRowObject | undefined> {
    const { id } = input;

    this.logger.debug(`Updating VRow with id: ${id}`);

    // Currently no fields to update for rows
    // This method is a placeholder for future extensions
    const result = await db
      .selectFrom("v_rows")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return result;
  }

  public async deleteVRow(
    input: DeleteVRowInput,
  ): Promise<VRowObject | undefined> {
    const { id } = input;

    this.logger.debug(`Deleting VRow with id: ${id}`);

    // Note: Cascading delete will handle related cells
    const result = await db
      .deleteFrom("v_rows")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return result;
  }

  public async getVRow(input: GetVRowInput): Promise<VRowObject | undefined> {
    const { id } = input;

    this.logger.debug(`Getting VRow with id: ${id}`);

    const result = await db
      .selectFrom("v_rows")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return result;
  }

  public async getVRows(input: GetVRowsInput): Promise<VRowObject[]> {
    const { tableId } = input;

    this.logger.debug(`Getting VRows for table: ${tableId}`);

    const result = await db
      .selectFrom("v_rows")
      .selectAll()
      .where("table_id", "=", tableId)
      .execute();

    return result;
  }

  // ================ VCell methods ================
  public async createVCell(input: CreateVCellInput): Promise<VCellObject> {
    const { row_id, column_id, value } = input;

    this.logger.debug(
      `Creating VCell for row: ${row_id}, column: ${column_id}`,
    );

    const result = await db
      .insertInto("v_cells")
      .values({
        row_id,
        column_id,
        value,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return result;
  }

  public async updateVCell(
    input: UpdateVCellInput,
  ): Promise<VCellObject | undefined> {
    const { id, data } = input;

    this.logger.debug(`Updating VCell with id: ${id}`);

    const result = await db
      .updateTable("v_cells")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return result;
  }

  public async updateVCellByPosition(
    input: UpdateVCellByPositionInput,
  ): Promise<VCellObject | undefined> {
    const { row_id, column_id, value } = input;

    this.logger.debug(
      `Updating VCell at row_id: ${row_id}, column_id: ${column_id}`,
    );

    const result = await db
      .updateTable("v_cells")
      .set({ value })
      .where("row_id", "=", row_id)
      .where("column_id", "=", column_id)
      .returningAll()
      .executeTakeFirst();

    return result;
  }

  public async deleteVCell(
    input: DeleteVCellInput,
  ): Promise<VCellObject | undefined> {
    const { id } = input;

    this.logger.debug(`Deleting VCell with id: ${id}`);

    const result = await db
      .deleteFrom("v_cells")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return result;
  }

  public async getVCell(
    input: GetVCellInput,
  ): Promise<VCellObject | undefined> {
    const { id } = input;

    this.logger.debug(`Getting VCell with id: ${id}`);

    const result = await db
      .selectFrom("v_cells")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return result;
  }

  public async getVCells(input: GetVCellsInput = {}): Promise<VCellObject[]> {
    const { rowId, columnId, tableId } = input;

    this.logger.debug(
      `Getting VCells${rowId ? ` for row: ${rowId}` : ""}${
        columnId ? ` for column: ${columnId}` : ""
      }${tableId ? ` for table: ${tableId}` : ""}`,
    );

    let query = db.selectFrom("v_cells").selectAll();

    if (rowId) {
      query = query.where("row_id", "=", rowId);
    }

    if (columnId) {
      query = query.where("column_id", "=", columnId);
    }

    if (tableId) {
      // To get cells for a table, we need to join with rows
      query = query
        .innerJoin("v_rows", "v_rows.id", "v_cells.row_id")
        .where("v_rows.table_id", "=", tableId);
    }

    const result = await query.execute();

    return result;
  }

  // Additional utility methods
  public async bulkCreateVCells(
    inputs: CreateVCellInput[],
  ): Promise<VCellObject[]> {
    if (inputs.length === 0) {
      return [];
    }

    this.logger.debug(`Bulk creating ${inputs.length} VCells`);

    const result = await db
      .insertInto("v_cells")
      .values(inputs)
      .returningAll()
      .execute();

    return result;
  }

  public async bulkUpdateVCells(
    inputs: UpdateVCellByPositionInput[],
  ): Promise<number> {
    if (inputs.length === 0) {
      return 0;
    }

    this.logger.debug(`Bulk updating ${inputs.length} VCells`);

    let updatedCount = 0;
    // We can't do a bulk update with different WHERE clauses,
    // so we'll do them individually in a transaction
    await db.transaction().execute(async (trx) => {
      for (const input of inputs) {
        const { row_id, column_id, value } = input;
        const result = await trx
          .updateTable("v_cells")
          .set({ value })
          .where("row_id", "=", row_id)
          .where("column_id", "=", column_id)
          .executeTakeFirst();

        if (result.numUpdatedRows > 0) {
          updatedCount += Number(result.numUpdatedRows);
        }
      }
    });

    return updatedCount;
  }
}

export const vTableRepository = new VTableRepository();

// creating a table requires first the table + columns
