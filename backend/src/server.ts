import { mkdirSync } from "node:fs";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { prisma } from "./config/prisma.js";
import { startOtpCleanupJob } from "./services/cleanup.service.js";

// Created eagerly at startup rather than lazily on first upload, so a
// missing/unwritable upload path fails loudly at boot instead of as a 500
// on someone's team registration.
mkdirSync(env.UPLOAD_DIR, { recursive: true });

const server = app.listen(env.PORT, () => {
  logger.info(`SEWA 2026 backend listening on port ${env.PORT} [${env.NODE_ENV}]`);
});

// Start OTP cleanup job after server starts (or before, doesn't matter)
startOtpCleanupJob();

async function shutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
