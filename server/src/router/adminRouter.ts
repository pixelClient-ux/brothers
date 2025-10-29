import express from "express";

const router = express.Router();

router
  .post("/signup")
  .post("/forget-password")
  .post("/reset-password")
  .patch("/update-profile");
