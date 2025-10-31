import express from "express";
import { updateProfile } from "../controller/adminController.js";
import {
  forgetPassword,
  resetPassword,
  signUp,
} from "../controller/authController.js";

const router = express.Router();

router
  .post("/signup", signUp)
  .post("/forget-password", forgetPassword)
  .post("/reset-password", resetPassword)
  .patch("/update-profile", updateProfile);
export default router;
