import { Router } from "express";
import { BorrowController } from "./borrow.controller";
import { BorrowValidation } from "./borrow.validation";
import validateRequest from "../../middleware/validate";
import auth from "../../middleware/auth";

const router = Router();

// User's own borrow history
router.get(
  "/my-history",
  auth("user", "admin"),
  BorrowController.getMyBorrowHistory,
);

// Admin: overdue list
router.get("/overdue", auth("admin"), BorrowController.getOverdueRecords);

// Borrow a book (admin issues)
router.post(
  "/",
  auth("admin"),
  validateRequest(BorrowValidation.borrowBook),
  BorrowController.borrowBook,
);

// List all borrow records
router.get("/", auth("admin"), BorrowController.getAllBorrowRecords);

// Single record
router.get(
  "/:id",
  auth("admin"),
  validateRequest(BorrowValidation.getById),
  BorrowController.getBorrowRecordById,
);

// Return
router.patch(
  "/:id/return",
  auth("admin"),
  validateRequest(BorrowValidation.returnBook),
  BorrowController.returnBook,
);

// Renew
router.patch(
  "/:id/renew",
  auth("admin"),
  validateRequest(BorrowValidation.renewBook),
  BorrowController.renewBook,
);

// Mark lost
router.patch(
  "/:id/lost",
  auth("admin"),
  validateRequest(BorrowValidation.markLost),
  BorrowController.markLost,
);

export const BorrowRoutes = router;
