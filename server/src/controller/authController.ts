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
import type { CookieOptions } from "express";
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

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIES_EXPIRES_IN as string) *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  res.cookie("jwt", token, cookieOptions);

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
    return next(new AppError("Please provided email and password", 400));
  }

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    return next(new AppError("admin is not found", 400));
  }
  const isMatch = await admin.comparePassword(password, admin.password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }
  createSendToken(admin, 200, res, "Logged in successfully!");
});

export const VerifyAdmin = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.admin.roles)) {
      return next(
        new AppError("you are not allowed to perfrom this action", 401)
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

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/admin/resetPassword/${resetToken}`;
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
  console.log("request Cookis😁💥", req.cookies);
  console.log("request header💥", req.headers);

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
