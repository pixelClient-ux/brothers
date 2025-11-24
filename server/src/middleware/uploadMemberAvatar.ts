import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 3 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new AppError("Only image files are allowed", 400) as any,
        false
      );
    }
    cb(null, true);
  },
});

type CloudResult = {
  public_id: string;
  secure_url: string;
  signature?: string;
  [k: string]: any;
};

const uploadBufferToCloudinary = (buffer: Buffer, folder = "gym-members") => {
  return new Promise<CloudResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", overwrite: true, invalidate: true },
      (err, res) => {
        if (err) return reject(err);
        resolve(res as CloudResult);
      }
    );
    stream.end(buffer);
  });
};

export const resizeMemberAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return next();

    const fileBuffer = (req.file as Express.Multer.File).buffer;
    const result = await uploadBufferToCloudinary(fileBuffer, "gym-members");

    req.body.avatar = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    next();
  } catch (err: any) {
    console.error("Cloudinary upload failed:", err);
    return next(new AppError("Failed to upload avatar", 500));
  }
};
