import { Router } from "express";
import { MemberController } from "./member.controller";
import { MemberValidation } from "./member.validation";
import validateRequest from "../../middleware/validate";
import auth from "../../middleware/auth";

const router = Router();

// Current user's membership
router.get("/me", auth("user", "admin"), MemberController.getMyMembership);

router
  .route("/")
  .get(auth("admin"), MemberController.getAllMembers)
  .post(
    auth("admin"),
    validateRequest(MemberValidation.createMember),
    MemberController.createMember,
  );

router
  .route("/:id")
  .get(
    auth("admin"),
    validateRequest(MemberValidation.getById),
    MemberController.getMemberById,
  )
  .patch(
    auth("admin"),
    validateRequest(MemberValidation.updateMember),
    MemberController.updateMember,
  )
  .delete(auth("admin"), MemberController.deleteMember);

export const MemberRoutes = router;
