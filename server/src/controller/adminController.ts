import Admin from "../model/adminModel.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import sendEmail from "../utils/sendEmail.js";
import { passwordChangedTemplate } from "../utils/passwordChangedTemplate .js";
import { confirmEmailChangeTemplate } from "../utils/confirmEmailChangeTemplate.js";
import crypto from "crypto";

export const updateProfile = catchAsync(async (req, res, next) => {
  const { email, fullName } = req.body;
  const adminId = req.admin._id;
  const admin = await Admin.findById(adminId);

  if (!admin) {
    return next(new AppError("Admin not found", 404));
  }

  if (fullName && fullName !== admin.fullName) {
    admin.fullName = fullName;
  }

  if (req.body.avatar) {
    admin.avatar = req.body.avatar;
  }

  if (email && email !== admin.email) {
    const token = admin.generateEmailChangeToken(email);
    await admin.save({ validateBeforeSave: false });

    const confirmUrl = `${process.env.CLIENT_URL}/confirm_email/${token}`;
    const emailHTML = confirmEmailChangeTemplate(
      confirmUrl,
      admin.fullName,
      email
    );

    await sendEmail({
      email: email,
      subject: "Confirm your new email address",
      html: emailHTML,
    });

    return res.status(200).json({
      status: "success",
      message:
        "A confirmation email has been sent to your Email. Please verify to complete the change.",
    });
  }

  await admin.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
  });
});

export const confirmEmailChange = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return next(new AppError("Somethin went wrong ,please try again", 400));
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const admin = await Admin.findOne({
    emailConfirmToken: hashedToken,
    emailConfirmExpires: { $gt: Date.now() },
  });

  if (!admin) {
    return next(
      new AppError("Invalid or expired email confirmation token", 400)
    );
  }

  admin.email = admin.pendingEmail!;
  (admin as any).pendingEmail = undefined;
  (admin as any).emailChangeToken = undefined;
  (admin as any).emailChangeTokenExpires = undefined;

  await admin.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Email successfully updated!",
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const adminId = req.admin._id;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new AppError("All password fields are required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new AppError("New password and confirm password do not match", 400)
    );
  }

  const admin = await Admin.findById(adminId).select("+password");
  if (!admin) {
    return next(new AppError("Admin not found", 404));
  }

  const isMatch = await admin.comparePassword(currentPassword, admin.password);
  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 401));
  }

  admin.password = newPassword;
  admin.passwordConfirm = confirmPassword;
  await admin.save();

  try {
    const emailHTML = passwordChangedTemplate(admin.fullName);
    await sendEmail({
      email: admin.email,
      subject: "Your password has been changed",
      html: emailHTML,
    });
  } catch (err) {}

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});
