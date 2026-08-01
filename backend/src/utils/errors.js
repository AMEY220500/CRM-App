export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(errors) {
    super("Validation failed", 422);
    this.errors = errors;
  }
}
