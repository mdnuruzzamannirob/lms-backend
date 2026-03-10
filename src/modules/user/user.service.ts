import User from "./user.model";
import { IUser } from "./user.interface";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

interface UserQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  role?: string;
  isActive?: boolean;
}

const createUser = async (payload: Partial<IUser>) => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    throw new AppError("Email already in use", StatusCodes.CONFLICT);
  }
  const user = await User.create(payload);
  return User.findById(user._id).select("-password").lean();
};

const getAllUsers = async (options: UserQueryOptions) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    role,
    isActive,
  } = options;

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role) filter.role = role;
  if (typeof isActive !== "undefined") filter.isActive = isActive;

  const skip = (page - 1) * limit;
  const sortObj: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .select("-password")
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    data: users,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getUserById = async (id: string) => {
  const user = await User.findById(id).select("-password").lean();
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  return user;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .lean();
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  return user;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  return null;
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
