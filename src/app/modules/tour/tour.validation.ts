import z from "zod";

const tourTypeCreateZodSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be string",
      required_error: "Name is required",
    })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
});

const tourTypeUpdateZodSchema = tourTypeCreateZodSchema.partial();

export const TourTypeValidation = {
  tourTypeCreateZodSchema,
  tourTypeUpdateZodSchema,
};

const tourCreateZodSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Title must be string",
      required_error: "Title is required",
    })
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(100, { message: "Title cannot exceed 100 characters." }),
  // slug: z.string({}).optional()
  description: z
    .string({ invalid_type_error: "Description must be string" })
    .optional(),
  images: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .optional(),
  location: z
    .string({ invalid_type_error: "Location must be string" })
    .optional(),
  costForm: z
    .number({ invalid_type_error: "Cost must be a number" })
    .optional(),
  startDate: z
    .preprocess(
      (val) => new Date(val as string),
      z.date({ invalid_type_error: "Start date must be a valid date" })
    )
    .optional(),
  endDate: z
    .preprocess(
      (val) => new Date(val as string),
      z.date({ invalid_type_error: "End date must be a valid date" })
    )
    .optional(),
  departureLocation: z
    .string({ invalid_type_error: "Departure location must be string" })
    .optional(),
  arrivalLocation: z
    .string({ invalid_type_error: "Arrival location must be string" })
    .optional(),
  included: z
    .array(
      z.string({ invalid_type_error: "Each included item must be a string" })
    )
    .optional(),
  excluded: z
    .array(
      z.string({ invalid_type_error: "Each excluded item must be a string" })
    )
    .optional(),
  aminities: z
    .array(
      z.string({ invalid_type_error: "Each aminities item must be a string" })
    )
    .optional(),
  tourPlane: z
    .array(
      z.string({ invalid_type_error: "Each tour plane item must be a string" })
    )
    .optional(),
  maxGuest: z
    .number({ invalid_type_error: "Max guest must be a number" })
    .optional(),
  minAge: z
    .number({ invalid_type_error: "Min age must be a number" })
    .optional(),
  division: z
    .string({ required_error: "Division ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Division ID must be a valid MongoDB ObjectId"),
  tourType: z
    .string({ required_error: "Tour ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Tour ID must be a valid MongoDB ObjectId"),
  deleteImages: z.array(z.string()).optional(),
});

const tourUpdateZodSchema = tourCreateZodSchema.partial();

export const TourValidation = {
  tourCreateZodSchema,
  tourUpdateZodSchema,
};
