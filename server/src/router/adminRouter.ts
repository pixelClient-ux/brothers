import express from "express";
import {
  confirmEmailChange,
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
  .post("/confirm-email/:token", protect, confirmEmailChange)
  .patch(
    "/update-profile",
    protect,
    upload.single("avatar"),
    resizeMemberAvatar,
    updateProfile
  );
export default router;
