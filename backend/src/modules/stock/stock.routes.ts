import { Router } from "express";
import { StockController } from "./stock.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/rbac.middleware.js";
import { createStockMovementSchema } from "./stock.dto.js";

const router = Router();

router.use(authenticate);

router.get("/", StockController.getAll);
router.get("/product/:productId", StockController.getProductMovements);
router.post(
  "/",
  authorize("admin", "manager"),
  validate(createStockMovementSchema),
  StockController.createMovement,
);

export { router as stockRoutes };
