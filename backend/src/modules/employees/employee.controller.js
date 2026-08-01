import { EmployeeService } from "./employee.service.js";
import { sendSuccess, sendPaginated } from "../../utils/response.js";

const service = new EmployeeService();

export class EmployeeController {
  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search;
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.sortOrder;
      const department_id = req.query.department_id
        ? parseInt(req.query.department_id)
        : undefined;
      const status = req.query.status;

      const { data, total } = await service.getAll({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        department_id,
        status,
      });
      sendPaginated(res, data, total, page, limit);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const employee = await service.getById(parseInt(req.params.id));
      sendSuccess(res, employee);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const employee = await service.create(req.body);
      sendSuccess(res, employee, "Employee created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const employee = await service.update(parseInt(req.params.id), req.body);
      sendSuccess(res, employee, "Employee updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await service.delete(parseInt(req.params.id));
      sendSuccess(res, null, "Employee deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
