import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().min(1).max(50),
  category_id: z.number().int().positive().optional(),
  supplier_id: z.number().int().positive().optional(),
  description: z.string().optional(),
  quantity: z.number().int().min(0).default(0),
  min_stock_level: z.number().int().min(0).default(10),
  unit_price: z.number().positive(),
  cost_price: z.number().positive().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
