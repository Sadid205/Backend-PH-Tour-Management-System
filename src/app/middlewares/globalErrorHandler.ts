//@typescript-eslint/no-explicit-any
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppErrors";
import { handleDuplicateKeyError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { TErrorSources } from "../interfaces/error.types";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response
) => {
  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );
    await Promise.all(imageUrls.map((url) => deleteImageFromCloudinary(url)));
  }
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
