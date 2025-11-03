import express from "express";
import { updateProfile } from "../controller/adminController.js";
import {
  forgetPassword,
  login,
  protect,
  resetPassword,
  signUp,
} from "../controller/authController.js";

const router = express.Router();
router.post("/signup", signUp);
router.use(protect);
router
  .post("/login", login)
  .post("/forget-password", forgetPassword)
  .post("/reset-password/:token", resetPassword)
  .patch("/update-profile", updateProfile);
export default router;
