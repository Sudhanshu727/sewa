import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { logger } from "../config/logger.js";
import { isProd } from "../config/env.js";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Multer throws its own error class rather than AppError for things like
  // an oversized file - translated here so the client gets a clear 400
  // instead of a generic 500, without every upload route having to remember
  // to catch this itself.
  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "ID card file is too large (max 5 MB)."
        : err.code === "LIMIT_UNEXPECTED_FILE"
          ? "Unexpected file field in upload."
          : "File upload failed.";
    return res.status(400).json({ error: message });
  }

  // Unexpected error: log full detail internally, return a generic message
  // externally. Never leak stack traces or DB errors to the client.
  logger.error({ err, path: req.path, method: req.method }, "unhandled_error");
  res.status(500).json({
    error: "Something went wrong. Please try again.",
    ...(isProd ? {} : { debug: err instanceof Error ? err.message : String(err) }),
  });
}
