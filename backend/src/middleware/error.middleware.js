import { AppError, ValidationError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, _next) {
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
    body: req.body,
  });

  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unexpected errors
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
