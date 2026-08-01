import { CustomerService } from "./customer.service.js";
import { sendSuccess, sendPaginated } from "../../utils/response.js";

const service = new CustomerService();

export class CustomerController {
  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search;
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.sortOrder;
      const status = req.query.status;

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

  static async getById(req, res, next) {
    try {
      const customer = await service.getById(parseInt(req.params.id));
      sendSuccess(res, customer);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const customer = await service.create(req.body);
      sendSuccess(res, customer, "Customer created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const customer = await service.update(parseInt(req.params.id), req.body);
      sendSuccess(res, customer, "Customer updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await service.delete(parseInt(req.params.id));
      sendSuccess(res, null, "Customer deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
