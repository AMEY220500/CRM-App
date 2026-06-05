import { Router } from "express";
import { InventoryController } from "./inventory.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/rbac.middleware.js";
import { createProductSchema, updateProductSchema } from "./inventory.dto.js";

const router = Router();

router.use(authenticate);

router.get("/", InventoryController.getAll);
router.get("/low-stock", InventoryController.getLowStock);
router.get("/out-of-stock", InventoryController.getOutOfStock);
router.get("/:id", InventoryController.getById);
router.post(
  "/",
  authorize("admin", "manager"),
  validate(createProductSchema),
  InventoryController.create,
);
router.put(
  "/:id",
  authorize("admin", "manager"),
  validate(updateProductSchema),
  InventoryController.update,
);
router.delete("/:id", authorize("admin"), InventoryController.delete);

export { router as inventoryRoutes };
