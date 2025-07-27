import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import AppError from "../../errorHelpers/AppErrors";
import { User } from "../user/user.model";
const OTP_EXPIRATION = 2 * 60; // 2 minutes

const generateOTP = (length = 6) => {
  // 6 digit otp
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  // 10 ** 5 => 10 * 10 * 10 * 10 * 10 => 100000
  return otp;
};

const sendOTP = async (email: string, name: string, phone: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError(400, "User not found");
  }
  if (user.isVerified) {
    throw new AppError(400, "User already verified");
  }
  const otp = generateOTP();

  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
  return {};
};
const verifyOTP = async (email: string, otp: string) => {
  //   const user = await User.findOne({ email: email, isVerified: false });
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError(400, "User not found");
  }
  if (user.isVerified) {
    throw new AppError(400, "User already verified");
  }
  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);
  if (!savedOtp) {
    throw new AppError(400, "Invalid Otp");
  }

  if (savedOtp !== otp) {
    throw new AppError(400, "Invalid Otp");
  }

  await Promise.all([
    User.updateOne(
      { email: email },
      { isVerified: true },
      { runValidators: true }
    ),
    redisClient.del([redisKey]),
  ]);
  return {};
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
