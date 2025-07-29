"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourValidation = exports.TourTypeValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const tourTypeCreateZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({
        invalid_type_error: "Name must be string",
        required_error: "Name is required",
    })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
});
const tourTypeUpdateZodSchema = tourTypeCreateZodSchema.partial();
exports.TourTypeValidation = {
    tourTypeCreateZodSchema,
    tourTypeUpdateZodSchema,
};
const tourCreateZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({
        invalid_type_error: "Title must be string",
        required_error: "Title is required",
    })
        .min(2, { message: "Title must be at least 2 characters long." })
        .max(100, { message: "Title cannot exceed 100 characters." }),
    // slug: z.string({}).optional()
    description: zod_1.default
        .string({ invalid_type_error: "Description must be string" })
        .optional(),
    images: zod_1.default
        .array(zod_1.default.string().url({ message: "Each image must be a valid URL" }))
        .optional(),
    location: zod_1.default
        .string({ invalid_type_error: "Location must be string" })
        .optional(),
    costForm: zod_1.default
        .number({ invalid_type_error: "Cost must be a number" })
        .optional(),
    startDate: zod_1.default
        .preprocess((val) => new Date(val), zod_1.default.date({ invalid_type_error: "Start date must be a valid date" }))
        .optional(),
    endDate: zod_1.default
        .preprocess((val) => new Date(val), zod_1.default.date({ invalid_type_error: "End date must be a valid date" }))
        .optional(),
    departureLocation: zod_1.default
        .string({ invalid_type_error: "Departure location must be string" })
        .optional(),
    arrivalLocation: zod_1.default
        .string({ invalid_type_error: "Arrival location must be string" })
        .optional(),
    included: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Each included item must be a string" }))
        .optional(),
    excluded: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Each excluded item must be a string" }))
        .optional(),
    aminities: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Each aminities item must be a string" }))
        .optional(),
    tourPlane: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Each tour plane item must be a string" }))
        .optional(),
    maxGuest: zod_1.default
        .number({ invalid_type_error: "Max guest must be a number" })
        .optional(),
    minAge: zod_1.default
        .number({ invalid_type_error: "Min age must be a number" })
        .optional(),
    division: zod_1.default
        .string({ required_error: "Division ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, "Division ID must be a valid MongoDB ObjectId"),
    tourType: zod_1.default
        .string({ required_error: "Tour ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, "Tour ID must be a valid MongoDB ObjectId"),
    deleteImages: zod_1.default.array(zod_1.default.string()).optional(),
});
const tourUpdateZodSchema = tourCreateZodSchema.partial();
exports.TourValidation = {
    tourCreateZodSchema,
    tourUpdateZodSchema,
};
