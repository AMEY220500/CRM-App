import { Request, Response, NextFunction } from "express";
import { StockService } from "./stock.service.js";
import { sendSuccess, sendPaginated } from "../../utils/response.js";

const service = new StockService();

export class StockController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;
      const product_id = req.query.product_id
        ? parseInt(req.query.product_id as string)
        : undefined;
      const type = req.query.type as string | undefined;

      const { data, total } = await service.getAll({
        page,
        limit,
        sortOrder,
        product_id,
        type,
      });
      sendPaginated(res, data, total, page, limit);
    } catch (error) {
      next(error);
    }
  }

  static async createMovement(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.createMovement(req.body, req.user!.userId);
      sendSuccess(res, result, "Stock movement recorded successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async getProductMovements(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const movements = await service.getProductMovements(
        parseInt(req.params.productId as string),
      );
      sendSuccess(res, movements);
    } catch (error) {
      next(error);
    }
  }
}
