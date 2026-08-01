import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "8080", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "crm_user",
    password: process.env.DB_PASSWORD || "crm_password",
    database: process.env.DB_NAME || "crm_db",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },
};
