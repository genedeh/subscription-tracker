import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, any>;
}

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    let error: CustomError = { ...err };
    error.message = err.message;

    console.error(err);

    if (err.name === "CastError") {
      error = new Error("Resource not found");
      error.statusCode = 404;
    }

    if (err.code === 11000) {
      error = new Error("Duplicate field value entered");
      error.statusCode = 400;
    }

    if (
      err.name === "ValidationError" &&
      err instanceof MongooseError.ValidationError
    ) {
      const message = Object.values(err.errors).map((val: any) => val.message);

      error = new Error(message.join(", "));
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  } catch (internalError) {
    next(internalError);
  }
};

export default errorMiddleware;
