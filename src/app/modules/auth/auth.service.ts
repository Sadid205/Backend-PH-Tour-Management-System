import AppError from "../../errorHelpers/AppErrors";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../utils/jtw";
import { envVars } from "../../config/env";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
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
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  // const user = await User.findById(decodedToken.userId);
  // const isOldPasswordMatch = await bcryptjs.compare(
  //   oldPassword,
  //   user!.password as string
  // );
  // if (!isOldPasswordMatch) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
  // }
  // user!.password = await bcryptjs.hash(
  //   newPassword,
  //   Number(envVars.BCRYPT_SALT_ROUND)
  // );
  // user!.save();
  return {};
};
const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set your password. Now you can change the password from your profile password update"
    );
  }
  if (
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    const hashedPassword = await bcryptjs.hash(
      plainPassword,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
    const credentialsProvider: IAuthProvider = {
      provider: "credentials",
      providerId: user.email,
    };
    const auths: IAuthProvider[] = [...user.auths, credentialsProvider];
    user.password = hashedPassword;
    user.auths = auths;
    await user.save();
  }

  return {};
};
const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
  }
  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user!.save();
};

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword,
  setPassword,
  changePassword,
};
