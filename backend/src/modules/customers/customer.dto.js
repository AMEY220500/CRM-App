import { z } from "zod";

export const createCustomerSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  company: z.string().max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zip_code: z.string().max(20).optional(),
  status: z.enum(["active", "inactive", "lead"]).optional().default("active"),
  notes: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();
