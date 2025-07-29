"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const AppErrors_1 = __importDefault(require("../errorHelpers/AppErrors"));
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handleCastError_1 = require("../helpers/handleCastError");
const handleZodError_1 = require("../helpers/handleZodError");
const handleValidationError_1 = require("../helpers/handleValidationError");
const cloudinary_config_1 = require("../config/cloudinary.config");
const globalErrorHandler = (err, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = req.files.map((file) => file.path);
        yield Promise.all(imageUrls.map((url) => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    if (env_1.envVars.NODE_ENV === "development") {
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
    let errorSources = [];
    let statusCode = 500;
    let message = `Something Went Wrong!!`;
    // duplicate key error
    if (err.code === 11000) {
        const simplyfiedError = (0, handleDuplicateError_1.handleDuplicateKeyError)(err);
        statusCode = simplyfiedError.statusCode;
        message = simplyfiedError.message;
    }
    else if (err.name === "CastError") {
        const simplyfiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplyfiedError.statusCode;
        message = simplyfiedError.message;
    }
    else if (err.name === "ZodError") {
        const simplyfiedError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simplyfiedError.statusCode;
        message = simplyfiedError.message;
        errorSources = simplyfiedError.errorSources;
    }
    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplyfiedError = (0, handleValidationError_1.handleValidationError)(err);
        statusCode = simplyfiedError.statusCode;
        message = simplyfiedError.message;
        errorSources = simplyfiedError.errorSources;
    }
    else if (err instanceof AppErrors_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message: message,
        errorSources,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
});
exports.globalErrorHandler = globalErrorHandler;
