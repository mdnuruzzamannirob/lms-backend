import { Router } from "express";
import { FineController } from "./fine.controller";
import { FineValidation } from "./fine.validation";
import validateRequest from "../../middleware/validate";
import auth from "../../middleware/auth";

const router = Router();

// User's own fines
router.get("/me", auth("user", "admin"), FineController.getMyFines);

// Admin: list all fines
router.get("/", auth("admin"), FineController.getAllFines);

// Admin: single fine
router.get(
  "/:id",
  auth("admin"),
  validateRequest(FineValidation.getById),
  FineController.getFineById,
);

// Admin: pay a fine
router.patch(
  "/:id/pay",
  auth("admin"),
  validateRequest(FineValidation.payFine),
  FineController.payFine,
);

// Admin: waive a fine
router.patch(
  "/:id/waive",
  auth("admin"),
  validateRequest(FineValidation.waiveFine),
  FineController.waiveFine,
);

export const FineRoutes = router;
