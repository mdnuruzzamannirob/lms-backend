import { Router } from "express";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";
import validateRequest from "../../middleware/validate";
import auth from "../../middleware/auth";

const router = Router();

router
  .route("/")
  .get(auth("user", "admin"), CategoryController.getAllCategories)
  .post(
    auth("admin"),
    validateRequest(CategoryValidation.createCategory),
    CategoryController.createCategory,
  );

router
  .route("/:id")
  .get(
    auth("user", "admin"),
    validateRequest(CategoryValidation.getById),
    CategoryController.getCategoryById,
  )
  .patch(
    auth("admin"),
    validateRequest(CategoryValidation.updateCategory),
    CategoryController.updateCategory,
  )
  .delete(auth("admin"), CategoryController.deleteCategory);

export const CategoryRoutes = router;
