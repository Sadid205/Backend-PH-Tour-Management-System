import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppErrors";
import mongoose from "mongoose";
import { handleDuplicateKeyError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { TErrorSources } from "../interfaces/error.types";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Global Error Handler:", err);
  }
  /**
   * Mongoose
   * Zod
   *
   */

  /**
   * -duplicate key error
   * - Cast Error
   * - Validation Error
   * - Zod Error
   */
  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = `Something Went Wrong!!`;
  // duplicate key error
  if (err.code === 11000) {
    const simplyfiedError = handleDuplicateKeyError(err);
    statusCode = simplyfiedError.statusCode;
    message = simplyfiedError.message;
  } else if (err.name === "CastError") {
    const simplyfiedError = handleCastError(err);
    statusCode = simplyfiedError.statusCode;
    message = simplyfiedError.message;
  } else if (err.name === "ZodError") {
    const simplyfiedError = handleZodError(err);
    statusCode = simplyfiedError.statusCode;
    message = simplyfiedError.message;
    errorSources = simplyfiedError.errorSources as TErrorSources[];
  }
  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const simplyfiedError = handleValidationError(err);
    statusCode = simplyfiedError.statusCode;
    message = simplyfiedError.message;
    errorSources = simplyfiedError.errorSources as TErrorSources[];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
