import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { teamRouter } from "./team.routes.js";
import { profileRouter } from "./profile.routes.js";
import { contactRouter } from "./contact.routes.js";
import { announcementsRouter } from "./announcements.routes.js";
import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/register", teamRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/announcements", announcementsRouter);

apiRouter.get("/health", async (_req, res) => {
  try {
    // Test database connection with a simple query
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "OK",
      message: "SEWA 2026 backend and database are connected!",
    });
  } catch (err) {
    logger.error({ err }, "health_check_failed");

    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
    });
  }
});
