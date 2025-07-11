import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { User } from "./user.model";
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppErrors";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { verifyToken } from "../../utils/jtw";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //   message: "User Created Successfully",
    //   user,
    // });
    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;
    const verifiedToken = req.user
    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    // res.status(httpStatus.CREATED).json({
    //   message: "User Created Successfully",
    //   user,
    // });
    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Updated Successfully",
      data: user!,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "All Users Retrieve successfully",
    //   data: users,
    // });
    sendResponse<IUser[]>(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All Users Retrieve successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers,
};

// route matching -> controller -> service -> model -> DB
