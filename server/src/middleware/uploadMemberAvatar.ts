// src/middleware/uploadMemberAvatar.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import type { Request, Response, NextFunction } from "express";

const membersDir = path.join(
  process.cwd(),
  "..",
  "client",
  "public",
  "images",
  "members"
);

fs.mkdirSync(membersDir, { recursive: true });

// multer in memory
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

// after multer, call this to resize & save
export const resizeMemberAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return next();

    const uniqueName = `member-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.jpeg`;
    const outPath = path.join(membersDir, uniqueName);

    await sharp(req.file.buffer)
      .resize(500, 500, { fit: "cover" })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(outPath);

    req.body.avatar = `/images/members/${uniqueName}`;
    next();
  } catch (err) {
    next(err);
  }
};
