import express from "express";
import {
  createMember,
  deleteMember,
  getDashboardStats,
  getMemebr,
  getMemebrs,
  renewMembership,
  updateMember,
} from "../controller/memberController.js";
import {
  resizeMemberAvatar,
  upload,
} from "../middleware/uploadMemberAvatar.js";
import { protect } from "../controller/authController.js";

const router = express.Router();
router
  .get("/", getMemebrs)
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
