import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "User created successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const options = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    sortBy: req.query.sortBy as string | undefined,
    sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
    search: req.query.search as string | undefined,
    role: req.query.role as string | undefined,
    isActive:
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined,
  };
  const result = await UserService.getAllUsers(options);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User retrieved successfully",
    data: user,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.user!.userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Profile retrieved successfully",
    data: user,
  });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  // Prevent users from escalating privileges or modifying sensitive fields
  const { role, isActive, isDeleted, password, ...safeUpdates } = req.body;
  void role;
  void isActive;
  void isDeleted;
  void password;
  const user = await UserService.updateUser(req.user!.userId, safeUpdates);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Profile updated successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.updateUser(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User updated successfully",
    data: user,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await UserService.deleteUser(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User deleted successfully",
    data: null,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  getMe,
  updateMe,
  updateUser,
  deleteUser,
};
