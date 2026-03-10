import { StatusCodes } from "http-status-codes";
import Category from "./category.model";
import { ICategory } from "./category.interface";
import AppError from "../../errors/AppError";

const createCategory = async (payload: Partial<ICategory>) => {
  const existing = await Category.findOne({ name: payload.name });
  if (existing) {
    throw new AppError("Category already exists", StatusCodes.CONFLICT);
  }
  return Category.create(payload);
};

const getAllCategories = async (search?: string) => {
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  return Category.find(filter).sort({ name: 1 }).lean();
};

const getCategoryById = async (id: string) => {
  const category = await Category.findById(id).lean();
  if (!category) {
    throw new AppError("Category not found", StatusCodes.NOT_FOUND);
  }
  return category;
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();
  if (!category) {
    throw new AppError("Category not found", StatusCodes.NOT_FOUND);
  }
  return category;
};

const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!category) {
    throw new AppError("Category not found", StatusCodes.NOT_FOUND);
  }
  return null;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
