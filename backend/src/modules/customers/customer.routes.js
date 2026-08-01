import { Router } from "express";
import { CustomerController } from "./customer.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/rbac.middleware.js";
import { createCustomerSchema, updateCustomerSchema } from "./customer.dto.js";

const router = Router();

router.use(authenticate);

router.get("/", CustomerController.getAll);
router.get("/:id", CustomerController.getById);
router.post(
  "/",
  authorize("admin", "manager"),
  validate(createCustomerSchema),
  CustomerController.create,
);
router.put(
  "/:id",
  authorize("admin", "manager"),
  validate(updateCustomerSchema),
  CustomerController.update,
);
router.delete("/:id", authorize("admin"), CustomerController.delete);

export { router as customerRoutes };
