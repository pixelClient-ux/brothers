import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import morgan from "morgan";
import { globalErrorHandler } from "./controller/errorController.js";
import memberRouter from "./router/memberRouter.js";
import adminRouter from "./router/adminRouter.js";
import reportRouter from "./router/reportRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "https://brothers-tlcn.vercel.app/",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

const publicDir = path.join(process.cwd(), "src", "public");
app.use(express.static(publicDir));

app.use("/api/v1/members", memberRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/reports", reportRouter);
app.get("/", (req, res) => {
  res.json({ message: "Brothers Gym API is running successfully! 🎉" });
});
app.all("/{*any}", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

app.use(globalErrorHandler);

export default app;
