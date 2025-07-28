import express, { NextFunction, Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.route";
import cors from "cors";
import { router } from "./app/routes";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { catchAsync } from "./app/utils/catchAsync";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour Management System Backend",
  });
});

// type asyncfnc = (str: string) => Promise<void>;

// const newfunc = (fn: asyncfnc) => {
//   return (str: string) =>
//     Promise.resolve(fn(str)).catch((e: any) => {
//       console.log("error promise", e.message);
//     });
// };

// const newf = newfunc(async (str: string) => {
//   throw new Error("something went wrong");
// });
// newf("sadid");

app.use(globalErrorHandler);

app.use(notFound);

export default app;
