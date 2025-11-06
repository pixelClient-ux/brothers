import express from "express";
import {
  createMember,
  deleteMember,
  getMemebr,
  getMemebrs,
  renewMembership,
  updateMember,
} from "../controller/memberController.js";

const router = express.Router();

router
  .get("/", getMemebrs)
  .post("/create", createMember)
  .get("/:memberId", getMemebr)
  .delete("/:memberId", deleteMember)
  .patch("/:memberId", updateMember)
  .post("/renew/:memberId", renewMembership);

export default router;
