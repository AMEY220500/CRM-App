import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/errors.js";

type Role = "admin" | "manager" | "employee";

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError("Access denied");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError("Insufficient permissions");
    }

    next();
  };
}
