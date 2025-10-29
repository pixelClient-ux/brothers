import express from "express";

const router = express.Router();

router
  .get("/")
  .post("/")
  .get("/:memberId")
  .delete("/:memberId")
  .patch("/:memberId")
  .post("/memberId/renew");

export default router;
