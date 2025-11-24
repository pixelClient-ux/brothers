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
  VerifyAdmin,
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
  .post("/reset-password/:token", resetPassword);
router.use(protect, VerifyAdmin("admin"));
router
  .post("/update-password", updatePassword)
  .post("/logout", logout)
  .post("/confirm-email/:token", confirmEmailChange)
  .patch(
    "/update-profile",
    upload.single("avatar"),
    resizeMemberAvatar,
    updateProfile
  );

export default router;
