import { ForbiddenError } from "../utils/errors.js";

export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ForbiddenError("Access denied");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError("Insufficient permissions");
    }

    next();
  };
}
