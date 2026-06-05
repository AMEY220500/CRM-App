import { app } from "./app.js";
import { config } from "./config/index.js";
import { testConnection } from "./config/database.js";
import { logger } from "./utils/logger.js";

async function bootstrap() {
  try {
    // Test database connection
    await testConnection();

    // Start server
    app.listen(config.port, () => {
      logger.info(
        `Server running on port ${config.port} in ${config.nodeEnv} mode`,
      );
      logger.info(`Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
