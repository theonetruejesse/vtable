import { Logger } from "~/server/common/logger";
import { vTableRepository } from "../repository/vtable.repository";
import {
  CreateVCellInput,
  UpdateVCellByPositionInput,
  VTableObject,
  VCellObject,
  VTableColumnObject,
  VTableRowCellJoinResult,
  VTableFullData,
  VRowObject,
} from "../repository/vtable.repository.types";
import { db } from "~/server/database/db";
import { v_column_type } from "~/server/database/db.types";
import {
  AssembledVTable,
  BulkUpdateCellsInput,
  CreateVTableServiceInput,
  DeleteVTableColumnServiceInput,
  DeleteVTableRowServiceInput,
  DeleteVTableServiceInput,
  GetVTableServiceInput,
  UpdateVTableCellServiceInput,
  UpdateVTableColumnServiceInput,
  UpdateVTableServiceInput,
  VTableCellObject,
  DEFAULT_COLUMNS,
} from "./vtable.service.types";

class VTableService {
  private readonly logger = new Logger(VTableService.name);

  /**
   * Create a new VTable with default columns and a single empty row
   */
  public async createVTable(
    input: CreateVTableServiceInput,
  ): Promise<AssembledVTable> {
    const { name, owner_id } = input;

    this.logger.debug(`Creating VTable with name: ${name}`);

    // Use a transaction to ensure all related records are created atomically
    const tableId = await db.transaction().execute(async (trx) => {
      // 1. Create the table
      const table = await vTableRepository.createVTable({
        name,
        owner_id: owner_id ?? null,
      });

      // 2. Create default columns
      const columns = [];
      for (const column of DEFAULT_COLUMNS) {
        const createdColumn = await vTableRepository.createVTableColumn({
          table_id: table.id,
          name: column.name,
          type: column.type,
          options: column.options,
        });
        columns.push(createdColumn);
      }

      // 3. Create a default empty row
      const row = await vTableRepository.createVRow({
        tableId: table.id,
      });

      // 4. Create empty cells for each column in the row
      const cellInputs: CreateVCellInput[] = columns.map((column) => {
        let defaultValue = null;

        // Get options as parsed object
        let columnOptions: Record<string, any> | null = null;
        if (column.options) {
          columnOptions =
            typeof column.options === "string"
              ? JSON.parse(column.options as string)
              : column.options;
        }

        // If it's a select column, use the default value if available
        if (column.type === v_column_type.select && columnOptions?.default) {
          defaultValue = columnOptions.default;
        }

        return {
          row_id: row.id,
          column_id: column.id,
          value: defaultValue,
        };
      });

      await vTableRepository.bulkCreateVCells(cellInputs);

      // Return table ID for later use
      return table.id;
    });

    // Use our getVTable method to return the fully assembled table with the same structure
    // as other methods for consistency
    const assembledTable = await this.getVTable({ id: tableId });

    // This should never happen since we just created the table
    if (!assembledTable) {
      throw new Error(`Failed to retrieve created table with ID ${tableId}`);
    }

    return assembledTable;
  }

  /**
   * Update a VTable's properties
   */
  public async updateVTable(
    input: UpdateVTableServiceInput,
  ): Promise<VTableObject | undefined> {
    const { id, ...data } = input;

    this.logger.debug(`Updating VTable with id: ${id}`);

    return vTableRepository.updateVTable({
      id,
      data,
    });
  }

  /**
   * Delete a VTable and all its related data
   */
  public async deleteVTable(
    input: DeleteVTableServiceInput,
  ): Promise<VTableObject | undefined> {
    const { id } = input;

    this.logger.debug(`Deleting VTable with id: ${id}`);

    return vTableRepository.deleteVTable({ id });
  }

  /**
   * Assemble raw VTable data into a structured format for the frontend
   * This method only handles data transformation, not database queries
   *
   * Cell keys are formatted as "rowId-columnId" for efficient lookup
   */
  private assembleVTable(fullData: VTableFullData): AssembledVTable | null {
    const { table, columns, rowsWithCells } = fullData;

    // If table doesn't exist, return null
    if (!table) return null;

    // Create a map to track unique rows
    const rowsMap = new Map<number, VRowObject>();

    // Create a cells record with "rowId-columnId" keys
    const cells: Record<string, VTableCellObject> = {};

    // Process all row/cell data
    for (const item of rowsWithCells) {
      const { row_id, table_id, cell_id, column_id, value, row_created_at } =
        item;

      // Track unique rows
      if (!rowsMap.has(row_id)) {
        rowsMap.set(row_id, {
          id: row_id,
          table_id,
          created_at: row_created_at,
        });
      }

      // Add cell to the cells record if it exists (left joins can result in null cells)
      if (cell_id !== null && column_id !== null) {
        const cellKey = `${row_id}-${column_id}`;
        cells[cellKey] = {
          id: cell_id,
          value,
        };
      }
    }

    // Convert the rows map to an array
    const rows = Array.from(rowsMap.values());

    // Return the fully assembled table structure in the new format
    return {
      table,
      columns,
      rows,
      cells,
    };
  }

