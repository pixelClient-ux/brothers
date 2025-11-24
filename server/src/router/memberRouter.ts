import express from "express";
import {
  createMember,
  deleteMember,
  getDashboardStats,
  getMembers,
  getMemebr,
  getMemebrDetails,
  renewMembership,
  updateMember,
  verifyMemberByCode,
} from "../controller/memberController.js";
import {
  resizeMemberAvatar,
  upload,
} from "../middleware/uploadMemberAvatar.js";
import { protect, VerifyAdmin } from "../controller/authController.js";

const router = express.Router();
router.use(protect, VerifyAdmin("admin"));
router
  .get("/", getMembers)
  .get("/getMemebrDetails/:memberCode", getMemebrDetails)
  .get("/verify/:memberCode", verifyMemberByCode)
  .get("/stats", getDashboardStats)
  .post("/create", upload.single("avatar"), resizeMemberAvatar, createMember)
  .get("/:memberId", getMemebr)
  .delete("/:memberId", deleteMember)
  .patch(
    "/updateMember/:memberId",
    upload.single("avatar"),
    resizeMemberAvatar,
    updateMember
  )
  .patch("/renew/:memberId", renewMembership);

export default router;
