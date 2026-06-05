import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service.js";
import { sendSuccess } from "../../utils/response.js";

const service = new DashboardService();

export class DashboardController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await service.getStats();
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeesByDepartment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await service.getEmployeesByDepartment();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getInventoryByCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await service.getInventoryByCategory();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getRecentActivities(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await service.getRecentActivities();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getLatestEmployees(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await service.getLatestEmployees();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getLowStockAlerts(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await service.getLowStockAlerts();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerGrowth(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await service.getCustomerGrowth();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
