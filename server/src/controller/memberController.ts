import Member from "../model/memberModel.js";
import ApiFeature from "../utils/ApiFeatures.js";
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
export const getMemebrs = catchAsync(async (req, res, next) => {
  console.log(req.query);
  let query = Member.find();
  let apiFeature = new ApiFeature(query, req.query)
    .filter()
    .search()
    .range() // move range after search/filter so it doesn’t get overwritten
    .pagination();

  const members = await apiFeature.query;
  const totalMembers = await Member.countDocuments();

  // 4. Send response
  res.status(200).json({
    status: "success",
    results: members.length,
    total: totalMembers,
    data: members,
  });
});

export const getMemebr = catchAsync(async (req, res, next) => {
  const memberId = req.params;
  const member = await Member.findById(memberId);
  if (!member) {
    return next(new AppError("Memver is not exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: member,
  });
});
export const updateMember = catchAsync(async (req, res, next) => {
  const memberId = req.params;
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

  const updateMember = await Member.findByIdAndUpdate(memberId, updatedData, {
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
  const memberId = req.params;
  const { months, amount, method } = req.body;

  if (!months || months <= 0)
    return next(new AppError("Please provide valid months.", 400));
  if (!amount || amount <= 0)
    return next(new AppError("Please provide valid amount.", 400));

  const member = await Member.findById(memberId);
  if (!member) return next(new AppError("Member not found.", 404));

  const updateMember = await member.renewMembership(months, amount, method);
  res.status(200).json({
    status: "success",
    message: `Membership renewed for ${months} month(s)`,
    data: updateMember,
  });
});

export const deleteMember = catchAsync(async (req, res, next) => {
  const memberId = req.params;
  await Member.findByIdAndUpdate(memberId, { isActive: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
