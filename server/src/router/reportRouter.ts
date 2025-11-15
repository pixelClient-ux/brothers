import express from "express";
import {
  generateDashboardReport,
  generateReport,
} from "../controller/reportController.js";
const router = express.Router();

router
  .get("/member-report", generateReport)
  .get("/dashboard-report", generateDashboardReport);

export default router;
