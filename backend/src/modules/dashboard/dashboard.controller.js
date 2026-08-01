import { DashboardService } from "./dashboard.service.js";
import { sendSuccess } from "../../utils/response.js";

const service = new DashboardService();

export class DashboardController {
  static async getStats(req, res, next) {
    try {
      const stats = await service.getStats();
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeesByDepartment(req, res, next) {
    try {
      const data = await service.getEmployeesByDepartment();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getInventoryByCategory(req, res, next) {
    try {
      const data = await service.getInventoryByCategory();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getRecentActivities(req, res, next) {
    try {
      const data = await service.getRecentActivities();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getLatestEmployees(req, res, next) {
    try {
      const data = await service.getLatestEmployees();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getLowStockAlerts(req, res, next) {
    try {
      const data = await service.getLowStockAlerts();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerGrowth(req, res, next) {
    try {
      const data = await service.getCustomerGrowth();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
