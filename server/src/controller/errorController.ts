import type { NextFunction, Request, Response } from "express";

interface AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
}

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    sendProductionError(err, res);
  } else {
    sendDevelopmentError(err, res);
  }
};

const sendDevelopmentError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProductionError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("💥 ERROR:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong on the server!",
    });
  }
};
