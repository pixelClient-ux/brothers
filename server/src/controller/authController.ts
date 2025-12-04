import { AppError } from "../utils/AppError.js";
import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import Admin from "../model/adminModel.js";
import { resetPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";
import { welcomeEmailTemplate } from "../utils/welcomeTemplateEmail.js";
import dotenv from "dotenv";
dotenv.config();
interface DecodedToken extends JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

interface adminDoc extends Document {
  _id: Types.ObjectId;
  email: string;
  role?: string;
  password?: string;
}

const signToken = (id: Types.ObjectId) => {
  return jwt.sign(
    { id },
    JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    } as jwt.SignOptions
  );
};

const createSendToken = (
  admin: adminDoc,
  statusCode: number,
  res: Response,
  message: string
) => {
  const token = signToken(admin._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".brothers-1.onrender.com",
    path: "/",
    maxAge: 86400000,
  });

  (admin as any).password = undefined;

  res.status(statusCode).json({
    status: "success",

    message,
  });
};
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export const signUp = catchAsync(async (req, res, next) => {
  const { fullName, email, password, passwordConfirm } = req.body;

  const admin = await Admin.create({
    fullName,
    email,
    password,
    passwordConfirm,
  });

  await createSendToken(admin, 201, res, "Account created successfully!");
  await sendEmail({
    email: admin.email,
    subject: "🎉 Welcome to GYM Fitness!",
    html: welcomeEmailTemplate(admin.fullName, "GYM Fitness"),
  });
});
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.comparePassword(password, admin.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  createSendToken(admin, 200, res, "Logged in successfully!");
});

export const logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    status: "success",
  });
});

export const VerifyAdmin = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const admin = req.admin;

    if (!admin) {
      return next(new AppError("admin not authenticated", 401));
    }

    if (!allowedRoles.includes(admin.role)) {
      return next(
        new AppError("You are not allowed to perform this action", 403)
      );
    }

    next();
  };
};

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return next(new AppError("Admin not found", 404));

  const resetToken = admin.createPasswordResetToken();
  await admin.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/resetPassword/${resetToken}`;
  const html = resetPasswordTemplate(resetURL);

  try {
    await sendEmail({
      email: admin.email,
      subject: "Reset your password - GYM Fitness",
      html,
    });

    res.status(200).json({
      status: "success",
      message: "Reset token sent to email!",
    });
  } catch (err) {
    (admin as any).passwordResetToken = undefined;
    (admin as any).passwordResetExpires = undefined;
    await admin.save({ validateBeforeSave: false });
    return next(new AppError("Error sending email. Try again later.", 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const { password, passwordConfirm } = req.body;
  if (!token) {
    return next(new AppError("Somethin went wrong,please try again", 400));
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!admin) {
    return next(new AppError("Token is invalid or expires", 400));
  }

  admin.password = password;
  admin.passwordConfirm = passwordConfirm;
  (admin as any).passwordResetToken = undefined;
  (admin as any).passwordResetExpires = undefined;
  admin.save();
  createSendToken(admin, 200, res, "Password reset successful — welcome back!");
});

export const protect = catchAsync(async (req, res, next) => {
  // 1️⃣ Get token from cookie
  const token = req.cookies?.jwt;

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access.", 401)
    );
  }

  // 2️⃣ Verify token
  let decoded: DecodedToken;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
  } catch (err) {
    return next(
      new AppError("Invalid or expired token. Please log in again.", 401)
    );
  }

  // 3️⃣ Check if admin still exists
  const currentUser = await Admin.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // 4️⃣ Check if admin changed password after token was issued
  if (currentUser.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      currentUser.passwordChangedAt.getTime() / 1000
    );
    if (decoded.iat < changedTimestamp) {
      return next(
        new AppError(
          "User recently changed password. Please log in again.",
          401
        )
      );
    }
  }

  // ✅ Grant access
  req.admin = currentUser;
  next();
});
