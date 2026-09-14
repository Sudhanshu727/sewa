import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

// Trust one proxy hop (e.g. nginx/load balancer) so req.ip and secure
// cookies work correctly behind a reverse proxy. Adjust if deployed
// differently.
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true, // required for the httpOnly session cookie
  }),
);
// Small limit: applies only to JSON requests. Team registration takes an ID
// card upload via multipart/form-data instead, which multer parses directly
// (see routes/team.routes.ts + middleware/upload.middleware.ts) and never
// passes through this JSON body parser at all.
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(pinoHttp({ logger }));

app.use("/api", apiRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Must be registered last.
app.use(errorHandler);
