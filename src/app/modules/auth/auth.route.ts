import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword
);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.setPassword
);
router.post(
  "/forgote-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.forgotPassword
);
// Frontend -> forgot-password -> email -> user status check -> short expiration token (valid for 10 min) -> email -> Frontend Link http://localhost:5073/reset-password?email=sadid@gmail.com&token=token -> frontend e query theke  user er email and token extract kore anbo -> new password user thek nibe -> backend er /reset-password api -> authorization = token -> newPassword -> token verify -> hash password-> save user password
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.setPassword
);
// /booking -> /login -> successful google login -> /booking frontend
// /login -> successfull google login -> /frontend
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res);
  }
);
// /api/v1/auth/google/callback?state=/booking
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with our support team!`,
  }),
  AuthControllers.googleCallbackController
);

export const AuthRoutes = router;
