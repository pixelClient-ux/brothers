import express from "express";
import {
  createMember,
  deleteMember,
  generateReport,
  getMemebr,
  getMemebrs,
  renewMembership,
  updateMember,
} from "../controller/memberController.js";

const router = express.Router();

router
  .get("/", getMemebrs)
  .get("/reports", generateReport)
  .post("/create", createMember)
  .get("/:memberId", getMemebr)
  .delete("/:memberId", deleteMember)
  .patch("/updateMember/:memberId", updateMember)
  .patch("/renew/:memberId", renewMembership);

export default router;
