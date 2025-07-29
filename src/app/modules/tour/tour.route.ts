import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TourControllers, TourTypeControllers } from "./tour.controller";
import { validateRequest } from "../../middlewares/validatedRequest";
import { TourTypeValidation, TourValidation } from "./tour.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

// Tour Type Routes
router.get(
  "/tour-types",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourTypeControllers.getAllTourType
);

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(TourTypeValidation.tourTypeCreateZodSchema),
  TourTypeControllers.createTourType
);
router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(TourTypeValidation.tourTypeUpdateZodSchema),
  TourTypeControllers.updateTourType
);
router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourTypeControllers.deleteTourType
);

// Tour routes

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.getAllTour
);

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(TourValidation.tourCreateZodSchema),
  TourControllers.createTour
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(TourValidation.tourUpdateZodSchema),
  TourControllers.updateTour
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.deleteTour
);

export const TourRoutes = router;
