import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../user/user.model";
import AppError from "../../errors/AppError";
import { config } from "../../config";
import {
  ILoginPayload,
  IRegisterPayload,
  ITokenPayload,
  IChangePasswordPayload,
} from "./auth.interface";

const createToken = (
  payload: ITokenPayload,
  secret: string,
  expiresIn: string,
): string => {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

const register = async (payload: IRegisterPayload) => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    throw new AppError("Email already in use", StatusCodes.CONFLICT);
  }

  const user = await User.create({ ...payload, role: "user" });
  const tokenPayload: ITokenPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = createToken(
    tokenPayload,
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRES_IN,
  );
  const refreshToken = createToken(
    tokenPayload,
    config.JWT_REFRESH_SECRET,
    config.JWT_REFRESH_EXPIRES_IN,
  );

  return { accessToken, refreshToken };
};

const login = async (payload: ILoginPayload) => {
  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }
  if (!user.isActive) {
    throw new AppError("Account is deactivated", StatusCodes.FORBIDDEN);
  }

  const isMatch = await user.isPasswordMatch(payload.password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  const tokenPayload: ITokenPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = createToken(
    tokenPayload,
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRES_IN,
  );
  const refreshToken = createToken(
    tokenPayload,
    config.JWT_REFRESH_SECRET,
    config.JWT_REFRESH_EXPIRES_IN,
  );

  return { accessToken, refreshToken };
};

const refreshAccessToken = async (token: string) => {
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    throw new AppError(
      "Invalid or expired refresh token",
      StatusCodes.UNAUTHORIZED,
    );
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  if (!user.isActive) {
    throw new AppError("Account is deactivated", StatusCodes.FORBIDDEN);
  }
  if (user.isPasswordChangedAfter(decoded.iat as number)) {
    throw new AppError(
      "Password changed recently. Please log in again",
      StatusCodes.UNAUTHORIZED,
    );
  }

  const tokenPayload: ITokenPayload = {
    userId: user._id.toString(),
    role: user.role,
  };
  const accessToken = createToken(
    tokenPayload,
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRES_IN,
  );

  return { accessToken };
};

const changePassword = async (
  userId: string,
  payload: IChangePasswordPayload,
) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const isMatch = await user.isPasswordMatch(
    payload.currentPassword,
    user.password,
  );
  if (!isMatch) {
    throw new AppError(
      "Current password is incorrect",
      StatusCodes.UNAUTHORIZED,
    );
  }

  user.password = payload.newPassword;
  await user.save();
  return null;
};

export const AuthService = {
  register,
  login,
  refreshAccessToken,
  changePassword,
};
