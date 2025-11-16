import express from "express";
import {
  updatePassword,
  updateProfile,
} from "../controller/adminController.js";
import {
  forgetPassword,
  login,
  logout,
  protect,
  resetPassword,
  signUp,
} from "../controller/authController.js";
import {
  resizeMemberAvatar,
  upload,
} from "../middleware/uploadMemberAvatar.js";

const router = express.Router();
router.post("/signup", signUp);

router
  .post("/login", login)
  .post("/forget-password", forgetPassword)
  .post("/reset-password/:token", resetPassword)
  .post("/update-password", protect, updatePassword)
  .post("/logout", protect, logout)
  .patch(
    "/update-profile",
    protect,
    upload.single("avatar"),
    resizeMemberAvatar,
    updateProfile
  );
export default router;
