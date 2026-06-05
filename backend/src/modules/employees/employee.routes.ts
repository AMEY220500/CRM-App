import { Router } from "express";
import { EmployeeController } from "./employee.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/rbac.middleware.js";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee.dto.js";

const router = Router();

router.use(authenticate);

router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.getById);
router.post(
  "/",
  authorize("admin", "manager"),
  validate(createEmployeeSchema),
  EmployeeController.create,
);
router.put(
  "/:id",
  authorize("admin", "manager"),
  validate(updateEmployeeSchema),
  EmployeeController.update,
);
router.delete("/:id", authorize("admin"), EmployeeController.delete);

export { router as employeeRoutes };
