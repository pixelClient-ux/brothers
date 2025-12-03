// src/index.ts  ← Perfect as-is
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { globalErrorHandler } from "./controller/errorController.js";
import memberRouter from "./router/memberRouter.js";
import adminRouter from "./router/adminRouter.js";
import reportRouter from "./router/reportRouter.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

app.use("/api/v1/members", memberRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/reports", reportRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

app.use(globalErrorHandler);

export default app; // ← Perfect for Vercel
