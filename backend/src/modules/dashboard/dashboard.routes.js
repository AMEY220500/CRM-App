import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/stats", DashboardController.getStats);
router.get(
  "/employees-by-department",
  DashboardController.getEmployeesByDepartment,
);
router.get(
  "/inventory-by-category",
  DashboardController.getInventoryByCategory,
);
router.get("/recent-activities", DashboardController.getRecentActivities);
router.get("/latest-employees", DashboardController.getLatestEmployees);
router.get("/low-stock-alerts", DashboardController.getLowStockAlerts);
router.get("/customer-growth", DashboardController.getCustomerGrowth);

export { router as dashboardRoutes };
