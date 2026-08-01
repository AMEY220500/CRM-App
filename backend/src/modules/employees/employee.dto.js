import { z } from "zod";

export const createEmployeeSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  department_id: z.number().int().positive().optional(),
  designation: z.string().max(100).optional(),
  salary: z.number().positive().optional(),
  joining_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z
    .enum(["active", "inactive", "terminated"])
    .optional()
    .default("active"),
  address: z.string().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();
