import express from "express";
import {
  generateDashboardReport,
  generateReport,
} from "../controller/reportController.js";
import { protect, VerifyAdmin } from "../controller/authController.js";
const router = express.Router();
router.use(protect, VerifyAdmin("admin"));
router
  .get("/member-report", generateReport)
  .get("/dashboard-report", generateDashboardReport);

export default router;
