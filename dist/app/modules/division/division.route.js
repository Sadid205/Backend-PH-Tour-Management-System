"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionRoutes = void 0;
const express_1 = require("express");
const validatedRequest_1 = require("../../middlewares/validatedRequest");
const division_validation_1 = require("./division.validation");
const division_controller_1 = require("./division.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
/**
 * {
 * file:Image
 * data:body text data => req.body => req.body.data
 * }
 */
// Form data -> body,file
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single("file"), (0, validatedRequest_1.validateRequest)(division_validation_1.createDivisionZodSchema), division_controller_1.DivisionControllers.createDivision);
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), division_controller_1.DivisionControllers.getAllDivision);
router.get("/:slug", division_controller_1.DivisionControllers.getSingleDivision);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single("file"), (0, validatedRequest_1.validateRequest)(division_validation_1.updateDivisionZodSchema), division_controller_1.DivisionControllers.updateDivision);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), division_controller_1.DivisionControllers.deleteDivision);
exports.DivisionRoutes = router;
