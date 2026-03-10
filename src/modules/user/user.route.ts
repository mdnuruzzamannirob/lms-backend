import { Router } from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middleware/validate";
import auth from "../../middleware/auth";

const router = Router();

// Current-user profile routes (must come before /:id)
router.get("/me", auth("user", "admin"), UserController.getMe);
router.patch("/me", auth("user", "admin"), UserController.updateMe);

// Admin: list and create users
router
  .route("/")
  .get(auth("admin"), UserController.getAllUsers)
  .post(
    auth("admin"),
    validateRequest(UserValidation.createUser),
    UserController.createUser,
  );

// Admin: manage individual users
router
  .route("/:id")
  .get(
    auth("admin"),
    validateRequest(UserValidation.getUserById),
    UserController.getUserById,
  )
  .patch(
    auth("admin"),
    validateRequest(UserValidation.updateUser),
    UserController.updateUser,
  )
  .delete(auth("admin"), UserController.deleteUser);

export const UserRoutes = router;
