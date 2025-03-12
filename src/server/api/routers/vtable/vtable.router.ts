import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { vTableService } from "./service/vtable.service";
import { v_column_type } from "~/server/database/db.types";

export const vTableRouter = createTRPCRouter({
  // Table operations
  createTable: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        owner_id: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return vTableService.createVTable(input);
    }),

  getTable: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return vTableService.getVTable(input);
    }),

  getTables: publicProcedure
    .input(
      z
        .object({
          ownerId: z.string().uuid().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return vTableService.getVTables(input?.ownerId);
    }),

  updateTable: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).optional(),
        owner_id: z.string().uuid().nullish(),
      }),
    )
    .mutation(async ({ input }) => {
      return vTableService.updateVTable(input);
    }),

  deleteTable: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return vTableService.deleteVTable(input);
    }),

  // Column operations
  updateColumn: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).optional(),
        type: z.nativeEnum(v_column_type).optional(),
        options: z.record(z.unknown()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return vTableService.updateVTableColumn(input);
    }),

  deleteColumn: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return vTableService.deleteVTableColumn(input);
    }),

  // Row operations
  addRow: publicProcedure
    .input(z.object({ tableId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return vTableService.addRowToTable(input.tableId);
    }),

  deleteRow: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return vTableService.deleteVTableRow(input);
    }),

  // Cell operations
  updateCell: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive().optional(),
        row_id: z.number().int().positive().optional(),
        column_id: z.number().int().positive().optional(),
        value: z.string().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      return vTableService.updateVTableCell(input);
    }),

  bulkUpdateCells: publicProcedure
    .input(
      z.object({
        cells: z.array(
          z.object({
            row_id: z.number().int().positive(),
            column_id: z.number().int().positive(),
            value: z.string().nullable(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      return vTableService.bulkUpdateCells(input);
    }),
});
