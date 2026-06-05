import { Request, Response, NextFunction } from "express";
import { CustomerService } from "./customer.service.js";
import { sendSuccess, sendPaginated } from "../../utils/response.js";

const service = new CustomerService();

export class CustomerController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;
      const status = req.query.status as string | undefined;

      const { data, total } = await service.getAll({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        status,
      });
      sendPaginated(res, data, total, page, limit);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await service.getById(parseInt(req.params.id as string));
      sendSuccess(res, customer);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await service.create(req.body);
      sendSuccess(res, customer, "Customer created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await service.update(
        parseInt(req.params.id as string),
        req.body,
      );
      sendSuccess(res, customer, "Customer updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.delete(parseInt(req.params.id as string));
      sendSuccess(res, null, "Customer deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
