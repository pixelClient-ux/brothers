import Admin from "../model/adminModel.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import sendEmail from "../utils/sendEmail.js";
import { profileUpdatedTemplate } from "../utils/profileUpdatedTemplate.js";
import { passwordChangedTemplate } from "../utils/passwordChangedTemplate .js";

export const updateProfile = catchAsync(async (req, res, next) => {
  const { email, fullName } = req.body;
  const userId = req.admin._id;

  if (!email || !fullName) {
    return res.status(400).json({
      status: "fail",
      message: "Full name and email are required",
    });
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(
    userId,
    { email, fullName },
    { new: true, runValidators: true }
  );

  if (!updatedAdmin) {
    return next(new AppError("Admin not found", 404));
  }

  try {
    const emailHTML = profileUpdatedTemplate(updatedAdmin.fullName);
    await sendEmail({
      email: updatedAdmin.email,
      subject: "Your profile has been updated",
      html: emailHTML,
    });
  } catch (err) {
    console.error("Failed to send profile update email:", err);
    return next(new AppError("Failed to send profile update email", 500));
  }

  res.status(200).json({
    status: "success",
    data: {
      admin: updatedAdmin,
    },
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.admin._id;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new AppError("All password fields are required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new AppError("New password and confirm password do not match", 400)
    );
  }

  const admin = await Admin.findById(userId).select("+password");

  if (!admin) {
    return next(new AppError("Admin not found", 404));
  }

  const isMatch = await admin.comparePassword(newPassword, admin.password);
  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 401));
  }

  admin.password = newPassword;
  (admin as any).passwordConfirm = undefined;
  await admin.save();

  try {
    const emailHTML = passwordChangedTemplate(admin.fullName);
    await sendEmail({
      email: admin.email,
      subject: "Your password has been changed",
      html: emailHTML,
    });
  } catch (err) {
    console.error("Failed to send password change email:", err);
  }

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});
