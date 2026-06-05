import { Request, Response, NextFunction } from "express";
import { InventoryService } from "./inventory.service.js";
import { sendSuccess, sendPaginated } from "../../utils/response.js";

const service = new InventoryService();

export class InventoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;
      const category_id = req.query.category_id
        ? parseInt(req.query.category_id as string)
        : undefined;
      const supplier_id = req.query.supplier_id
        ? parseInt(req.query.supplier_id as string)
        : undefined;
      const status = req.query.status as string | undefined;

      const { data, total } = await service.getAll({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        category_id,
        supplier_id,
        status,
      });
      sendPaginated(res, data, total, page, limit);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await service.getById(parseInt(req.params.id as string));
      sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await service.create(req.body);
      sendSuccess(res, product, "Product created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await service.update(
        parseInt(req.params.id as string),
        req.body,
      );
      sendSuccess(res, product, "Product updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.delete(parseInt(req.params.id as string));
      sendSuccess(res, null, "Product deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await service.getLowStock();
      sendSuccess(res, products);
    } catch (error) {
      next(error);
    }
  }

  static async getOutOfStock(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await service.getOutOfStock();
      sendSuccess(res, products);
    } catch (error) {
      next(error);
    }
  }
}
