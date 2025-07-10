import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validatedRequest";
import { createUserZodSchema } from "./user.validationl";

const router = Router();

router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser);
router.get("/all-users",UserControllers.getAllUsers)
export const UserRoutes = router;
