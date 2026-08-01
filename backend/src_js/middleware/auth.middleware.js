import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { UnauthorizedError } from "../utils/errors.js";

export function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