  /**
   * Get a fully assembled VTable with all columns and rows with their cell values
   */
  public async getVTable(
    input: GetVTableServiceInput,
  ): Promise<AssembledVTable | null> {
    const { id } = input;

    this.logger.debug(`Getting assembled VTable with id: ${id}`);

    // Use the repository to efficiently fetch all the raw data
    const rawData = await vTableRepository.getFullVTable({ id });

    // Use the assembler method to structure the data for the frontend
    return this.assembleVTable(rawData);
  }

  /**
   * Get a list of all tables for a user
   */
  public async getVTables(ownerId?: string): Promise<VTableObject[]> {
    return vTableRepository.getVTables({ ownerId });
  }

  /**
   * Update a column's properties
   */
  public async updateVTableColumn(
    input: UpdateVTableColumnServiceInput,
  ): Promise<AssembledVTable | null> {
    const { id, name, type, options } = input;

    this.logger.debug(`Updating VTableColumn with id: ${id}`);

    // 1. Update the column
    const column = await vTableRepository.updateVTableColumn({
      id,
      data: {
        name,
        type,
        options,
      },
    });

    if (!column) {
      return null;
    }

    // 2. Get the associated table to return the full structure
    return await this.getVTable({ id: column.table_id });
  }

  /**
   * Delete a column from a table
   */
  public async deleteVTableColumn(
    input: DeleteVTableColumnServiceInput,
  ): Promise<AssembledVTable | null> {
    const { id } = input;

    this.logger.debug(`Deleting VTableColumn with id: ${id}`);

    // 1. Get the column to find the table ID
    const column = await vTableRepository.getVTableColumn({ id });
    if (!column) {
      return null;
    }

    const tableId = column.table_id;

    // 2. Delete the column
    await vTableRepository.deleteVTableColumn({ id });

    // 3. Return the updated table structure
    return await this.getVTable({ id: tableId });
  }

  /**
   * Add a new row to a table
   */
  public async addRowToTable(tableId: number): Promise<AssembledVTable | null> {
    this.logger.debug(`Adding row to table: ${tableId}`);

    // 1. Get the table and columns
    const table = await vTableRepository.getVTable({ id: tableId });
    if (!table) {
      return null;
    }

    const columns = await vTableRepository.getVTableColumns({
      tableId: table.id,
    });

    // 2. Create the row
    const row = await vTableRepository.createVRow({ tableId: table.id });

    // 3. Create cells for each column
    const cellInputs: CreateVCellInput[] = columns.map((column) => {
      let defaultValue = null;

      // Check for default values in select columns
      if (column.type === v_column_type.select && column.options) {
        const options =
          typeof column.options === "string"
            ? JSON.parse(column.options as string)
            : column.options;

        if (options.default) {
          defaultValue = options.default;
        }
      }

      return {
        row_id: row.id,
        column_id: column.id,
        value: defaultValue,
      };
    });

    if (cellInputs.length > 0) {
      await vTableRepository.bulkCreateVCells(cellInputs);
    }

    // 4. Return the updated table using our consistent method
    return await this.getVTable({ id: tableId });
  }

  /**
   * Delete a row from a table
   */
  public async deleteVTableRow(
    input: DeleteVTableRowServiceInput,
  ): Promise<AssembledVTable | null> {
    const { id } = input;

    this.logger.debug(`Deleting VTableRow with id: ${id}`);

    // 1. Get the row to find the table ID
    const row = await vTableRepository.getVRow({ id });
    if (!row) {
      return null;
    }

    const tableId = row.table_id;

    // 2. Delete the row
    await vTableRepository.deleteVRow({ id });

    // 3. Return the updated table
    return await this.getVTable({ id: tableId });
  }

  /**
   * Update a cell's value
   */
  public async updateVTableCell(
    input: UpdateVTableCellServiceInput,
  ): Promise<VCellObject | undefined> {
    const { id, row_id, column_id, value } = input;

    this.logger.debug(`Updating VTableCell`);

    // Update by ID if provided
    if (id) {
      return vTableRepository.updateVCell({
        id,
        data: { value },
      });
    }

    // Update by position if row_id and column_id are provided
    if (row_id && column_id) {
      return vTableRepository.updateVCellByPosition({
        row_id,
        column_id,
        value,
      });
    }

    throw new Error(
      "Either cell id or both row_id and column_id must be provided",
    );
  }

  /**
   * Bulk update multiple cells at once
   */
  public async bulkUpdateCells(
    input: BulkUpdateCellsInput,
  ): Promise<{ updatedCount: number }> {
    const { cells } = input;

    if (cells.length === 0) {
      return { updatedCount: 0 };
    }

    this.logger.debug(`Bulk updating ${cells.length} cells`);

    const updateInputs: UpdateVCellByPositionInput[] = cells.map((cell) => ({
      row_id: cell.row_id,
      column_id: cell.column_id,
      value: cell.value,
    }));

    const updatedCount = await vTableRepository.bulkUpdateVCells(updateInputs);

    return { updatedCount };
  }
}

export const vTableService = new VTableService();
