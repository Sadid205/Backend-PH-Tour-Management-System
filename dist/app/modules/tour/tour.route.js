"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const tour_controller_1 = require("./tour.controller");
const validatedRequest_1 = require("../../middlewares/validatedRequest");
const tour_validation_1 = require("./tour.validation");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
// Tour Type Routes
router.get("/tour-types", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourTypeControllers.getAllTourType);
router.post("/create-tour-type", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validatedRequest_1.validateRequest)(tour_validation_1.TourTypeValidation.tourTypeCreateZodSchema), tour_controller_1.TourTypeControllers.createTourType);
router.patch("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validatedRequest_1.validateRequest)(tour_validation_1.TourTypeValidation.tourTypeUpdateZodSchema), tour_controller_1.TourTypeControllers.updateTourType);
router.delete("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourTypeControllers.deleteTourType);
// Tour routes
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourControllers.getAllTour);
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validatedRequest_1.validateRequest)(tour_validation_1.TourValidation.tourCreateZodSchema), tour_controller_1.TourControllers.createTour);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validatedRequest_1.validateRequest)(tour_validation_1.TourValidation.tourUpdateZodSchema), tour_controller_1.TourControllers.updateTour);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourControllers.deleteTour);
exports.TourRoutes = router;
