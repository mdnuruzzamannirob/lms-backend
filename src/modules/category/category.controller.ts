import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CategoryService } from "./category.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Category created successfully",
    data: category,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const data = await CategoryService.getAllCategories(
    req.query.search as string | undefined,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Categories retrieved successfully",
    data,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const data = await CategoryService.getCategoryById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category retrieved successfully",
    data,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const data = await CategoryService.updateCategory(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category updated successfully",
    data,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category deleted successfully",
    data: null,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
