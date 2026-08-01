import { StockService } from "./stock.service.js";
import { sendSuccess, sendPaginated } from "../../utils/response.js";

const service = new StockService();

export class StockController {
  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sortOrder = req.query.sortOrder;
      const product_id = req.query.product_id
        ? parseInt(req.query.product_id)
        : undefined;
      const type = req.query.type;

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

  static async createMovement(req, res, next) {
    try {
      const result = await service.createMovement(req.body, req.user.userId);
      sendSuccess(res, result, "Stock movement recorded successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async getProductMovements(req, res, next) {
    try {
      const movements = await service.getProductMovements(
        parseInt(req.params.productId),
      );
      sendSuccess(res, movements);
    } catch (error) {
      next(error);
    }
  }
}
