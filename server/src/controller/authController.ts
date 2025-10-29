import { AppError } from "../utils/AppError.js";
import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import Admin from "../model/adminModel.js";
import { resetPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";
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
      expiresIn: process.env.JWT_EXPIRES_IN as string,
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
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string) *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);
  (admin as any).password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    message,
    data: { admin },
  });
};

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export const signUp = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;

  const admin = await Admin.create({
    email,
    password,
    passwordConfirm,
  });

  createSendToken(admin, 201, res, "Account created successfully!");
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
  if (!admin.comparePassword(password, admin.password)) {
    return next(new AppError("invalid email or password", 401));
  }
  createSendToken(admin, 200, res, "Logged in successfully!");
});

export const restrictTo = (...roles: string[]) => {
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
  const { password, passwordConfirm } = req.body;

  const hashedToken = crypto.createHash("sha256").digest("hex");

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

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in. Please log in to get access.", 401)
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    const currentUser = await Admin.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

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

    (req as any).user = currentUser;
    next();
  }
);
