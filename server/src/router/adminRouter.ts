import express from "express";
import { updateProfile } from "../controller/adminController.js";
import {
  forgetPassword,
  login,
  resetPassword,
  signUp,
} from "../controller/authController.js";

const router = express.Router();

router
  .post("/signup", signUp)
  .post("/login", login)
  .post("/confirm-email/:token")
  .post("/forget-password", forgetPassword)
  .post("/reset-password/:token", resetPassword)
  .patch("/update-profile", updateProfile);
export default router;
