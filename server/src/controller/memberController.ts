import Member from "../model/memberModel.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createMember = catchAsync(async (req, res, next) => {
  const { fullName, phone, avatar, gender, membership, payments } = req.body;

  const exitingUser = await Member.findOne({ phone });
  if (exitingUser) {
    return next(new AppError("Member with this phone already exists", 409));
  }

  const newMember = await Member.create({
    fullName,
    phone,
    gender,
    avatar,
    membership,
    payments,
  });

  res.status(200).json({
    status: "success",
    message: "Member created successfully",
    data: newMember,
  });
});

export const updateMember = catchAsync(async (req, res, next) => {
  const userId = 123;
  const allowedFields = [
    "fullName",
    "phone",
    "gender",
    "avatar",
    "membership",
    "payments",
  ];

  const updatedData: Record<string, any> = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      updatedData[key] = req.body[key];
    }
  });

  if (Object.keys(updatedData).length === 0) {
    return next(new AppError("No valid fields provided for update", 400));
  }

  const updateMember = await Member.findByIdAndUpdate(userId, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Member updated successfully",
    data: updateMember,
  });
});

export const renewMembership = catchAsync(async (req, res, next) => {
  const memberId = 1234;
  const { months } = req.body;

  const member = await Member.findById(memberId);

  if (!member) {
    return next(new AppError("Member not found", 404));
  }

  const updateMember = await member.renewMembership(months);
  res.status(200).json({
    status: "success",
    message: `Membership renewed for ${months} month(s)`,
    data: updateMember,
  });
});

export const deleteMember = catchAsync(async (req, res, next) => {
  const userId = 4234152;
  await Member.findByIdAndUpdate(userId, { isActive: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
