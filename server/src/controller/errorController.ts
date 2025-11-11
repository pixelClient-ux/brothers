import type { NextFunction, Request, Response } from "express";
import multer from "multer";
interface AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  code?: string;
  type?: string;
}

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      err.message = "File is too large. Maximum size allowed is 5MB.";
      err.statusCode = 400;
      err.status = "fail";
      err.isOperational = true;
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      err.message = "Unexpected file field.";
      err.statusCode = 400;
      err.status = "fail";
      err.isOperational = true;
    }
  }
  if (err.code === "ENTITY_TOO_LARGE" || err.type === "entity.too.large") {
    err.message = "Image upload is too large.";
    err.statusCode = 413;
    err.status = "fail";
    err.isOperational = true;
  }
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
