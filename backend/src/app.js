import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/logger.middleware.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { employeeRoutes } from "./modules/employees/employee.routes.js";
import { customerRoutes } from "./modules/customers/customer.routes.js";
import { inventoryRoutes } from "./modules/inventory/inventory.routes.js";
import { stockRoutes } from "./modules/stock/stock.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(requestLogger);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

export { app };
