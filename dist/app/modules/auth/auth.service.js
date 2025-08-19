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
exports.AuthServices = void 0;
//@typescript-eslint/no-explicit-any
// @typescript-eslint/no-non-null-assertion
const AppErrors_1 = __importDefault(require("../../errorHelpers/AppErrors"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("../user/user.interface");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const userTokens_1 = require("../../utils/userTokens");
const sendEmail_1 = require("../../utils/sendEmail");
// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;
//   const isUserExist = await User.findOne({ email });
//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
//   }
//   const isPasswordMatched = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string
//   );
//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
//   }
//   const userTokens = createUserTokens(isUserExist);
//   const { password: pass, ...rest } = isUserExist.toObject();
//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userTokens_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken,
    };
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id != decodedToken.userId) {
        throw new AppErrors_1.default(401, "You can not reset your password");
    }
    const isUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new AppErrors_1.default(401, "User does not exist!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    isUserExist.password = hashedPassword;
    yield isUserExist.save();
    return {};
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
    }
    if (!isUserExist.isVerified) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m",
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink,
        },
    });
    /**
     * http://localhost:5173/reset-password?
     * id=68749887c98d25ec805a8551&
     * token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vy
     * SWQiOiI2ODc0OTg4N2M5OGQyNWVjODA1YTg1NTEiLCJlbWFp
     * bCI6ImFiZHVsbGFoYWxzYWRpZDE5MTRAZ21haWwuY29tIiwi
     * cm9sZSI6IlVTRVIiLCJpYXQiOjE3NTMzNTU2MzksImV4cCI6
     * MTc1MzM1NjIzOX0.sgs_OH9iCBl5ZhFoJpY1epCsGBqRuihH35sIGqhpvok
     */
});
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppErrors_1.default(404, "User not found");
    }
    if (user.password &&
        user.auths.some((providerObject) => providerObject.provider === "credentials")) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already set your password. Now you can change the password from your profile password update");
    }
    if (user.auths.some((providerObject) => providerObject.provider === "google")) {
        const hashedPassword = yield bcryptjs_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const credentialsProvider = {
            provider: "credentials",
            providerId: user.email,
        };
        const auths = [...user.auths, credentialsProvider];
        user.password = hashedPassword;
        user.auths = auths;
        yield user.save();
    }
    return {};
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppErrors_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old Password does not match");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.save();
});
exports.AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword,
    setPassword,
    changePassword,
    forgotPassword,
};
