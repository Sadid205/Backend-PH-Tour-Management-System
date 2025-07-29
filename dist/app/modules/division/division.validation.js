"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({
        invalid_type_error: "Name must be string",
        required_error: "Name is required",
    })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    //   slug: z
    //     .string({
    //       invalid_type_error: "Slug must be string",
    //       required_error: "Slug is required",
    //     })
    //     .min(2, { message: "Name must be at least 2 characters long." })
    //     .max(50, { message: "Name cannot exceed 50 characters." }),
    thumbnail: zod_1.default
        .string({ invalid_type_error: "Thumbnail must be string" })
        .optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be string" })
        .optional(),
});
exports.updateDivisionZodSchema = exports.createDivisionZodSchema.partial();
