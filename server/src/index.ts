import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { globalErrorHandler } from "./controller/errorController.js";
import memberRouter from "./router/memberRouter.js";
import adminRouter from "./router/adminRouter.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/api/v1/members", memberRouter);
app.use("/api/v1/admins", adminRouter);

app.all("/{*any}", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

app.use(globalErrorHandler);

export default app;
