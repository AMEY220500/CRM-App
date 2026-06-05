import { z } from "zod";

export const createStockMovementSchema = z.object({
  product_id: z.number().int().positive(),
  type: z.enum(["in", "out", "adjustment"]),
  quantity: z.number().int().positive("Quantity must be positive"),
  reference: z.string().max(100).optional(),
  notes: z.string().optional(),
});

export type CreateStockMovementDto = z.infer<typeof createStockMovementSchema>;
