import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validatedRequest";
import { createUserZodSchema } from "./user.validationl";
import AppError from "../../errorHelpers/AppErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jtw";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);
export const UserRoutes = router;
