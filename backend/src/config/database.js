import mysql from "mysql2/promise";
import { config } from "./index.js";
import { logger } from "../utils/logger.js";

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    logger.info("Database connected successfully");
    connection.release();
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw error;
  }
}

export { pool };
